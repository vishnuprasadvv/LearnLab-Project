import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { GetInstructorDashboardMetricsUseCase } from "../../../../application/use-cases/instructor/dashboard/dashboardMetrics";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { GetInstructorEarningsUseCase } from "../../../../application/use-cases/instructor/dashboard/getEarnings";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";

const courseRepository = new CourseRepositoryClass()
const orderRepository = new OrderRepository()
export const getInstructorDashboardMetricsController = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const instructorId = req.user?.id;
        if(!instructorId) {
            throw new CustomError('Instructor ID is required', 400)
        }
        const useCase = new GetInstructorDashboardMetricsUseCase(courseRepository);
        const metrics = await useCase.execute(instructorId);
        res.status(200).json({success: true, data: metrics})

    } catch (error) {
        next(error)
    }
}

export const getInstructorEarningsController = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const instructorId = req.user?.id;
        if(!instructorId) {
            throw new CustomError('Instructor ID is required', 400)
        }
        const useCase = new GetInstructorEarningsUseCase(orderRepository);
        const sales = await useCase.execute(instructorId);
        res.status(200).json({success: true, data: sales})

    } catch (error) {
        next(error)
    }
}

