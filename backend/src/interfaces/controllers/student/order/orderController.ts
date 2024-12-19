import { NextFunction, Request, Response } from "express";
import { CreateOrderUseCase } from "../../../../application/use-cases/student/createOrder";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { IOrder, OrderModel } from "../../../../domain/models/Orders";
import { StripeService } from "../../../../infrastructure/stripe/StripeService";
import { CustomError } from "../../../middlewares/errorMiddleWare";

const orderRepository = new OrderRepository();
const stripeService = new StripeService()
const createOrderUseCase = new CreateOrderUseCase(orderRepository, stripeService)

interface CourseFromFrontEndProps {
    courseId: string ;
      courseTitle : string;
      coursePrice : Number;
      courseImage: string;
      courseInstructor ?: string;
      courseLevel ?: string;
      courseDescription ?:string ;
      courseDuration ?: number
      courseLecturesCount ?: number
      courseInstructorImage ?: string;
      courseCategory?: string;
  }
export const createOrderController = async(req:Request, res: Response, next:NextFunction) => {
    try {
        const user = req.user
        console.log(user)
        if(!user){
            throw new CustomError('User not logged in', 401)
        }
        const { courses } = req.body;
        const totalAmount = courses.reduce((total:any, course:CourseFromFrontEndProps) => total + course.coursePrice, 0)
        const stripeCheckoutSessionId  = await createOrderUseCase.execute({
            orderId: `OD_${Date.now()}`,
            userId:user?.id,
            courses,
            totalAmount,
            paymentType: 'stripe',
            paymentStatus: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            
        });
        res.status(200).json({sessionId: stripeCheckoutSessionId })
        
    } catch (error) {
        next(error)
    }
}
