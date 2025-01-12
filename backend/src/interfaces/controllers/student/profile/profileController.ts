import { Request, Response, NextFunction } from "express";
import { UserRepositoryImpl } from "../../../../infrastructure/repositories/userRepositoryImpl";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { ChangePasswordProfileUseCase } from "../../../../application/use-cases/student/changePassword";
import { EditProfileUseCase } from "../../../../application/use-cases/student/editProfile";
import { EditProfileEmailUseCase } from "../../../../application/use-cases/student/editEmail";
import { UpdateProfileImageUseCase } from "../../../../application/use-cases/student/updateProfileImage";


const userRepository = new UserRepositoryImpl()

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
        const useCase = new ChangePasswordProfileUseCase(userRepository)
        await useCase.execute({userId:user.id,oldPassword, newPassword})
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
        const useCase = new EditProfileUseCase(userRepository)
        const response = await useCase.execute({userId:user.id,firstName,lastName, email, phone})
        console.log('edit profile handler' ,response)
        res.status(200).json({success: true, message: 'Profile edited successfully',user:response})
    } catch (error) {
        next(error)
    }
}

export const editProfileEmailController = async(req: Request, res: Response, next : NextFunction) => {
    const { email, otp} = req.body
    const user:any = req.user
    try {
        if(!user){
            throw new CustomError('User not found, Unauthorized', 400)
        }
        const useCase = new EditProfileEmailUseCase(userRepository)
        const response = await useCase.execute({userId:user.id,email, otp})
        res.status(200).json({success: true, message: 'Email updated successfully',user:response})
    } catch (error) {
        next(error)
    }
}


export const updateProfileImageController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.params.id;
        const file = req.file?.buffer;

        if(!file){
            throw new CustomError('File is required', 400)
        }
        const useCase = new UpdateProfileImageUseCase(userRepository)
        const profileImageUrl = await useCase.execute({userId, fileBuffer: file})

        res.status(200).json({message: 'Profile image updated successfully', profileImageUrl})
    } catch (error:any) {
        next(error)
    }
}
