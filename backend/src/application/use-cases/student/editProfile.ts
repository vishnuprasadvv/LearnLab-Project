import User, { IUser } from "../../../domain/models/User";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IUserRepository } from "../../repositories/IUserRepository";

interface IEditProfile{
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export class EditProfileUseCase {
  constructor(private userRepository: IUserRepository){}

  async execute({ userId, firstName, lastName, email, phone,}: IEditProfile ) {
    try {
      const userExist = await this.userRepository.findByIdWithPassword(userId)
      if (!userExist) {
        throw new CustomError("User not found, Unauthorized", 400);
      }
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new CustomError("Enter a valid email", 400);
      }
      const findEmailAlreadyExistsOrNot = await this.userRepository.findEmailAlreadyExists(email, userId)
  
      if (findEmailAlreadyExistsOrNot) {
        throw new CustomError("Given email already exists.", 400);
      }
  
      const phoneRegex = /^\d{10}$/; // Example: 10-digit number
      if (!phoneRegex.test(phone)) {
        throw new CustomError("Enter a valid phone number", 400);
      }
  
      userExist.firstName = firstName;
      userExist.lastName = lastName;
      userExist.phone = phone;
  
      //SAVE UPDATED USER DATA
      const updatedUser = await this.userRepository.update(userExist)
      if(!updatedUser) throw new CustomError('Update failed. User ID not found', 404)
      return {
        _id: userExist._id,
        role: userExist.role,
        firstName: userExist.firstName,
        lastName: userExist.lastName,
        email: userExist.email,
        phone: userExist.phone,
        createAt: userExist.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }
}

