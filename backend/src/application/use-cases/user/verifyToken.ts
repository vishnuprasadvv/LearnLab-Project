// import { verifyToken } from "../../../utils/jwtHelper";

// export const verifyTokenUseCase = (token : string) => {
//     return verifyToken(token)
// };

import { verifyAccessToken, verifyRefreshToken } from "../../../utils/jwtHelper"

export const verifyAccessTokenUseCase = (token : string) => {
    return verifyAccessToken(token)
}

export const verifyRefreshTokenUseCase = (token : string) => {
    return verifyRefreshToken(token)
}