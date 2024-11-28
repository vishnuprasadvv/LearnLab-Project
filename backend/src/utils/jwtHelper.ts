import jwt from 'jsonwebtoken';

const SECRET_KEY =  process.env.JWT_SECRET || 'secret'
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret'
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret'

// export const generateToken = (id:string) : string => {
//     return jwt.sign({id}, SECRET_KEY, {expiresIn : '1h'})
// }

interface DecodedToken {
    id: string;
    role: string;
}


export const generateAccessToken = (payload : object) : string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

export const generateRefreshToken = (payload : object) : string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn : '1d'})
}


export const verifyAccessToken = (token : string) :DecodedToken | null => {
    try {
        return jwt.verify(token, ACCESS_TOKEN_SECRET) as DecodedToken  
    } catch (error) {
        console.log('verifytoken error')
        return null;
    }
}

export const verifyRefreshToken = (token : string) : {id: string} | null => {
    try {
        return jwt.verify(token, REFRESH_TOKEN_SECRET) as {id:string}
    } catch (error) {
        return null;
    }
}
