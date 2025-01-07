import { ICourseRepository } from "../../repositories/ICourseRepository";

export class GetTopRatedCoursesLimitedUseCase{ 
    constructor(private courseRepository: ICourseRepository){}

    async execute(limit: number) {
        return await this.courseRepository.getTopRatedCoursesUser(limit)
    }
}