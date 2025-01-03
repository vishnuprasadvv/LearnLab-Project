import { ICourses } from "../../../../domain/models/Courses";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class DeleteCourseUseCase {
    constructor(private courseRespository : ICourseRepository){}

    async execute(courseId : string): Promise <ICourses | null> {
        return this.courseRespository.deleteCourse(courseId)
    }
}