import { verifyRefreshToken } from "../../../utils/jwtHelper";
import User from "../../../domain/models/User";
import { generateAccessToken } from "../../../utils/jwtHelper";

export const refreshAccessToken = (token : string) => {
    const refreshToken  = verifyRefreshToken(token);
    if(!refreshToken) throw new Error('Invalid or expired refresh token')

        const user : any = User.findById(refreshToken)

        if(!user) throw new Error('User not found')
        
        return generateAccessToken({id: user._id, role : user.role})
}