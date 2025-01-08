import bcrypt from 'bcryptjs'
import User, {IUser} from '../../../domain/models/User'
import { CustomError } from '../../../interfaces/middlewares/errorMiddleWare';
import { IUserRepository } from '../../repositories/IUserRepository';
import { hashPassword } from '../../../infrastructure/services/hashService';



export class RegisterUserUseCase{
    constructor(private userRepository: IUserRepository){}

    async execute(userData: {firstName: string, lastName: string, email: string, phone: string, password: string}) {
        const {firstName , lastName, email, password, phone} = userData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            throw new CustomError('Enter a valid email', 400)
        }
         //check user already exists or not 
    const userExist = await this.userRepository.getUserByEmail(email)
    if(userExist && userExist.isVerified === false){
        throw new CustomError('Please verify your account',400)
    }
    if(userExist){
        throw new CustomError('User already exists', 400)
    }
    if(!password){
        throw new CustomError('password required', 400)
    }

    const hashedPassword = await hashPassword(password)
    const registeredUser = await this.userRepository.createUser({firstName, lastName, email, role : 'student', password: hashedPassword, phone})
     return registeredUser
    }
}
