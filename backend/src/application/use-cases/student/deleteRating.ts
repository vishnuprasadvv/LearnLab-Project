import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../repositories/ICourseRepository";
import { IRatingRepository } from "../../repositories/IRatingRepository";

export class DeleteRatingUseCase {
    constructor(private ratingRepository: IRatingRepository, private courseRepository: ICourseRepository) {}
    async execute(ratingId:string, userId:string):Promise<void> {
        const existingReview = await this.ratingRepository.findById(ratingId);
        if(!existingReview){
            throw new CustomError('Rating not found', 404);
        }
        if(existingReview.userId.toString() !== userId) {
            throw new CustomError('You can only delete your own ratings', 403)
        }
        //delete the rating
        await this.ratingRepository.deleteById(ratingId)
        
        //update rating
        const course = await this.courseRepository.findById(existingReview.courseId.toString())
        
        if(!course || !course.ratingsCount || !course.averageRating) return;
       
        course.ratingsCount -= 1;
        let avgRating = course?.averageRating;
        if(course.ratingsCount > 0){
            avgRating = (avgRating * (course.ratingsCount + 1) - existingReview.rating)/ course.ratingsCount;
        }else{
            avgRating = 0;
        }

        //update course 
        course.averageRating = Math.round(avgRating * 100) / 100;
        await this.courseRepository.updateRating(course)
    }
}