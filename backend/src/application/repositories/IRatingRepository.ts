import { ICourseRating } from "../../domain/models/CourseRating";

export interface IRatingRepository{
    submitRating(rating: ICourseRating): Promise<ICourseRating | null> ;
    getCourseRatings(courseId: string) : Promise<ICourseRating[] | null>
    getExistingRating(courseId: string, userId: string):Promise<ICourseRating | null>
}