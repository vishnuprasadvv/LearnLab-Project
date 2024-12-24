import { IUser } from "../../../domain/models/User";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl";

export class GetAllChatUsersUseCase {
    constructor(private userRepository : UserRepositoryImpl){

    }
    async execute(userId:string):Promise<IUser[] | null>{
        const users = this.userRepository.getAllUsersExcluded(userId);
        if(!users) return null;
        return users;
    }
}