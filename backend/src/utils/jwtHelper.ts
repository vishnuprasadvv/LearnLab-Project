import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'

// export const generateToken = (id:string) : string => {
//     return jwt.sign({id}, SECRET_KEY, {expiresIn : '1h'})
// }

interface DecodedToken {
    id: string;
    role: string;
}


export const generateAccessToken = (payload : {id:string, role:string}) : string => {
    // return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
    const access = jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
   const verify =  jwt.verify(access, ACCESS_TOKEN_SECRET)
   console.log(verify)
   return access
}

export const generateRefreshToken = (payload : {id:string}) : string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn : '1d'})
}


export const verifyAccessToken = (token : string) : {id:string, role: string} | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as {id: string, role: string}
         
    } catch (error: any) {
        console.log('verifyAccessToken error:', error)
        throw error
    }
}

export const verifyRefreshToken = (token : string) : {id: string} | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as {id:string}
    } catch (error) {
        console.log('verifyRefreshToken error:', error)
        if(error instanceof TokenExpiredError){
            throw new Error('Refresh token expired')
        }else if(error instanceof JsonWebTokenError){
            throw new Error('Invalid refresh token')
        }
        throw new Error('Unexpected error during token verification')
    }
}
