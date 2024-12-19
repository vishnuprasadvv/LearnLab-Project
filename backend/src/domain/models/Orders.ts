import mongoose, { Schema, ObjectId } from "mongoose";


interface ICoursesInOrder {
    courseId: string ;
      courseTitle : string;
      coursePrice : number;
      courseImage: string;
      courseInstructor ?: string;
      courseLevel ?: string;
      courseDescription ?:string ;
      courseDuration ?: number
      courseLecturesCount ?: number
      courseInstructorImage ?: string;
      courseCategory : string
}

export interface IOrder {
    _id?: string | ObjectId;
    orderId : string;
    userId: string | ObjectId;
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
    courseImage : {type: String},
    courseInstructor: {type: String},
    courseLevel: {type: String},
    courseDescription: {type: String},
    courseDuration: {type:Number},
    courseLecturesCount: {type:Number},
    courseInstructorImage:{type: String},
    courseCategory: {type: String},
})

const OrderSchema = new Schema({
    orderId: {type: String, required: true, unique: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true},
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