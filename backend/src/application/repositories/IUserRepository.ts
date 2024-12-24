import { IUser } from "../../domain/models/User";

export interface IUserRepository{
    findById(userId: string) : Promise<IUser | null>;
    save(user:IUser) : Promise<IUser>
    getAllUsersExcluded(userId:string): Promise<IUser[]>
}