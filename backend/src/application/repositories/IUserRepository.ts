import { IUser } from "../../domain/models/User";

export interface IUserRepository{
    findById(userId: string) : Promise<IUser | null>;
    save(user:IUser) : Promise<IUser>
    getAllUsersExcluded(userId:string): Promise<IUser[]>
    getAllUsers():Promise<IUser[]>
    countAll() :Promise<number>;
    countByStatus(status:string):Promise<number>
    countByRole():Promise<{student: number, instructor:number, admin: number}>
    getRegistrationsOverTime():Promise<{date: string, count: number}[]>
    getTopInstructors(limit:number):Promise<IUser[]>
}