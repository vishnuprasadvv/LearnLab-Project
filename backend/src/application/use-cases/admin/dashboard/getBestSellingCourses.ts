import { ICourses } from "../../../../domain/models/Courses";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class GetBestSellingCourses {
    constructor(private courseRepository : ICourseRepository){}

    async execute(limit: number = 10) : Promise<ICourses[]> {
        return this.courseRepository.getBestSellingCourses(limit)
    }
}