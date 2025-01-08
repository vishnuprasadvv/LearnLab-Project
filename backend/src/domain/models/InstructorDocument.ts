import mongoose, {Schema, Document, mongo} from "mongoose";

export interface InstructorDocument extends Document{
    instructorId: mongoose.Types.ObjectId | string;
    qualifications : string[];
    experience: number;
    expertise: string[];
    comment: string;
    status: string
    //resumeUrl : string
}

export const InstructorSchema = new Schema<InstructorDocument> ({
    qualifications: {type: [String], required: true},
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    experience: {type: Number, required: true},
    expertise: {type: [String], required: true},
    comment: {type: String, required: true},
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
   // resumeUrl: {type: String, required: true},
},{timestamps: true})

const Instructor = mongoose.model<InstructorDocument>("Instructor", InstructorSchema);
export default Instructor;