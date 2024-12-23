import { IOrderRepository } from "../../../repositories/IOrderRepository";

export class GetPurchasesUseCase {
    constructor(private orderRepository: IOrderRepository){}

    async execute() {
        return await this.orderRepository.getAllOrders()
    }
}