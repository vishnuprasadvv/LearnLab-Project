import { InstructorDocument } from "../../domain/models/InstructorDocument"

export interface IInstructorRegisterRepository{
    create(data:Partial<InstructorDocument>):Promise<InstructorDocument> 
    findPendingRequest(instructorId: string):Promise<InstructorDocument | null>
}