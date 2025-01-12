import User from "../../../domain/models/User";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../utils/jwtHelper";
import { comparePassword } from "../../../infrastructure/services/hashService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IUserRepository } from "../../repositories/IUserRepository";

export class LoginUserUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute(email: string, password: string) {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) {
      throw new CustomError("User not found, Please register", 404);
    } else if (user.isVerified === false) {
      throw new CustomError("User not verified", 400);
    }
    if (user.googleId) {
      throw new CustomError("User registered with social login", 400);
    }
    //check role of user for login page based
    if (user.role !== "student" && user.role !== "instructor") {
      throw new CustomError("You are not authorized", 400);
    }
    //check user blocked or not
    if (user.status === "inactive") {
      throw new CustomError("You are blocked", 400);
    }

    if(!user.password){
        console.error('password not found in user collection')
        return ;
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new CustomError("Invalid credentials", 400);

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    return {
      accessToken,
      refreshToken,
      user: {
        profileImageUrl: user.profileImageUrl,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    };
  }
}

