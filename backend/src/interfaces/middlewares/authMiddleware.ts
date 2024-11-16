import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: {userId : string}
}

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

export const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response, 
    next : NextFunction
) => {
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: 'Authorization token missing or invalid'})
        }
        const token = authHeader.split(' ')[1];

        //verify token
        const decodedToken = jwt.verify(token, SECRET_KEY) as {userId : string};
        
        //attach the decoded user information to the request object
        req.user = {userId : decodedToken.userId}

        next();

    }catch(error){
        res.status(401).json({message : 'Invalid or expired token'})
    }
}


