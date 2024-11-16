import { Request, Response } from "express";
import { registerUser } from "../../application/use-cases/user/registerUser";
import { generateOtp } from "../../infrastructure/services/otpService";
import { generateToken } from "../../utils/jwtHelper";
import { loginUser } from "../../application/use-cases/user/loginUser";
import { verifyOtpCode } from "../../application/use-cases/user/verifyOtp";
import { sendOtp } from "../../application/use-cases/user/sendOtp";
import { verifyTokenUseCase } from "../../application/use-cases/user/verifyToken";

export const signUp = async (req: Request, res: Response) => {
    try{
        
    const user:any = await registerUser(req.body);
        const {password, ...rest} = user._doc
       res.status(201).json(rest);

    }catch(error : any){
        res.status(500).json({error: error.message})
        //console.log(error)
    }
};   


export const sendOtpHandler = async (req: Request, res: Response) => {
    try{
        const {email} = req.body;
        
        //sent otp 
        const sentOTP = await sendOtp(email)
        res.status(200).json(sentOTP)
    }catch(error : any){
        res.status(400).json({error : error.message})
        console.log(error.message)
    }
}

export const verifyOtpHandler = async (req: Request, res: Response) => {
    try{
        const {email, code} = req.body;
        const response = await verifyOtpCode(email, code)
        res.status(200).json(response)
    }catch(error : any){
        res.status(400).json({error: error.message})
    }
}


export const loginHandler = async (req: Request, res : Response) => {
    try{
        const {email, password} = req.body;
        const response = await loginUser(email, password);
        res.status(200).json({response})
    }catch(error : any){
        res.status(400).json({error : error.message})
    }
}

export const verifyTokenHandler = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const userData = verifyTokenUseCase(token);
      res.status(200).json(userData);
    } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  };