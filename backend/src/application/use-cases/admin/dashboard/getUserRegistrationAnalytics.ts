import { IUserRepository } from "../../../repositories/IUserRepository";

export class GetUserRegistrationAnalyticsUseCase{
    constructor(private userRepository: IUserRepository) {}

    async execute(timeFrame: string){
        return await this.userRepository.getRegistrationsOverTime(timeFrame)
    }
}