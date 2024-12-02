import User from "../../../domain/models/User"
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare"


export const editProfile = async({userId,firstName,lastName, email, phone}:{userId:string, firstName: string, lastName: string, email: string, phone: string}) =>{
    try {
        const userExist:any = await User.findById(userId)
        console.log('editprofile use case', userExist)
        if(!userExist){
            throw new CustomError('User not found, Unauthorized',400)
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            throw new CustomError('Enter a valid email', 400)
        }

        userExist.firstName = firstName
        userExist.lastName = lastName
        userExist.email = email
        userExist.phone = phone
        
        //SAVE UPDATED USER DATA 
       await userExist.save()
        return {id:userExist._id, role: userExist.role, 
            firstName: userExist.firstName, lastName: userExist.lastName, email: userExist.email,
             phone: userExist.phone, createAt: userExist.createdAt}
    } catch (error) {
        throw error
    }
}