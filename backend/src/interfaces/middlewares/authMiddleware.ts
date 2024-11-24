import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwtHelper";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
      };
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) : void => {
    const token = req.cookies?.accessToken;
    if(!token){
        res.status(401).json({message : 'Unauthorized'})
        return;
    }

        try {
            const decoded = verifyAccessToken(token)
            if(!decoded){
                res.status(401).json({message:  'Invalid token'})
                return
            }
            (req as AuthenticatedRequest).user = decoded;
            next();
        } catch (error) {
            res.status(401).json({message : 'Invalid token'})
            return;
        }
}

//role based authorization

export const authorizeRole = (roles : string[]) =>{
    return (req: Request, res: Response, next : NextFunction) :void => {
        const authReq = req as AuthenticatedRequest
        if(!authReq.user){
            console.log('from authorize role')
           res.status(401).json({message : 'Unauthorized'})
           return;
        }
        
        if(!roles.includes(authReq.user.role)){
            res.status(403).json({message : 'Forbidden'})
            return;
        }
        next();
    }
}
