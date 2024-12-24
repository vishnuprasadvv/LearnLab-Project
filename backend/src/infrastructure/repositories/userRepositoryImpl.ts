import { IUserRepository } from "../../application/repositories/IUserRepository";
import User, {IUser} from "../../domain/models/User";

export class UserRepositoryImpl implements IUserRepository {
    async findById(userId: string): Promise<IUser | null> {
        return User.findById(userId).select('-password')
    }

    async save(user: IUser): Promise<IUser> {
        return user.save();
    }

    async getAllUsersExcluded(userId:string): Promise<IUser[]> {
        return User.find({_id:{$ne: userId}  ,isVerified: true, status : 'active', role:{$ne:'admin'}}).select('-password -googleId -profileImagePublicId')
    }
}