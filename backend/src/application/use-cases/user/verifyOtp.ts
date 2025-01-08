import { verifyOtp } from "../../../infrastructure/services/otpService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl";

const userRepository = new UserRepositoryImpl()
export const verifyOtpCode = async (email : string, otp : string) => {
    const isValid = await verifyOtp(email, otp);
    if(!isValid) throw new CustomError("Invalid or expired OTP" , 400)
        
        //update user verification status
        const verificationStatus = await userRepository.approveUserSignupVerification(email);
        if(!verificationStatus){
            throw new CustomError('Verification failed', 400)
        }
        
    return {message : 'OTP verified successfully'}
}