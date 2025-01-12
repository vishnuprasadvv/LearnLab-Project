import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { RatingRepository } from "../../../../infrastructure/repositories/ratingRepository";
import { SubmitRatingUseCase } from "../../../../application/use-cases/student/submitRating";
import { GetCourseRatingUseCase } from "../../../../application/use-cases/student/getCourseRating";
import { UpdateRatingUseCase } from "../../../../application/use-cases/student/updateRating";
import { DeleteRatingUseCase } from "../../../../application/use-cases/student/deleteRating";
import { CourseRepositoryClass } from "../../../../infrastructure/repositories/courseRepository";

const ratingRepository = new RatingRepository();
const courseRepository = new CourseRepositoryClass()
const addRatingUseCase = new SubmitRatingUseCase(ratingRepository, courseRepository)
const getCourseRatingsUseCase = new GetCourseRatingUseCase(ratingRepository)
const updateCoureRatingUseCase = new UpdateRatingUseCase(ratingRepository,courseRepository)
const deleteCourseRatingUseCase = new DeleteRatingUseCase(ratingRepository,courseRepository)

export const addRatingController = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {courseId, rating, review} = req.body;
        if(!courseId) throw new CustomError('Course ID is required', 400);
        if(!rating){
            throw new CustomError('Rating is required', 400)
        }
        const userId = req.user?.id;
        if(!userId) throw new CustomError('User ID is required', 400);
       const newRating =  await addRatingUseCase.execute({courseId, rating, review, userId})
        res.status(200).json({success:true, message : 'Review submitted successfully', data: newRating})
    } catch (error) {
        next(error)
    }
}

export const getCourseRatingsController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {courseId} = req.params;
        if(!courseId) throw new CustomError('Course ID is required',400);
        const courseRatings = await getCourseRatingsUseCase.execute(courseId)
        res.status(200).json({success:true, message:'fetching rating success', data:courseRatings || []})
    } catch (error) {
        next(error)
    }
}

export const updateRatingController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {ratingId} = req.params;
        const {rating, review } = req.body
        const userId = req.user?.id
        if(!userId) throw new CustomError('User ID is required', 400)
        if(!ratingId) throw new CustomError('Rating ID is required',400);
        await updateCoureRatingUseCase.execute({
            ratingId, 
            userId, 
            review, 
            rating
        })
        res.status(200).json({success:true, message:'Rating updated successfully'})
    } catch (error) {
        next(error)
    }
}

export const deleteRatingController = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {ratingId} = req.params;
        const userId = req.user?.id
        if(!userId) throw new CustomError('User ID is required', 400)
        if(!ratingId) throw new CustomError('Rating ID is required',400);
        await deleteCourseRatingUseCase.execute(ratingId, userId)
        res.status(200).json({success:true, message:'Rating deleted successfully'})
    } catch (error) {
        next(error)
    }
}

