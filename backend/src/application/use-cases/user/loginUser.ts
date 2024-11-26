import User from "../../../domain/models/User";
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwtHelper";
import { comparePassword } from "../../../infrastructure/services/hashService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

export const loginUser = async (email : string, password: string) => {
    const user:any = await User.findOne({email});
    if(!user){
        throw new Error('User not found')
    }
    if(user.googleId){
        throw new CustomError('User registered with social login', 400)
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if(!isPasswordValid) throw new Error('Invalid credentials');

    const accessToken = generateAccessToken({id:user._id, role:user.role})
    const refreshToken = generateRefreshToken({id : user._id})
    
    return {accessToken, refreshToken, user:{ id: user._id, firstName : user.firstName, lastName: user.lastName, email: user.email, role: user.role}}
}