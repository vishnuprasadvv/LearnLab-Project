import { IUserRepository } from "../../../repositories/IUserRepository";

export class GetBestInstructorUseCase{
    constructor (private userRepository: IUserRepository){}

    async execute(limit: number = 10): Promise<any[]> {
        return this.userRepository.getTopInstructors(limit)
    }
}