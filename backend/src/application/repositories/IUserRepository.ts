import { IUser } from "../../domain/models/User";

export interface IUserRepository{
    findById(userId: string) : Promise<IUser | null>;
    findByIdWithPassword(userId: string): Promise<IUser | null>
    updatePassword(userId: string, newPassword: string):Promise<IUser | null>
    findEmailAlreadyExists (email: string, userid: string) : Promise<boolean> 
    update(user: Partial<IUser>):Promise<IUser | null>
    approveUserSignupVerification(email: string):Promise<boolean>
    deleteUser(userId: string):Promise<boolean>
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

    //admin
    getAllUsersAdminWithFilter ( search: string, page: number, limit: number): Promise<{users: IUser[]; total: number}> 
    updateUserStatusAdmin(userId:string, status: string):Promise<IUser | null>
    updateUserRoleAdmin(userId:string, role: string):Promise<IUser | null>
}