import User from "../../../domain/models/User"
import { comparePassword, hashPassword } from "../../../infrastructure/services/hashService"
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare"

export const changePassword = async({userId, oldPassword, newPassword}:{userId:string, oldPassword:string, newPassword:string}) => {
    try {
        const userExist = await User.findById(userId)
    console.log('changepassworddomain', userExist)

    if(oldPassword === newPassword){
        throw new CustomError('Cannot use previous password', 400)
    }

    if(!userExist){
        throw new CustomError('User not found', 400)
    }

    const compareUserPassword = await comparePassword(oldPassword, userExist.password!)
    if(!compareUserPassword){
        throw new CustomError('Wrong password', 400)
    }

    const hashNewPassword = await hashPassword(newPassword)

    if(!hashNewPassword){
        throw new CustomError('password hashing error', 400)
    }

    userExist.password = hashNewPassword;
    userExist.save()
    return userExist;
    } catch (error) {
        throw error
    }
    

}