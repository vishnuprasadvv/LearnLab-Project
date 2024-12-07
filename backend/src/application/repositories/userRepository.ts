import { IUser } from "../../domain/models/User";

export interface UserRepository{
    findById(userId: string) : Promise<IUser | null>;
    save(user:IUser) : Promise<IUser>
}