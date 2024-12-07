import { UserRepository } from "../../application/repositories/userRepository";
import User, {IUser} from "../../domain/models/User";

export class UserRepositoryImpl implements UserRepository {
    async findById(userId: string): Promise<IUser | null> {
        return User.findById(userId).select('-password')
    }

    async save(user: IUser): Promise<IUser> {
        return user.save();
    }
}