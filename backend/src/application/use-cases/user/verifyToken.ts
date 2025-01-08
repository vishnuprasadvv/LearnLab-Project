import User from "../../../domain/models/User"
import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl"
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare"
import { verifyAccessToken, verifyRefreshToken } from "../../../utils/jwtHelper"


const userRepository = new UserRepositoryImpl()

export const verifyAccessTokenUseCase = async(token : string) => {

    try {
        const verifyTokenResponse = verifyAccessToken(token)
        if(!verifyTokenResponse?.id) {
            console.error('verify token not found')
            return;
        }
        const findUser = await userRepository.findById(verifyTokenResponse.id)
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