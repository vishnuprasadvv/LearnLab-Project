import { verifyAccessToken, verifyRefreshToken } from "../../../utils/jwtHelper"

export const verifyAccessTokenUseCase = (token : string) => {
    return verifyAccessToken(token)
}

export const verifyRefreshTokenUseCase = (token : string) => {
    return verifyRefreshToken(token)
}