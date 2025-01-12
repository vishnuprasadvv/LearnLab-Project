import { NextFunction, Request, Response } from "express";
import { InstructorRegisterUseCase } from "../../../application/use-cases/user/registerInstructor";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/userRepositoryImpl";
import { InstructorDocumentRepository } from "../../../infrastructure/repositories/instructorDocumentRepository";
import { CustomError } from "../../middlewares/errorMiddleWare";

const userRepository = new UserRepositoryImpl();
const instructorRegisterRepository = new InstructorDocumentRepository();
export const registerInstuctorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId, formData } = req.body;
  try {
    const useCase = new InstructorRegisterUseCase(
      userRepository,
      instructorRegisterRepository
    );
    const result = await useCase.execute(userId, formData);
    if (!result) {
      throw new CustomError(
        "Something went wrong, failed to apply for instructor",
        400
      );
    }
    res
      .status(200)
      .json({
        success: true,
        message: "Successfully applied for Instructor role",
      });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
