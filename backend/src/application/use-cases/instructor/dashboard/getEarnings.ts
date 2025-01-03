import { IOrderRepository } from "../../../repositories/IOrderRepository";

export class GetInstructorEarningsUseCase {
    constructor(private orderRepo: IOrderRepository){}

    async execute(instructorId : string) {
        return await this.orderRepo.getEarningsByInstructor(instructorId)
    }
}