import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class GetAllCoursesAdminUseCase{
    constructor(private courseRepository: ICourseRepository) {}
    async execute(query: string, page: number, limit?: number): Promise <{courses: ICourses[] , total: number}> {
        const result = await this.courseRepository.getAllCoursesAdmin(query, page, limit);
        if(!result) {
            throw new CustomError('Error fetching courses from DB', 400)
        }
        return {courses: result.courses, total : result.total};
    }
}