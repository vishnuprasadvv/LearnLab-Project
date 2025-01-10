import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwtHelper";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import User from "../../domain/models/User";

export const isAuthenticated = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if(!accessToken && !refreshToken){
        res.status(401).json({message: 'AccessToken and refreshToken not found'})
        console.log('accessToken and refreshToken not found')
        return;
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
        const user = await User.findById(decoded.id)
        // req.user = decoded;
        if(!user){
            res.status(404).json({message: 'User not authorized'})
            return
        }

        req.user = {
            id: user._id.toString(),
            role: user.role
        }
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
    if(!accessToken && !refreshToken){
        res.status(401).json({message: 'Admin accessToken and refreshToken not found'})
        console.log('admin accesstoken and refresh token not found')
        return;
    }
    if (!accessToken) {
        res.status(401).json({ message: 'Admin access token expired' })
        console.log('admin access token expired')
        return;
    }
    try {
        const decoded = verifyAccessToken(accessToken)
        if (!decoded) {
            res.status(401).json({ message: 'Invalid admin access token' })
            return
        }
        //attch access token to request object
        

        req.user = decoded;
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
        const authReq = req
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
