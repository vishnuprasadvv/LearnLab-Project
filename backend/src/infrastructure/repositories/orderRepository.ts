import { IOrderRepository } from "../../application/repositories/IOrderRepository";
import { IOrder, OrderModel } from "../../domain/models/Orders";

export class OrderRepository implements IOrderRepository{
  async  createOrder(order: IOrder): Promise<IOrder> {
        const createdOrder = await OrderModel.create(order);
        return {
            ...createdOrder.toObject(),
            _id: createdOrder._id.toString(),
            userId: createdOrder.userId.toString(),
            courses: createdOrder.courses.map((course: any) => ({
                ...course,
                courseId: course.courseId.toString(),
            })),
        };
    }
    async updateOrder(orderId: string, updates: Partial<IOrder>): Promise<IOrder | null> {
        const updatedOrder = await OrderModel.findOneAndUpdate({orderId: orderId}, updates, {new : true})
        return updatedOrder ? {...updatedOrder.toObject(),
            _id: updatedOrder._id.toString(),
            userId: updatedOrder.userId.toString(),
            courses: updatedOrder.courses.map((course:any) => ({
                ...course, 
                courseId: course.courseId.toString(),
            }))
        } : null;
    }

    async getOrderById(orderId: string): Promise<IOrder | null> {
        const order = await OrderModel.findOne({_id: orderId})
        return order ?   {
            ...order.toObject(),
            _id: order._id.toString(),
            userId: order.userId.toString(),
            courses: order.courses.map((course: any) => ({
                ...course,
                courseId: course.courseId.toString(),
            })),
        } : null;
    }

    async getOrdersByUserIdWithPaymentStatus(userId: string, paymentStatus:string):Promise<IOrder[]>{
        return await OrderModel.find({userId, paymentStatus})
    }
    async getOrdersByUserId(userId: string):Promise<IOrder[]>{
        return await OrderModel.find({userId})
    }
}