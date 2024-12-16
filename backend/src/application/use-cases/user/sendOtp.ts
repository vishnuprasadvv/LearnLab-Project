import { generateOtp } from "../../../infrastructure/services/otpService";
import { sendEmail } from "../../../infrastructure/services/emailService";


export const sendOtp = async (email : string) => {
    const otpCode = await generateOtp(email);
    console.log('send otp to email')
    // await sendEmail(email, 'Your OTP code', `Your OTP code is : ${otpCode}`);
    await sendEmail(email, 'Your OTP code', 
        
`Subject: Your OTP Verification Code


Thank you for signing up with us. To verify your email, please enter the following

One Time Password (OTP): ${otpCode}

This OTP is valid for 10 minutes from the receipt of this email.

Best regards,
LearnLab.`
);
    console.log('otp sent successfully', otpCode)
    return {message : 'OTP sent successfully' , otpCode}
}

