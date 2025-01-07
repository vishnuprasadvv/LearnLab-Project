import { IUser } from "../../../domain/models/User";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl";

export class GetAllChatUsersUseCase {
    constructor(private userRepository : UserRepositoryImpl){

    }
    async execute(userId:string, role: string):Promise<IUser[] | null>{
        let users = null;
        if(role === 'instructor'){
            users = this.userRepository.getAllUsersExcluded(userId);
        }else if(role === 'student'){
            users = this.userRepository.getAllInstructorsListForUser(userId)
        }
        if(!users) return null;
        return users;
    }
}