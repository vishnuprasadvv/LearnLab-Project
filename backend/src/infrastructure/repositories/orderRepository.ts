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
    async hasUserPurchasedCourse (userId: string, courseId: string) : Promise<boolean> {
        const order = await OrderModel.findOne({
            userId,
            'courses.courseId': courseId,
            paymentStatus:'completed'
        })
        return !!order
    }
    async getAllOrders():Promise<IOrder[] | null> {
        const orders = await OrderModel.find().populate({path: 'userId', select: '-password -profileImagePublicId'}).sort({createdAt: -1}).lean()
        if (!orders) {
            return null;
          }
        return orders;
    }

    //admin dashboard
    async countAll(): Promise<number> {
        return OrderModel.countDocuments();
    }

    async calculateTotalRevenue(): Promise<number> {
        const result = await OrderModel.aggregate([
            { $group: { _id: null , total: { $sum : '$totalAmount'}}}
        ])

        return result[0].total || 0;
    }

    async getRevenueByMonth(): Promise<{ date: string, revenue: number, orderCount : number}[]> {
        const result =  await OrderModel.aggregate([
            {
                $addFields: {
                    createdAtDate: { $toDate: "$createdAt" }, // Convert createdAt to Date
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: "$createdAtDate" } }, // Group by year and month
                    orderCount: { $sum: 1 }, // Count the orders
                    revenue: { $sum: "$totalAmount" }, // Sum the revenue
                }
            },
            {
                $sort: { _id: 1 } // Sort by month in ascending order
            },
        ]);

        return result.map(item => ({
            date: item._id, // Rename _id to month
            revenue: item.revenue, // Total revenue for the month
            orderCount: item.orderCount, // Order count for the month
        }));
    }
    

}