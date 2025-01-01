import { ICourseRating } from "../../../domain/models/CourseRating";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IRatingRepository } from "../../repositories/IRatingRepository";

export class SubmitRatingUseCase {
    constructor(private ratingRepository:IRatingRepository){}
    async execute(rating: ICourseRating) : Promise<ICourseRating | null> {
        try {
            if(rating.rating < 1 || rating.rating > 5) {
                throw new CustomError('Rating must be between 1 and 5',400);
            }
            const existingRating = await this.ratingRepository.getExistingRating(rating.courseId.toString(), rating.userId.toString())
            console.log('existing rating', existingRating)
            if(existingRating){
                throw new CustomError('You have already rated this course.', 400)
            }else{
                console.log('new rating', rating)
               return await this.ratingRepository.submitRating(rating)
            }
        } catch (error) {
            throw error;
        }
       
    }
}