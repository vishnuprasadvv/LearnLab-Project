import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { RatingRepository } from "../../../../infrastructure/repositories/ratingRepository";
import { SubmitRatingUseCase } from "../../../../application/use-cases/student/submitRating";
import { GetCourseRatingUseCase } from "../../../../application/use-cases/student/getCourseRating";

const ratingRepository = new RatingRepository();
const addRatingUseCase = new SubmitRatingUseCase(ratingRepository)
const getCourseRatingsUseCase = new GetCourseRatingUseCase(ratingRepository)
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
        console.log(courseId)
        if(!courseId) throw new CustomError('Course ID is required',400);
        const courseRatings = await getCourseRatingsUseCase.execute(courseId)
        res.status(200).json({success:true, message:'fetching rating success', data:courseRatings || []})
    } catch (error) {
        next(error)
    }
}