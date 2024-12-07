import User from "../../../domain/models/User"
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare"
import { verifyAccessToken, verifyRefreshToken } from "../../../utils/jwtHelper"

export const verifyAccessTokenUseCase = async(token : string) => {

    try {
        const verifyTokenResponse = verifyAccessToken(token)
        const findUser = await User.findById(verifyTokenResponse?.id).select('-password')
        if(!findUser){
            throw new CustomError('User not found', 400)
        }
        if(findUser.status !== 'active'){
            throw new CustomError('User blocked', 400)
        }
        return findUser
        
    } catch (error) {
        console.log(error)
        throw error
    }
}

export const verifyRefreshTokenUseCase = (token : string) => {
    return verifyRefreshToken(token)
}