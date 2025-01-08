import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare"
import { IUserRepository } from "../../repositories/IUserRepository"


export class GetUserDataUseCase {
    constructor(private userRepo : IUserRepository) {}

    async execute(userId : string) {
        const userdata = await this.userRepo.findById(userId)
    if(!userdata) {
        throw new CustomError('user not found', 400)
    }

    return userdata
    }
}