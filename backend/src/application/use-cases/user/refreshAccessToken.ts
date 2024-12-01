import { verifyRefreshToken } from "../../../utils/jwtHelper";
import User from "../../../domain/models/User";
import { generateAccessToken } from "../../../utils/jwtHelper";

export const refreshAccessToken = async(token : string) => {
    const refreshToken  = verifyRefreshToken(token);
    if(!refreshToken) throw new Error('Invalid or expired refresh token')
            console.log(refreshToken.id)
        const user : any = await User.findById(refreshToken.id)
        console.log(user)

        if(!user) throw new Error('User not found')
        
        const accessToken =  generateAccessToken({id: user._id, role : user.role})
        console.log('refresh access token ', accessToken)
        return accessToken
}