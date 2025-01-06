import { IOrderRepository } from "../../../repositories/IOrderRepository";

export class GetCompanyProfitDataUseCase{
    constructor(private orderRepository: IOrderRepository){}

    async execute(timeFrame: string) {
        return await this.orderRepository.getAdminTotalRevenueByDay(timeFrame)
    }
}