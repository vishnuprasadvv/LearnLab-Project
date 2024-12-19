export interface IPaymentService {
    createCheckOutSession(orderId:string,courses: any[], userId: string, uniqueOrderId:string): Promise<string>;
}