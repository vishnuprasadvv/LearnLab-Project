import bcrypt from 'bcryptjs'
import User, {IUser} from '../../../domain/models/User'
import { CustomError } from '../../../interfaces/middlewares/errorMiddleWare';

export const registerUser = async (userData : IUser) => {

    const {firstName , lastName, email, password, phone} = userData;
    console.log(userData)
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new CustomError('Enter a valid email', 400)
    }
    //check user already exists or not 
    const userExist = await  User.findOne({email})
    if(userExist && userExist.isVerified === false){
        throw new CustomError('Please verify your account',400)
    }
    if(userExist){
        throw new CustomError('User already exists', 400)
    }
    if(!password){
        throw new CustomError('password required', 400)
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User({firstName, lastName, email, role : 'student', password: hashedPassword, phone})
  
   return user.save();
}