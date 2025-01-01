import { IRatingRepository } from "../../repositories/IRatingRepository";

export class GetCourseRatingUseCase {
    constructor(private ratingRepository: IRatingRepository){}
    async execute(courseId: string){
        return await this.ratingRepository.getCourseRatings(courseId)
    }
}