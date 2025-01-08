import { InstructorDocument } from "../../domain/models/InstructorDocument"

export interface IInstructorRegisterRepository{
    create(data:Partial<InstructorDocument>):Promise<InstructorDocument> 
    findPendingRequest(instructorId: string):Promise<InstructorDocument | null>
    
    //admin
    getInstructorRequests():Promise<InstructorDocument[] | []>
    getInstructorRequest(id: string):Promise<InstructorDocument | null>
    findById(id: string) : Promise<InstructorDocument | null>
    update(data:Partial<InstructorDocument>):Promise<InstructorDocument | null>
}