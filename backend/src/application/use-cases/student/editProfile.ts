import User from "../../../domain/models/User";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { sendOtp } from "../user/sendOtp";

export const editProfile = async ({
  userId,
  firstName,
  lastName,
  email,
  phone,
}: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}) => {
  try {
    const userExist: any = await User.findById(userId);
    if (!userExist) {
      throw new CustomError("User not found, Unauthorized", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new CustomError("Enter a valid email", 400);
    }
    const findEmailAlreadyExistsOrNot = await User.findOne({
      email: email,
      _id: { $ne: userId },
    });

    if (findEmailAlreadyExistsOrNot) {
      throw new CustomError("Given email already exists.", 400);
    }

    const phoneRegex = /^\d{10}$/; // Example: 10-digit number
    if (!phoneRegex.test(phone)) {
      throw new CustomError("Enter a valid phone number", 400);
    }

    // if (email !== userExist.email) {
    //   console.log("email not matching, sending otp");
    //   // Trigger OTP for email verification
    //  const sendedOtp =  await sendOtp(email);
    // }

    userExist.firstName = firstName;
    userExist.lastName = lastName;
    userExist.phone = phone;

    //SAVE UPDATED USER DATA
    await userExist.save();
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
};
