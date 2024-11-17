import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwtHelper";

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: string;
      };
}

export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) : void => {
    const token = req.cookies?.accessToken;
    if(!token){
        res.status(401).json({message : 'Unauthorized'})
        return;
    }

        try {
            const decoded = verifyAccessToken(token)
            req.user = decoded;
            console.log(req.user)
            next();
        } catch (error) {
            res.status(401).json({message : 'Invalid token'})
            return;
        }
}

//role based authorization

export const authorizeRole = (roles : string[]) =>{
    return (req: AuthenticatedRequest, res: Response, next : NextFunction) :void => {
        if(!req.user){
           res.status(401).json({message : 'Unauthorized'})
           return;
        }
        
        if(!roles.includes(req.user.role)){
            res.status(403).json({message : 'Forbidden'})
            return;
        }
        next();
    }
}
