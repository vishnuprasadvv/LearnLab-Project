import User from "../../../domain/models/User";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import bcrypt from 'bcryptjs'
import { IUserRepository } from "../../repositories/IUserRepository";
import { hashPassword } from "../../../infrastructure/services/hashService";


interface GetAllUsersParams {
  search: string;
  page: number;
  limit: number;
}

export class GetAllUsersUseCaseAdminWithFilter {
  constructor(private userRepository: IUserRepository) {}

  async execute ({search, page, limit } : GetAllUsersParams) {
    try {
      const {users, total} = await this.userRepository.getAllUsersAdminWithFilter(search, page, limit);

      if(!users) {
        throw new CustomError('Failed to get users list', 400)
      }
      return { users, total}
    } catch (error) {
      throw error
    }
  }
}


export class DeleteUserUseCaseAdmin{
  constructor(private userRepository: IUserRepository){}
  async execute(userId: string) {
    const deleteStatus = await this.userRepository.deleteUser(userId)
    if(!deleteStatus) {
      throw new CustomError('Error removing user', 400)
    }
    return deleteStatus;
  }
}


export class ToggleUserStatusUseCase{
  constructor(private userRepository:IUserRepository){}
  async execute(userid: string, status:string){
    if(!['active', 'inactive'].includes(status)){
      throw new CustomError('Invalid status', 400)
  }
  try {
    const user = await this.userRepository.updateUserStatusAdmin(userid, status)
    if(!user){
        throw new CustomError('User not found', 400)
    }
    return user
} catch (error) {
    return error
} 
  }
}

export class CreateUserUseCaseAdmin {
  constructor(private userRepository: IUserRepository){}

  async execute(firstName: string, lastName : string, email: string, phone : string, password: string, role: string, userStatus: string){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new CustomError('Enter a valid email', 400)
    }

    const userExist = await this.userRepository.getUserByEmail(email)
    if(userExist){
        throw new CustomError('User already exists', 400)
    }
    if(!password){
        throw new CustomError('password required', 400)
    }
    const hashedPassword = await hashPassword(password)
    const registeredUser = await this.userRepository.createUser({firstName, lastName, email, role, password: hashedPassword, phone, status : userStatus })
     return registeredUser;
  }
}

export class EditUserUseCaseAdmin{
  constructor(private userRepository: IUserRepository){}

  async execute(id: string,firstName: string, lastName : string, email: string, phone : string, role: string, userStatus: string){
    if (!id || !firstName || !lastName || !email || !phone || !role || !userStatus) {
      throw new CustomError('All fields are required', 400);
    }
      const user = await this.userRepository.findById(id)
      if(!user){
          throw new CustomError('User not found, create user', 400 )
      }

      const checkEmailAlreadyExists = await this.userRepository.findEmailAlreadyExists(email, id)

      if(checkEmailAlreadyExists){
        throw new CustomError('Email is already in use', 400)
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if(!emailRegex.test(email)){
          throw new CustomError('Enter a valid email', 400)
      }
      
     
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    user.role = role;
    user.status = userStatus;
      
      const updatedUser = await this.userRepository.update(user)
      return updatedUser;
  }
}

