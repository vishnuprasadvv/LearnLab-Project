import { generateOtp, verifyOtp } from "../../../infrastructure/services/otpService";
import { sendEmail } from "../../../infrastructure/services/emailService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import User from "../../../domain/models/User";
import bcrypt from 'bcryptjs'
import { hashPassword } from "../../../infrastructure/services/hashService";

export const sendResetOtp = async(email: string) => {

    const userExist = await User.findOne({email})
    if(!userExist) throw new CustomError('User not found, create account', 400)

   const otp = await generateOtp(email)

   const sendOtp = await sendEmail(email , 'Your OTP for resetting password', 
    `Subject: Password reset

Hi,

We've received a request to reset your password.

If you didn't make the request, just ignore this message. Otherwise, you can reset your password by using the following OTP.

One Time Password (OTP): ${otp}

This OTP is valid for 10 minutes from the receipt of this email.

Best regards,
LearnLab.`
   );

   return {message : 'password reset OTP sent successfully.', otp}
}

export const verifyResendOtp = async (email: string, otp : string) => {
    const isValid = await verifyOtp(email, otp);
    if(!isValid) throw new CustomError('Invalid or expired OTP', 400)

    return {message : 'Otp verified successfully'}

}

export const resetPassword = async(email : string , password: string ) => {
    
    const user = await User.findOne({email})
    if(!user) {
        throw new CustomError('User not found', 400)
    }

    user.password = await hashPassword(password);
    await user.save();
    
    return user;
    
}