import mongoose, { Schema, ObjectId } from "mongoose";

interface ICoursesInOrder {
    courseId: string | ObjectId | mongoose.Types.ObjectId;
      courseTitle : string;
      coursePrice : number;
      courseImage?: string;
      courseInstructor ?: string ;
      courseLevel ?: string;
      courseDescription ?:string ;
      courseDuration ?: number
      courseLecturesCount ?: number
      courseInstructorImage ?: string | null;
      courseCategory : string 
}

export interface IOrder {
    _id?: string | ObjectId | mongoose.Types.ObjectId ;
    orderId : string;
    userId: string | ObjectId |  mongoose.Types.ObjectId;
    courses: ICoursesInOrder[];
    subTotal?: number | null;
    totalAmount: number;
    discountAmount? : number | null;
    couponApplied ?: string | null;
    paymentStatus : 'pending' | 'completed' | 'failed';
    paymentType: 'stripe' | 'rupay' | 'paypal';
    transactionId?: string | null;
    paymentDate?: Date | null;
    createdAt : Date;
    updatedAt: Date;
}

const CourseOrderSchema = new Schema ({
    courseId: {type: mongoose.Schema.Types.ObjectId, required: true},
    courseTitle:{type:String, required: true},
    coursePrice:{type: Number, required: true},
    courseImage : {type: String, required: true},
    courseInstructor: {type: String,  required: true},
    courseLevel: {type: String, required: true},
    courseDescription: {type: String , required: true, default: ''},
    courseDuration: {type:Number, required: true},
    courseLecturesCount: {type:Number, required: true},
    courseInstructorImage:{type: String},
    courseCategory: {type: String , required: true},
})

const OrderSchema = new Schema({
    orderId: {type: String, required: true, unique: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true , ref:'User'},
    courses: [CourseOrderSchema],
    subTotal :{type:Number},
    totalAmount : {type: Number, required: true},
    discountAmount :{type:Number},
    couponApplied : {type: String},
    paymentStatus: {type:String, enum:['pending', 'completed', 'failed'] , default: 'pending',},
    paymentType: {type: String, enum:['stripe','paypal','rupay'], required: true},
    transactionId: {type: String},
    paymentDate : {type:Date},
}, 
{timestamps: true})

export const OrderModel = mongoose.model('Order', OrderSchema)