import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwtHelper";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    console.log('isAuthMiddleware',accessToken)
    if(!accessToken && !refreshToken){
        res.status(401).json({message: 'accessToken and refreshToken not found'})
    }
    if (!accessToken) {
        res.status(401).json({ message: 'Access token expired' })
        return;
    }
    try {
        const decoded = verifyAccessToken(accessToken)
        if (!decoded) {
            res.status(401).json({ message: 'Invalid access token' })
            return
        }
        //attch access token to request object
        (req as AuthenticatedRequest).user = decoded;
        next();
    } catch (error) {
        console.log('isAuthMiddleware error',error)
        if (error instanceof TokenExpiredError) {
            res.status(401).json({ message: 'Access token expired' })
        } else if (error instanceof JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid access token' })
        } else {
            res.status(401).json({ message: 'Invalid access token' })
        }
    }
}

//verify admin token
export const isAdminAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const accessToken = req.cookies?.adminAccessToken;
    const refreshToken = req.cookies?.adminRefreshToken;
    console.log('isAdminAuthMiddleware',accessToken)
    if(!accessToken && !refreshToken){
        res.status(401).json({message: 'accessToken and refreshToken not found'})
    }
    if (!accessToken) {
        res.status(401).json({ message: 'Admin access token expired' })
        return;
    }
    try {
        const decoded = verifyAccessToken(accessToken)
        if (!decoded) {
            res.status(401).json({ message: 'Invalid admin access token' })
            return
        }
        //attch access token to request object
        

        (req as AuthenticatedRequest).user = decoded;
        next();
    } catch (error) {
        console.log('isAuthMiddleware error',error)
        if (error instanceof TokenExpiredError) {
            res.status(401).json({ message: 'Admin access token expired' })
        } else if (error instanceof JsonWebTokenError) {
            res.status(401).json({ message: 'Invalid admin access token' })
        } else {
            res.status(401).json({ message: 'Invalid admin access token' })
        }
    }
}

//role based authorization

export const authorizeRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authReq = req as AuthenticatedRequest
        console.log('from authorize role')
        console.log(authReq.user)
        if (!authReq.user) {
            res.status(401).json({ message: 'Unauthorized' })
            return;
        }

        if (!roles.includes(authReq.user.role)) {
            res.status(403).json({ message: 'Forbidden' })
            return;
        }
        next();
    }
}
