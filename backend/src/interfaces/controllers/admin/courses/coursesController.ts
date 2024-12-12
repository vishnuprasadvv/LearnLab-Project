import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRespository";
import { GetAllCoursesAdminUseCase } from "../../../../application/use-cases/admin/courses/getAllCourses";
import { GetCourseByIdAdminUseCase } from "../../../../application/use-cases/admin/courses/getCourseById";
import { DeleteCourseAdminUseCase } from "../../../../application/use-cases/admin/courses/deleteCourse";
import { PublishCourseAdminUseCase } from "../../../../application/use-cases/admin/courses/publishCourse";

const courseRepository = new CourseRepositoryClass()
const getAllCoursesUseCase = new GetAllCoursesAdminUseCase(courseRepository)
const getCourseByIdUseCase = new GetCourseByIdAdminUseCase(courseRepository)
const deleteCourseUseCase = new DeleteCourseAdminUseCase(courseRepository)
const publishCourseUseCase = new PublishCourseAdminUseCase(courseRepository)
export const getAllCoursesController = async(req: Request, res: Response, next: NextFunction) => {
    try {
     
        const courses = await getAllCoursesUseCase.execute()
        res.status(200).json({message: 'All courses fetched successfully', success : true, data: courses})
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

export const deleteCourseController = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      if(!id) {
        throw new CustomError('course id not provided', 400)
      } 
        const courses = await deleteCourseUseCase.execute(id)
        res.status(200).json({message: 'Course deleted successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}

export const publishCourseController = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {courseId} = req.params;
      const {publishValue} = req.body
      console.log(req.body)
      if(!courseId) {
        throw new CustomError('course id not provided', 400)
      } 
        const publishedCourse = await publishCourseUseCase.execute(courseId , publishValue)
        if(!publishedCourse){
          throw new CustomError('Failed to publish course', 400)
        }
        console.log(publishedCourse.isPublished)
        res.status(200).json({message: `Course ${publishedCourse.isPublished ? 'published' : 'unpublished'} successfully`,
           success : true, data: publishedCourse})
    } catch (error) {
        next(error)
    }
}