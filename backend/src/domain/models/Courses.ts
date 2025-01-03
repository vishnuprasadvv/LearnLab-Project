import mongoose, { Document, Schema } from "mongoose";

export interface IVideo {
    title: string;
    url: string;
    publicId: string;
    duration: number;
    isFree: boolean;
    _id? : string | mongoose.Types.ObjectId;
}

export interface ILectureDocument extends Document{
    title: string,
    description: string,
    videos: IVideo[];
    order : number;
    createdAt: Date;
    updatedAt: Date;
    isFree: boolean;
}

export interface ICourses extends Document{
    instructor:string,
    title:string,
    description?:string,
    imageUrl ?: string,
    imagePublicId ?: string,
    price: number,
    isPublished? : boolean,
    category ?: string,
    level?: string,
    _id: string,
    duration? : number,
    isDeleted : boolean,
    lectures?: ILectureDocument[],
    enrolledCount?: number,
    averageRating?: number,
    ratingsCount?: number,
}

const VideoSchema : Schema = new Schema({
    title : {type: String, required: true, trim: true},
    url : {type: String, required :true},
    publicId : {type: String, required :true},
    duration: {type: Number, required: true, min: 0},
    isFree: {type: Boolean , default: false},
})

const LectureSchema : Schema = new Schema ( 
    {
        title: {type: String, required: true, trim: true},
        description: {type: String},
        videos: {type: [VideoSchema], default: []},
        order: {type: Number, required: true, min: 1},
        isFree: {type: Boolean , default: false},
    },
)

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
    lectures: {type: [LectureSchema], default: []},
    enrolledCount:{type:Number, default:0},
    averageRating:{type: Number, default: 0},
    ratingsCount: {type: Number, default: 0},
    
},{timestamps: true});

CourseSchema.index({userId: 1})
CourseSchema.index({categoryId: 1})

const Courses = mongoose.model<ICourses>("Courses", CourseSchema);
export default Courses;