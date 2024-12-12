import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class GetCourseByIdUseCase {
    constructor(private courseRepository: ICourseRepository){

    }
    async execute(courseId: string) : Promise<ICourses | null> {
        if(!courseId){
            throw new CustomError('Course id not found', 404)
        }
        const course= await this.courseRepository.getCourseById(courseId)
        if(!course) {
            throw new CustomError('No course available with this id', 404)
        }
        return course;
    }
}