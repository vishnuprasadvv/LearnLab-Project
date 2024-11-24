import { randomInt } from "crypto";
import Otp , {IOtp} from "../../domain/models/Otp"; 

export const generateOtp = async (email: string): Promise<string> => {
    const otp = randomInt(1000, 9999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); //expires in 10 minutes
    //const alreadyExist = await Otp.deleteMany({email: email})
    await Otp.create({email, otp, expiresAt})
    return otp;
}

export const verifyOtp = async (email : string, otp: string): Promise <boolean> => {
    const otpRecord = await Otp.findOne({email, otp , expiresAt :{$gte: new Date()}})
    return !!otpRecord;
}