import { NextFunction, Request, Response } from "express";
import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRespository";
import { CreateCourseUseCase } from "../../../../application/use-cases/instructor/course/createCourse";
import { uploadCourseImageToCloudinary } from "../../../../infrastructure/cloud/cloudinary";
import { GetAllCoursesUseCase } from "../../../../application/use-cases/instructor/course/getAllCourses";


const courseRepository = new CourseRepositoryClass();
const createCourseUseCase  = new CreateCourseUseCase(courseRepository)
const getAllCoursesUseCase = new GetAllCoursesUseCase(courseRepository)

export const createCourseController = async( req: Request, res: Response, next : NextFunction) => {
    try {
        const {title, description, category , price, duration, level} : ICourses = req.body;
        const courseImage = req.file;

        const instructor = req.user
        if(!instructor || instructor.role !== 'instructor'){
            throw new CustomError('Instructor not found, try again.', 400)
        }

        if(!courseImage){
            throw new CustomError('Please select an image for course.', 400)
        }

        const newCourse = await createCourseUseCase.execute({title, description, category, price, duration, level,
            instructor: instructor.id}, courseImage.buffer)
            
        console.log(newCourse)
        res.status(200).json({success: true, message : "Course created successfully", data: newCourse})
        
    } catch (error) {
        next (error)
    }
}

export const createCourseLectureController = async( req: Request, res: Response, next : NextFunction) => {
    try {
        console.log(req.body)
        console.log(req.files)
    } catch (error) {
        next (error)
    }
}


export const getAllCoursesController = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await getAllCoursesUseCase.execute()
        res.status(200).json({message: 'All courses fetched successfully', success : true, data: courses})
    } catch (error) {
        next(error)
    }
}