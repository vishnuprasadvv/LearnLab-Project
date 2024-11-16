import { verifyToken } from "../../../utils/jwtHelper";

export const verifyTokenUseCase = (token : string) => {
    return verifyToken(token)
};