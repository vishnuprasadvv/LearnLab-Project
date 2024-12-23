import { IOrder } from "../../domain/models/Orders";

export interface IOrderRepository {
    createOrder (order: IOrder): Promise<IOrder>;
    updateOrder(orderId: string, updates : Partial<IOrder>) : Promise<IOrder | null> ;
    getOrderById (orderId: string): Promise<IOrder | null> ;
    getOrdersByUserIdWithPaymentStatus(userId: string, paymentStatus:string):Promise<IOrder[]>
    getOrdersByUserId(userId: string):Promise<IOrder[]>
    hasUserPurchasedCourse (userId: string, courseId: string) : Promise<boolean> 
    getAllOrders () : Promise<IOrder[] | null>
}
