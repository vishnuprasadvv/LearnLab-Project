import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { config } from '../infrastructure/config/config';

const ACCESS_TOKEN_SECRET = config.jwt.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = config.jwt.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (payload : {id:string, role:string}) : string => {
   
    const access = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    jwt.verify(access, ACCESS_TOKEN_SECRET)
   return access
}

export const generateRefreshToken = (payload : {id:string}) : string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn : '1d'})
}

export const verifyAccessToken = (token : string) : {id:string, role: string} | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as {id: string, role: string}
         
    } catch (error: any) {
        console.error('verifyAccessToken error:', error)
        throw error
    }
}

export const verifyRefreshToken = (token : string) : {id: string} | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as {id:string}
    } catch (error) {
        if(error instanceof TokenExpiredError){
            throw new Error('Refresh token expired')
        }else if(error instanceof JsonWebTokenError){
            throw new Error('Invalid refresh token')
        }
        throw new Error('Unexpected error during token verification')
    }
}
