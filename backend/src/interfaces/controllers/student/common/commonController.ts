import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { GetAllCoursesUserUseCase } from "../../../../application/use-cases/student/getAllCourses";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRespository";
import { GetAllCategoriesAtOnceUseCase } from "../../../../application/use-cases/admin/category/getAllCategoriesAtOnce";
import { CategoryRespository } from "../../../../infrastructure/repositories/categoryRespository";
import { GetCourseByIdStudentUseCase } from "../../../../application/use-cases/student/getCourseById";

const courseRepository = new CourseRepositoryClass()
const categoryRepository = new CategoryRespository()
const getAllCoursesUserUseCase = new GetAllCoursesUserUseCase(courseRepository)
const getAllCategoriesUseCase = new GetAllCategoriesAtOnceUseCase(categoryRepository)
const getCourseByIdUseCase = new GetCourseByIdStudentUseCase(courseRepository)

export const getAllCoursesController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await getAllCoursesUserUseCase.execute()
        res.status(200).json({message: 'All courses fetched successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}

export const getCategoriesController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await getAllCategoriesUseCase.execute()
        res.status(200).json({message: 'All categories fetched successfully', success : true, data: categories})
    } catch (error) {
        next(error)
    }
}

export const getCourseController = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      if(!id) {
        throw new CustomError('course id not provided', 400)
      } 
        const courses = await getCourseByIdUseCase.execute(id)
        res.status(200).json({message: 'Course fetched successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}