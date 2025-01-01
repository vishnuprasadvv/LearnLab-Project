import { ICourseRating } from "../../../domain/models/CourseRating";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../repositories/ICourseRepository";
import { IRatingRepository } from "../../repositories/IRatingRepository";


interface UpdateReviewRequest {
    ratingId: string;
    userId: string;
    rating: number;
    review: string;
  }

export class UpdateRatingUseCase{
    constructor(private ratingRepository: IRatingRepository, private courseRepository:ICourseRepository) {}
    async execute(request: UpdateReviewRequest): Promise<void>{
        const {ratingId , rating, userId, review} = request
        if(rating < 0.5 || rating > 5) {
            throw new CustomError('Rating must be between 0.5 to 5', 400)
        }
        if(review.length > 500) {
            throw new CustomError('Review cannot exceed 500 characters', 400)
        }

        const existingReview = await this.ratingRepository.findById(ratingId);
        if(!existingReview) {
            throw new CustomError('Review not found', 404)
        }

        if(existingReview.userId.toString() !== userId) {
            throw new CustomError('User can only update their own rating', 400)
        }
        const previousRating = existingReview.rating || 0;

        existingReview.rating = rating;
        existingReview.review = review;

        await this.ratingRepository.updateRating(existingReview)

        //update course rating
        let course = await this.courseRepository.findById(existingReview.courseId.toString());
        if(!course) return;
        if(!course.averageRating || !course.ratingsCount) return;
        let avgRating = course.averageRating ;
        let currentRatingCount = course.ratingsCount;

        if (rating === previousRating) {
            console.log("No change in rating; skipping course update.");
            return;
        }

        let updatedrating ;

        if(currentRatingCount === 1) {
            updatedrating = rating;
        }else{
           updatedrating = ((avgRating * currentRatingCount) - previousRating + rating) / currentRatingCount;
        }
       
        updatedrating = Math.round(updatedrating * 100) / 100;
        course.averageRating = updatedrating;
        await this.courseRepository.updateRating(course)
    }
}