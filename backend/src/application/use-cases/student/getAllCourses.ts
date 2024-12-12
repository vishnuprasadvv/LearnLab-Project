import { ICourses } from "../../../domain/models/Courses";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../repositories/ICourseRepository";


export class GetAllCoursesUserUseCase{
    constructor(private courseRepository: ICourseRepository) {}
    async execute(): Promise <ICourses[]> {
        const courses = await this.courseRepository.getAllCoursesUsers();
        if(!courses) {
            throw new CustomError('Error fetching courses from DB', 400)
        }
        return courses;
    }
}