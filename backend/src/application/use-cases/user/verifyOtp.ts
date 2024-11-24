import { verifyOtp } from "../../../infrastructure/services/otpService";
import User from "../../../domain/models/User";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

export const verifyOtpCode = async (email : string, otp : string) => {
    const isValid = await verifyOtp(email, otp);
    if(!isValid) throw new CustomError("Invalid or expired OTP" , 400)
        
        //update user verification status
        const user = await User.updateOne({email: email},{isVerified : true})
        
    return {message : 'OTP verified successfully'}
}