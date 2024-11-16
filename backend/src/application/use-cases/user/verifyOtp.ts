import { verifyOtp } from "../../../infrastructure/services/otpService";

export const verifyOtpCode = async (email : string, code : string) => {
    const isValid = await verifyOtp(email, code);
    if(!isValid) throw new Error("Invalid or expired OTP")
        
    return {message : 'OTP verified successfully'}
}