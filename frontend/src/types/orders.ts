export interface ICoursesInOrder {
    courseId: string ;
    courseTitle : string;
    coursePrice : Number;
    courseImage: string;
    courseInstructor : string;
    courseLevel : string;
    courseDescription :string;
    courseDuration : number
    courseLecturesCount : number
    courseInstructorImage: string;
    courseCategory : string;

}

export interface IOrder {
    _id?: string ;
    orderId : string;
    userId: string ;
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