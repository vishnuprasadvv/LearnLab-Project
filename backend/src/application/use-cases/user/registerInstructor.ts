import Instructor, { InstructorDocument } from "../../../domain/models/InstructorDocument";
import User from "../../../domain/models/User";
import { comparePassword } from "../../../infrastructure/services/hashService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IInstructorRegisterRepository } from "../../repositories/IInstructorRegisterRepository";
import { IUserRepository } from "../../repositories/IUserRepository";

interface formDataInterface extends InstructorDocument{
    password: string
}

export class InstructorRegisterUseCase {
    constructor(private userRepository: IUserRepository,
        private instructorReqRepo : IInstructorRegisterRepository
    ){}

    async execute(userId : string, formData: formDataInterface){
        const {qualifications, experience, expertise, comment, password} = formData;
        const user:any = await this.userRepository.findByIdWithPassword(userId)
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
        const findExistInstructorRequest = await this.instructorReqRepo.findPendingRequest(userId)
        if(findExistInstructorRequest){
            throw new CustomError('You are already applied for instructor', 400)
        }
        const instructorDoc = await this.instructorReqRepo.create({qualifications, experience,expertise, instructorId: userId, comment})
        return instructorDoc;
    }
}

