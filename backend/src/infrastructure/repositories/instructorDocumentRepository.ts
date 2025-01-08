import mongoose from "mongoose";
import Instructor, { InstructorDocument } from "../../domain/models/InstructorDocument";
import { IInstructorRegisterRepository } from "../../application/repositories/IInstructorRegisterRepository";


export class InstructorDocumentRepository implements IInstructorRegisterRepository{
    async create(data:Partial<InstructorDocument>):Promise<InstructorDocument> {
        const newData = new Instructor(data)
        return await newData.save();
    }

    async findPendingRequest(instructorId: string):Promise<InstructorDocument | null>{
        const instructorIdObject = new mongoose.Types.ObjectId(instructorId)
        return await Instructor.findOne({instructorId: instructorIdObject, status: 'pending'})
    }

    //admin 
    async getInstructorRequests():Promise<InstructorDocument[] | []>{
        return await Instructor.find().populate('instructorId').sort({createdAt: -1})
    }

    async getInstructorRequest(id: string):Promise<InstructorDocument | null> {
        return await Instructor.findById(id).populate('instructorId') 
    }

    async findById(id: string) : Promise<InstructorDocument | null> {
        return await Instructor.findById(id);
    }

    async update(data:Partial<InstructorDocument>):Promise<InstructorDocument | null> {
        const {_id, ...rest} = data;
        const updated = await Instructor.findByIdAndUpdate(_id, {...rest}, {new: true, runValidators: true})
        return updated;
    }
}

