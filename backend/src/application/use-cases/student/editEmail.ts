import { verifyOtp } from "../../../infrastructure/services/otpService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IUserRepository } from "../../repositories/IUserRepository";

interface IEditEmail {
  userId: string;
  email: string;
  otp: string;
}

export class EditProfileEmailUseCase {
  constructor(private userRepository: IUserRepository) {}
  async execute({ userId, email, otp }: IEditEmail) {
    try {
      const userExist = await this.userRepository.findById(userId);
      if (!userExist) {
        throw new CustomError("User not found, Unauthorized", 400);
      }

      const findEmailAlreadyExistsOrNot =
        await this.userRepository.findEmailAlreadyExists(email, userId);

      if (findEmailAlreadyExistsOrNot) {
        throw new CustomError("Given email already exists.", 400);
      }

      const verifiedOtp = await verifyOtp(email, otp);

      if (!verifiedOtp) {
        throw new CustomError("Email OTP verification failed", 400);
      }

      userExist.email = email;
      const updatedUser = await this.userRepository.update(userExist);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
