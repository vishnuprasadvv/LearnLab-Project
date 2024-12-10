import mongoose, { Document, Schema } from "mongoose";

export interface ICourses extends Document{
    instructor:string,
    title:string,
    description?:string,
    imageUrl ?: string,
    imagePublicId ?: string,
    price?: number,
    isPublished? : boolean,
    category ?: string,
    level?: string,
    _id: string,
    duration? : number,
    isDeleted : boolean,
    lectures?: string[]
}


const CourseSchema  : Schema = new Schema({
    instructor:{ type: Schema.Types.ObjectId, ref: 'User', required: true},
    title :{type: String, required: true},
    description : {type: String , required: true},
    duration : {type: Number , required: true},
    imageUrl: {type: String, required: true},
    imagePublicId:{type: String, required: true},
    price: {type: Number, required: true},
    isPublished: {type: Boolean, default : false},
    category: { type: Schema.Types.ObjectId, ref: 'CourseCategory', required: true},
    isDeleted: {type: Boolean, default: false},
    level: {type:String, enum: ['beginner','intermediate', 'advanced'], required: true},
    lectures: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture' }],
    
},{timestamps: true});

CourseSchema.index({userId: 1})
CourseSchema.index({categoryId: 1})

const Courses = mongoose.model<ICourses>("Courses", CourseSchema);
export default Courses;