import { generateOtp } from "../../../infrastructure/services/otpService";
import { sendEmail } from "../../../infrastructure/services/emailService";


export const sendOtp = async (email : string) => {
    const otpCode = await generateOtp(email);
    console.log('send otp to email')
    await sendEmail(email, 'Your OTP code', `Your OTP code is : ${otpCode}`);
    return {message : 'OTP sent successfully' , otpCode}
}