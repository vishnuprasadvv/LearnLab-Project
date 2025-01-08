import mongoose from "mongoose";
import Instructor, { InstructorDocument } from "../../domain/models/InstructorDocument";

export class InstructorDocumentRepository {
    async create(data:Partial<InstructorDocument>):Promise<InstructorDocument> {
        const newData = new Instructor(data)
        return await newData.save();
    }

    async findPendingRequest(instructorId: string):Promise<InstructorDocument | null>{
        const instructorIdObject = new mongoose.Types.ObjectId(instructorId)
        return await Instructor.findOne({instructorId: instructorIdObject, status: 'pending'})
    }
}

