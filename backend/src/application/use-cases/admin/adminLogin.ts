import User from "../../../domain/models/User";
import { comparePassword } from "../../../infrastructure/services/hashService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwtHelper";

export const loginAdmin = async (email : string, password: string ) => {
    const user:any = await User.findOne({email, isVerified : true});
    if(!user){
        const nonVerifiedUser = await User.findOne({email, isVerified: false})
        if(nonVerifiedUser){
            throw new CustomError('User not verified',400)
        }
        throw new Error('User not found')
    }
    if(user.googleId){
        throw new CustomError('User registered with social login', 400)
    }
    //check role of user for login page based
    if(user.role !== 'admin'){
        throw new CustomError('You are not authorized, only admin can login', 400)
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if(!isPasswordValid) throw new Error('Invalid credentials');

    const accessToken = generateAccessToken({id:user._id, role:user.role})
    const refreshToken = generateRefreshToken({id : user._id})
    
    return {accessToken, refreshToken, user:{ id: user._id, firstName : user.firstName, lastName: user.lastName, email: user.email, role: user.role, phone: user.phone , createdAt: user.createdAt}}
}