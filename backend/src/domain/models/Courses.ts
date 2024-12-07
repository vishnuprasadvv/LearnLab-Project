import mongoose, { Document, Schema } from "mongoose";

export interface ICourses extends Document{
    userId:string,
    title:string,
    description?:string,
    imageUrl ?: string,
    price?: number,
    isPublished? : boolean,
    categoryId ?: string,
    level?: string,
    attachments : Attachment[],
    _id: string
}

export interface Attachment extends Document{
    title: string,
    type?: string,
    url : string,
}

const AttachmentSchema: Schema = new Schema({
    title: { type: String, required: true },
    type: { type: String, default: 'file' }, // Default type if not provided
    url: { type: String, required: true },
  });

const CourseSchema  : Schema = new Schema({
    userId:{ type: Schema.Types.ObjectId, ref: 'User', required: true},
    title :{type: String, required: true},
    description : {type: String},
    imageUrl: {type: String},
    price: {type: Number},
    isPublished: {type: Boolean, enum:['draft','published'], default:'draft'},
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category'},
    isDeleted: {type: Boolean, default: false},
    level: {type:String, enum: ['beginner','intermediate', 'advanced']},
    attachments: [AttachmentSchema]
    
},{timestamps: true});

CourseSchema.index({userId: 1})
CourseSchema.index({categoryId: 1})

const Courses = mongoose.model<ICourses>("Courses", CourseSchema);
export default Courses;