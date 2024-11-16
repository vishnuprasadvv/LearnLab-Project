import jwt from 'jsonwebtoken';

const SECRET_KEY =  process.env.JWT_SECRET || 'secret'

export const generateToken = (id:string) : string => {
    return jwt.sign({id}, SECRET_KEY, {expiresIn : '1h'})
}

export const verifyToken = (token : string) : {userId : string} =>{
    return jwt.verify(token, SECRET_KEY) as {userId : string}
}