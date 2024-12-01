import Instructor, { InstructorDocument } from "../../../domain/models/InstructorDocument";
import User from "../../../domain/models/User";
import { comparePassword } from "../../../infrastructure/services/hashService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

interface formDataInterface extends InstructorDocument{
    password: string
}

export const instructorRegister = async(userId : string, formData: formDataInterface) => {
        const {qualifications, experience, expertise, comment, password} = formData;
        const user:any = await User.findById(userId)
        //console.log(user)
        if(!user){
            throw new CustomError('User not found', 400)
        }
        const isPasswordValid = await comparePassword(password, user.password)

        if(!isPasswordValid) {
            throw new CustomError('Invalid credentials', 400)
        }
        if(user.role === 'instructor'){
            throw new CustomError('You are already an instructor', 400)
        }
        //check user already applied for instructor
        const findExistInstructorRequest = await Instructor.findOne({instructorId: userId , status: 'pending'}).populate('instructorId')
        if(findExistInstructorRequest){
            throw new CustomError('You are already applied for instructor', 400)
        }
        const instructorDoc = new Instructor({qualifications, experience,expertise, instructorId: userId, comment})
        return await instructorDoc.save()
    
}