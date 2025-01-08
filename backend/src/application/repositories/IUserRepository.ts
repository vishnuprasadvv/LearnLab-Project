import { IUser } from "../../domain/models/User";

export interface IUserRepository{
    findById(userId: string) : Promise<IUser | null>;
    findByIdWithPassword(userId: string): Promise<IUser | null>
    //login
    getUserByEmail(email: string): Promise<IUser | null>

    //signup 
    createUser(user:Partial<IUser>) : Promise<IUser>
    
    save(user:IUser) : Promise<IUser>
    getAllUsersExcluded(userId:string): Promise<IUser[]>
    getAllUsers():Promise<IUser[]>
    getAllInstructorsListForUser(userId: string): Promise<IUser[]>
    countAll() :Promise<number>;
    countByStatus(status:string):Promise<number>
    countByRole():Promise<{student: number, instructor:number, admin: number}>
    getRegistrationsOverTime(timeFrame: string):Promise<{date: string, count: number}[]>
    getTopInstructors(limit:number):Promise<IUser[]>
}