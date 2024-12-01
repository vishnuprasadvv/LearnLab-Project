import User from "../../../domain/models/User";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import bcrypt from 'bcryptjs'


export const getAllUsers = async () =>{
    const users = await User.find()
    if(!users) throw new CustomError('failed to get users list', 400)
    return users
}

export const deleteUser = async (userid: string) => {
    const deletedUser = await User.findByIdAndDelete(userid)
    return deleteUser
}

export const toggleUser = async (userid: string, status:string) => {
    if(!['active', 'inactive'].includes(status)){
        throw new CustomError('Invalid status', 400)
    }

    try {
        const user = await User.findByIdAndUpdate(userid, {status}, {new : true})
        if(!user){
            throw new CustomError('User not found', 400)
        }
        return user
    } catch (error) {
        return error
    } 
}

export const createUser = async (firstName: string, lastName : string, email: string, phone : string, password: string, role: string, userStatus: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new CustomError('Enter a valid email', 400)
    }
    //check user already exists or not 
    const userExist = await  User.findOne({email})
    if(userExist){
        throw new CustomError('User already exists', 400)
    }
    if(!password){
        throw new CustomError('password required', 400)
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User ({firstName, lastName, email, role, password: hashedPassword, phone, status : userStatus })
    
    return user.save();
}

export const getEditUser = async (userId:string) => {
    const user = await User.findById(userId);
    if(!user){
        throw new CustomError('User not found', 404)
    }

    return user
}


export const postEditUser = async (id: string,firstName: string, lastName : string, email: string, phone : string, password: string, role: string, userStatus: string) => {
     // Validate required fields
  if (!id || !firstName || !lastName || !email || !phone || !password || !role || !userStatus) {
    throw new CustomError('All fields are required', 400);
  }
    const user = await User.findById(id)
    if(!user){
        throw new CustomError('User not found with this email, create user', 400 )
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(email)){
        throw new CustomError('Enter a valid email', 400)
    }
    
    if(!password){
        throw new CustomError('password required', 400)
    }
    const hashedPassword = await bcrypt.hash(password,10)
   
    user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.phone = phone;
  user.password = hashedPassword;
  user.role = role;
  user.status = userStatus;
    
    await user.save();
    return user
}