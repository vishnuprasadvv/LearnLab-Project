import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class GetAllCoursesAdminUseCase{
    constructor(private courseRepository: ICourseRepository) {}
    async execute(): Promise <ICourses[]> {
        const courses = await this.courseRepository.getAllCoursesAdmin();
        if(!courses) {
            throw new CustomError('Error fetching courses from DB', 400)
        }
        return courses;
    }
}