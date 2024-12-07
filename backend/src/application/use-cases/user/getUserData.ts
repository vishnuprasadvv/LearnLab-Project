import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl"
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare"

const userRepository =new UserRepositoryImpl()
export const getUserData = async(userId: string) => {
    const userdata = userRepository.findById(userId)
    if(!userdata) {
        throw new CustomError('user not found', 400)
    }

    return userdata
}