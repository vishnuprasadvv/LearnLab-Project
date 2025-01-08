
import {
  comparePassword,
  hashPassword,
} from "../../../infrastructure/services/hashService";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IUserRepository } from "../../repositories/IUserRepository";

interface IChangePassword {
  userId: string;
  oldPassword: string;
  newPassword: string;
}
export class ChangePasswordProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ userId, oldPassword, newPassword }: IChangePassword) {
    try {
      const userExist = await this.userRepository.findByIdWithPassword(userId);

      if (oldPassword === newPassword) {
        throw new CustomError("Cannot use previous password", 400);
      }

      if (!userExist) {
        throw new CustomError("User not found", 400);
      }

      const compareUserPassword = await comparePassword(
        oldPassword,
        userExist.password!
      );
      if (!compareUserPassword) {
        throw new CustomError("Wrong password", 400);
      }

      const hashNewPassword = await hashPassword(newPassword);

      if (!hashNewPassword) {
        throw new CustomError("password hashing error", 400);
      }

      const changePassword = await this.userRepository.updatePassword(
        userId,
        hashNewPassword
      );
      return changePassword;
    } catch (error) {
      throw error;
    }
  }
}
