import { randomInt } from "crypto";
import { OtpRepository } from "../repositories/OtpRepository";

const otpRepository = new OtpRepository()
export const generateOtp = async (email: string): Promise<string> => {
    try {
        const otp = randomInt(1000, 9999).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await otpRepository.generateOtp(email, otp, expiresAt);
        return otp;
      } catch (error) {
        console.error("Error generating OTP:", error);
        throw new Error("Failed to generate OTP");
      }
}

export const verifyOtp = async (email : string, otp: string): Promise <boolean> => {
   return await otpRepository.verifyOtp(email, otp)
}