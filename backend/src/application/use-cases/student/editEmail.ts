import User from "../../../domain/models/User"
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare"
import { verifyOtpCode } from "../user/verifyOtp"
  

export const editProfileEmail = async({userId,email,otp}:{userId:string, email: string, otp: string}) =>{
    try {
        const userExist:any = await User.findById(userId).select('-password')
        if(!userExist){
            throw new CustomError('User not found, Unauthorized',400)
        }

        const findEmailAlreadyExistsOrNot = await User.findOne({email: email , _id:{$ne:userId} })

        if(findEmailAlreadyExistsOrNot){
            throw new CustomError('Given email already exists.',400)
        }

        const verifyOtp = await verifyOtpCode(email, otp)

        if(!verifyOtp){
            throw new CustomError('Email OTP verification failed', 400)
        }

        userExist.email= email;
        userExist.save();

        return userExist;
           
    } catch (error) {
        throw error
    }
}