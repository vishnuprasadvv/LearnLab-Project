import User from "../../../domain/models/User";
import bcrypt from 'bcryptjs';
import { generateToken } from "../../../utils/jwtHelper";
import { comparePassword } from "../../../infrastructure/services/hashService";

export const loginUser = async (email : string, password: string) => {
    const user:any = await User.findOne({email});
    if(!user){
        throw new Error('User not found')
    }
    const isPasswordValid = await comparePassword(password, user.password)
    if(!isPasswordValid) throw new Error('Invalid credentials');

    const token = generateToken(user._id)
    return {token, user:{ id: user._id, firstName : user.firstName, lastName: user.lastName, email: user.email}}
}