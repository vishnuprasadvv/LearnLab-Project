import { verifyRefreshToken } from "../../../utils/jwtHelper";
import { generateAccessToken } from "../../../utils/jwtHelper";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl";

const userRepository = new UserRepositoryImpl();
export const refreshAccessToken = async(token : string) => {
    const refreshToken  = verifyRefreshToken(token);
    if(!refreshToken) throw new Error('Invalid or expired refresh token')
        const user : any = await userRepository.findById(refreshToken.id)

        if(!user) throw new Error('User not found')
        
        const accessToken =  generateAccessToken({id: user._id, role : user.role})
        return accessToken
}