import { IOtpRepository } from "../../application/repositories/IOtpRepository";
import Otp from "../../domain/models/Otp";

export class OtpRepository implements IOtpRepository{
    async generateOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
        await Otp.deleteMany({email}) //remove existing otp for the email
        await Otp.create({email, otp, expiresAt})
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const otpRecord = await Otp.findOne({email, otp, expiresAt: { $gte: new Date()}})
        return !! otpRecord;
    }
}