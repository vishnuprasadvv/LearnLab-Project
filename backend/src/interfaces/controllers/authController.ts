import { NextFunction, Request, Response } from "express";
import { registerUser } from "../../application/use-cases/user/registerUser";
import { generateOtp } from "../../infrastructure/services/otpService";
import { loginUser } from "../../application/use-cases/user/loginUser";
import { verifyOtpCode } from "../../application/use-cases/user/verifyOtp";
import { sendOtp } from "../../application/use-cases/user/sendOtp";
import { refreshAccessToken } from "../../application/use-cases/user/refreshAccessToken";
import { logout } from "../../application/use-cases/user/logout";
import dotenv from 'dotenv'
import { verifyAccessTokenUseCase } from "../../application/use-cases/user/verifyToken";
import { resetPassword, sendResetOtp, verifyResendOtp } from "../../application/use-cases/user/resetPassword";
import { CustomError } from "../middlewares/errorMiddleWare";

dotenv.config()

 //interface for token options
 interface ITokenOptions {
    expires : Date,
    maxAge : number;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none' | undefined;
    secure?: boolean
}

const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5')
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '1')
//optioins for cookies
export const accessTokenOptions : ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire  * 60* 60  * 1000),
    maxAge : accessTokenExpire * 60* 60 * 1000,
    httpOnly : true,
    sameSite: 'strict'
}


export const refreshTokenOptions : ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 *60* 60 * 1000),
    maxAge : refreshTokenExpire * 24 *60* 60* 1000,
    httpOnly : true,
    sameSite: 'strict'
}

export const signUp = async (req: Request, res: Response , next: NextFunction) => {
    try{
        
        console.log(req.body)   
        
    const user:any = await registerUser(req.body);
        const {password, ...rest} = user._doc
        
        //send otp 
        const sentOTP = await sendOtp(user.email)
        console.log(sentOTP)
       res.status(201).json(rest);

    }catch(error : any){
        // res.status(500).json({error: error.message})
        next(error)
        //console.log(error)
    }
};   
//only set secure for production
if(process.env.NODE_ENV === 'production'){
    accessTokenOptions.secure = true;
}



export const sendOtpHandler = async (req: Request, res: Response) => {
    try{
        const {email} = req.body;
        
        //sent otp 
        const sentOTP = await sendOtp(email)
        console.log('sentOtp controller', sentOTP)
        res.status(200).json(sentOTP)
    }catch(error : any){
        res.status(400).json({error : error.message})
        console.log(error.message)
    }
}

export const verifyOtpHandler = async (req: Request, res: Response) => {
    try{
        const {email, otp} = req.body;
        console.log(email,otp)
        const response = await verifyOtpCode(email, otp)
        res.status(200).json(response)
    }catch(error : any){
        res.status(400).json({success : false , message: error.message})
        console.log(error)
    }
}


export const loginHandler = async (req: Request, res : Response, next: NextFunction) => {
    try{
        const {email, password} = req.body;
        const response = await loginUser(email, password);
        console.log(response)

        
        res.cookie('refreshToken', response.refreshToken, refreshTokenOptions )
        res.cookie('accessToken', response.accessToken, accessTokenOptions)
        res.status(200).json({success: true, user : response.user})
    }catch(error : any){
        next(error)
    }
}

//refresh access token after expire
export const refreshTokenHandler = (req: Request, res: Response, next : NextFunction) => {
    try {

        const token = req.cookies.refreshToken;
        const accessToken = refreshAccessToken(token)

        res.cookie('accessToken', accessToken, accessTokenOptions)
        res.status(200).json({success: true})
        
    } catch (error) {
        next (error)
    }
}


//logout handler 

export const logoutHandler = async(req : Request, res: Response, next: NextFunction) => {
    try{
        //clear cookies for access and refreshtoken
        res.clearCookie('accessToken', { httpOnly: true,  sameSite: 'strict' })
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict' })

        const message = logout();

        res.status(200).json({success : true , message})
    }catch(error){
        next(error)
    }
}


export const validateUser = async(req: Request, res: Response):Promise<any> =>{
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message : 'Unauthorized'})
    }
    try{
        const verifyUser = await verifyAccessTokenUseCase(accessToken);
        console.log(verifyUser)
        return res.status(200).json({verifyUser})
    }catch(error){
        return res.status(401).json({message: "Unauthorized"})
    }
}

//reset password 

export const resetPasswordOtpSendHandler = async(req: Request, res: Response, next: NextFunction) => {
    try {
         const {email} = req.body;
         if(!email) throw new CustomError('Email required', 404 )

         const sendOtp = await sendResetOtp(email)
         console.log(sendOtp)

         res.status(200).json(sendOtp.message)
         
    } catch (error) {
        next(error)
    }
}

export const resetPasswordOtpVerifyHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const {email, otp } = req.body;
            if(!email && !otp ){
                throw new CustomError('email and otp required', 400)
            } else if(!email){
                throw new CustomError('email required', 400)
            }else if(!otp) {
                throw new CustomError('otp required', 400)
            }
            
        const verifyOtpResponse = await verifyResendOtp(email, otp)
        res.status(200).json(verifyOtpResponse)
        
    } catch (error) {
        next(error)
    }
}

export const resetPasswordHandler = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const {email,otp , password} = req.body;

        if(!email || !otp || !password ){
            let error:string[] = []
            if(!email) error.push('email')
            if(!otp) error.push('otp')
            if(!password) error.push('password')

                throw new CustomError(`${error.join(',')} required`, 400)
        }

        const verifyOtp = await verifyResendOtp(email, otp)
        //console.log(verifyOtp)

        const resettedUser = await resetPassword(email, password)
       // console.log(resettedUser)
        res.status(200).json({message: 'Password reset successful'})
    } catch (error) {
        next(error)
    }

}

