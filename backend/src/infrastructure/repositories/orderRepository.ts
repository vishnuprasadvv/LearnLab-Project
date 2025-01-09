import mongoose from "mongoose";
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
        return await OrderModel.countDocuments();
    }

    async calculateTotalRevenue(): Promise<number> {
        const result = await OrderModel.aggregate([
            { $group: { _id: null , total: { $sum : '$totalAmount'}}}
        ])

        return result.length > 0 ? result[0].total : 0;
    }

    async calculateAdminRevenue() : Promise<number> {
        const result = await OrderModel.aggregate([
            {$group: {_id: null, total: { $sum: { $multiply: ['$totalAmount', 0.1]}}}} //  10 % of total amount
        ])
        return result.length > 0 ? result[0].total : 0;
    }

    async calculateInstructorRevenue() : Promise<number> {
        const result = await OrderModel.aggregate([
            {$group: {_id: null, total: { $sum: { $multiply: ['$totalAmount', 0.9]}}}} //  90 % of total amount
        ])
         return result.length > 0 ? result[0].total : 0;
    }

    async getTotalRevenueByDay(): Promise<{ date: string, revenue: number, orderCount : number}[]> {
        const result =  await OrderModel.aggregate([
            {
                $addFields: {
                    createdAtDate: { $toDate: "$createdAt" }, // Convert createdAt to Date
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: "$createdAtDate" } },
                    orderCount: { $sum: 1 }, // Count the orders
                    revenue: { $sum: "$totalAmount" }, // Sum the revenue
                }
            },
            {
                $sort: { _id: 1 } 
            },
        ]);

        return result.map(item => ({
            date: item._id, // Rename _id to month
            revenue: item.revenue, // Total revenue for the month
            orderCount: item.orderCount, // Order count for the month
        }));
    }

    async getAdminTotalRevenueByDay(timeFrame: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<{ date: string, revenue: number, orderCount : number}[]> {
        const groupStage = {
            daily: {
                $dateToString: { format : "%Y-%m-%d", date: "$createdAt"},
            },
            weekly: {
                $dateToString: { format : "%Y-%U", date: "$createdAt"},
            },
            monthly: {
                $dateToString: { format : "%Y-%m", date: "$createdAt"},
            },
            yearly: {
                $dateToString: { format : "%Y", date: "$createdAt"},
            },
        }
       
        const result =  await OrderModel.aggregate([
            {
                $addFields: {
                    createdAtDate: { $toDate: "$createdAt" }, // Convert createdAt to Date
                }
            },
            {
                $group: {
                    _id: groupStage[timeFrame],
                    orderCount: { $sum: 1 }, // Count the orders
                    revenue: { $sum:  { $multiply: ['$totalAmount', 0.1]} }, // Sum the revenue
                }
            },
            {
                $sort: { _id: 1 } 
            },
        ]);

        return result.map(item => ({
            date: item._id, // Rename _id to month
            revenue: item.revenue, // Total revenue for the month
            orderCount: item.orderCount, // Order count for the month
        }));
    }
    
    async getEarningsByInstructor(instructorId: string) : Promise<any[]> {
        const earnings = await OrderModel.aggregate([
            {
                $lookup : {
                    from: 'courses',
                    localField: 'courses.courseId',
                    foreignField: '_id',
                    as: 'courseDetails',
                }
            },
            {
                $unwind: '$courseDetails',
            },
            {
                $match: {
                    'courseDetails.instructor' : new mongoose.Types.ObjectId(instructorId),
                    paymentStatus: 'completed'
                }
            },
            {
                $project:{
                    totalAmount :{ $multiply: ['$totalAmount', 0.9] },
                    paymentDate : 1,
                    _id: 0
                }
            },
        ])

        return earnings;
    }
}