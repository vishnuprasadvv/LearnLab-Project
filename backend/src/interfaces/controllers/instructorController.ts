import { NextFunction, Request, Response } from "express";
import { instructorRegister } from "../../application/use-cases/user/registerInstructor";

export const registerInstuctorHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {userId,formData} = req.body
    console.log(userId, formData)
try {
    const result = await instructorRegister(userId, formData)
    console.log(result)
    res.status(200).json({success: true, message: 'Successfully applied for Instructor role'})
} catch (error) {
    console.error(error)
    next(error)

}
}