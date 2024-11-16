import { randomInt } from "crypto";
import Otp , {IOtp} from "../../domain/models/Otp"; 

export const generateOtp = async (email: string): Promise<string> => {
    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.create({email, code, expiresAt})
    return code;
}

export const verifyOtp = async (email : string, code: string): Promise <boolean> => {
    const otpRecord = await Otp.findOne({email, code , expiresAt :{$gte: new Date()}})
    return !!otpRecord;
}