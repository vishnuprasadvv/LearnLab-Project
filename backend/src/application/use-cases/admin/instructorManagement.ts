import Instructor from "../../../domain/models/InstructorDocument"
import User from "../../../domain/models/User";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";


export const getInstructors = async() => {
    const instructorsList = await Instructor.find().populate('instructorId').sort({createdAt: -1});
    console.log(instructorsList)
    if(!instructorsList){
        throw new CustomError('Failed to get instructors list', 400)
    }
    return instructorsList
}

export const getInstructorApplication = async(id: string) => {
    const instructor= await Instructor.findById(id).populate('instructorId');
    console.log(instructor)
    if(!instructor){
        throw new CustomError('Failed to get instructors list', 400)
    }
    return instructor
}
export const actionInstructorApplication = async(id: string, status: string) => {
    const instructor= await Instructor.findById(id).populate('instructorId');
    if(!instructor){
        throw new CustomError('Instructor data not found , cannot update data', 400)
    }
    if(!status){
        throw new CustomError('Status not provided', 400)
    }
    if(status === 'approved'){
        const updateRole = await User.findByIdAndUpdate(instructor.instructorId, {role: 'instructor'})
        console.log('user role updated')
    }
    instructor.status = status;
    instructor.save()
    console.log(instructor)
    return instructor
}
