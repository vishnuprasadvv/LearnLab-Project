import { Request, Response, NextFunction } from "express";
import { changePassword } from "../../application/use-cases/student/changePassword";
import { CustomError } from "../middlewares/errorMiddleWare";
import { editProfile } from "../../application/use-cases/student/editProfile";

export const studentHome = (req: Request, res: Response) => {
    res.json({'message' : 'welcome user'})
}


export const changePasswordHandler = async(req: Request, res: Response, next : NextFunction) => {
    const { oldPassword, newPassword} = req.body
    const user:any = req.user
    try {
        if(!user){
            throw new CustomError('User not found, Unauthorized', 400)
        }
        const response = await changePassword({userId:user.id,oldPassword, newPassword})
        console.log('change password handler' ,response)
        res.status(200).json({success: true, message: 'Password changed successfully'})
    } catch (error) {
        next(error)
    }
}

export const editProfileHandler = async(req: Request, res: Response, next : NextFunction) => {
    const { firstName, lastName, email, phone} = req.body
    const user:any = req.user
    try {
        if(!user){
            throw new CustomError('User not found, Unauthorized', 400)
        }
        const response = await editProfile({userId:user.id,firstName,lastName, email, phone})
        console.log('edit profile handler' ,response)
        res.status(200).json({success: true, message: 'Profile edited successfully',user:response})
    } catch (error) {
        next(error)
    }
}