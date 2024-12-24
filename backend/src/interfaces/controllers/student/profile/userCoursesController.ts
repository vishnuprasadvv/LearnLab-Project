import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";
import { OrderRepository } from "../../../../infrastructure/repositories/orderRepository";
import { GetUserCoursesUseCase } from "../../../../application/use-cases/student/getUserCourses";

const courseRepository =new CourseRepositoryClass()
const orderRepository = new OrderRepository();
const getUserCoursesUseCase = new GetUserCoursesUseCase(courseRepository, orderRepository)
export const getUserCoursesController = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const user = req.user
        if(!user){
            throw new CustomError('User not found', 400)
        }
        const courses = await getUserCoursesUseCase.execute(user.id)
        if(!courses){
            throw new CustomError('User courses not found', 400)
        }
        res.status(200).json({success: true, message: 'User courses fetched', data: courses})
    } catch (error) {
        next(error)
    }
}