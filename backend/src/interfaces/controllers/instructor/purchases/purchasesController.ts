import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { GetPurchasesInstructorUseCase } from "../../../../application/use-cases/instructor/purchases/getPurchases";

const courseRepository = new CourseRepositoryClass();
const orderRepository = new OrderRepository();
const getPurchasesInstructorUseCase = new GetPurchasesInstructorUseCase(
  orderRepository,
  courseRepository
);
export const getPurchasesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) throw new CustomError("User not found", 400);
    const purchases = await getPurchasesInstructorUseCase.execute(user.id);
    if (!purchases) throw new CustomError("No purchased courses availble", 400);
    res.status(200).json({
      success: true,
      message: "Fetching instructor orders success",
      data: purchases,
    });
  } catch (error) {
    next(error);
  }
};
