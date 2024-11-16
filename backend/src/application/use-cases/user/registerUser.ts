import bcrypt from 'bcryptjs'
import User, {IUser} from '../../../domain/models/User'

export const registerUser = async (userData : IUser) => {
    const {firstName , lastName, email, password} = userData;
    
    //check user already exists or not 
    const userExist = await  User.findOne({email})
    if(userExist){
        throw new Error('User already exists')
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const user = new User ({firstName, lastName, email, role : 'student', password: hashedPassword})
    
    return user.save();
}