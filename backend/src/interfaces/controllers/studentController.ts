import { Request, Response, NextFunction } from "express";
import { changePassword } from "../../application/use-cases/student/changePassword";

export const studentHome = (req: Request, res: Response) => {
    res.json({'message' : 'welcome user'})
}


export const changePasswordHandler = async(req: Request, res: Response, next : NextFunction) => {
    const { oldPassword, newPassword} = req.body
    try {
        const response = await changePassword(oldPassword, newPassword)
    } catch (error) {
        next(error)
    }
}