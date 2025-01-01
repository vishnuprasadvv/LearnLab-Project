import { ICourseRating } from "../../../domain/models/CourseRating";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IRatingRepository } from "../../repositories/IRatingRepository";


interface UpdateReviewRequest {
    ratingId: string;
    userId: string;
    rating: number;
    review: string;
  }

export class UpdateRatingUseCase{
    constructor(private ratingRepository: IRatingRepository) {}
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

        existingReview.rating = rating;
        existingReview.review = review;

        await this.ratingRepository.updateRating(existingReview)

    }
}