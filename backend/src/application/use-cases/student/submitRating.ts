import { ICourseRating } from "../../../domain/models/CourseRating";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../repositories/ICourseRepository";
import { IRatingRepository } from "../../repositories/IRatingRepository";

export class SubmitRatingUseCase {
  constructor(
    private ratingRepository: IRatingRepository,
    private courseRepository: ICourseRepository
  ) {}
  async execute(rating: ICourseRating): Promise<ICourseRating | null> {
    try {
      if (rating.rating < 1 || rating.rating > 5) {
        throw new CustomError("Rating must be between 1 and 5", 400);
      }
      const existingRating = await this.ratingRepository.getExistingRating(
        rating.courseId.toString(),
        rating.userId.toString()
      );
      if (existingRating) {
        throw new CustomError("You have already rated this course.", 400);
      }

      const newRating = await this.ratingRepository.submitRating(rating);

      //add rating to cousre
      const course = await this.courseRepository.findById(
        rating.courseId.toString()
      );
      if (!course) return null;
      let avgRating = course.averageRating || 0;
      let totalRatingCount = course.ratingsCount || 0;
      //update course document
      course.averageRating =
        (avgRating * totalRatingCount + rating.rating) / (totalRatingCount + 1);
      course.ratingsCount = totalRatingCount + 1;

      await this.courseRepository.updateRating(course);
      return newRating;
    } catch (error) {
      throw error;
    }
  }
}
