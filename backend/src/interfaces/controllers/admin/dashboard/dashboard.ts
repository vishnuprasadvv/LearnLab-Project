import { NextFunction, Request, Response } from "express";
import { GetDashboardDataUseCase } from "../../../../application/use-cases/admin/dashboard/getDashboardData";
import { UserRepositoryImpl } from "../../../../infrastructure/repositories/userRepositoryImpl";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { GetBestSellingCourses } from "../../../../application/use-cases/admin/dashboard/getBestSellingCourses";
import { GetBestInstructorUseCase } from "../../../../application/use-cases/admin/dashboard/getBestInstructor";

const userRepository = new UserRepositoryImpl();
const courseRepository = new CourseRepositoryClass();
const orderRepository = new OrderRepository()
const getDashboardDataUseCase = new GetDashboardDataUseCase( userRepository, courseRepository, orderRepository)
export const getDashboardDataController = async(req: Request, res: Response, next:NextFunction) => {
    try {
        const dashboardData = await getDashboardDataUseCase.execute()
        res.status(200).json({data: dashboardData, success: true})
    } catch (error) {
        next(error)
    }
}

export const getBestSellingCoursesController = async(req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 10;
    try {
        const useCase = new GetBestSellingCourses(courseRepository)
        const courses = await useCase.execute(limit);
        res.status(200).json({success: true, data: courses})
    } catch (error) {
        next(error)
    }
}

export const getTopInstructorsController = async (req: Request, res: Response, next: NextFunction) => {
    const limit = parseInt(req.query.limit as string) || 10;
  
    try {
      const useCase = new GetBestInstructorUseCase(userRepository)
      const bestInstructors = await useCase.execute(limit)
      console.log(bestInstructors)
      res.status(200).json({success: true, data:bestInstructors });
    } catch (error) {
     next(error)
    }
  };