import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class UpdateLectureUseCase {
    constructor(private courseRepository: ICourseRepository){}

    async execute(courseId: string, lectures: any[]) : Promise<any> {

        const course = await this.courseRepository.getCourseById(courseId);
        if(!course){
            throw new CustomError('Course not found', 404)
        }

        //add lectures to course
        const updatedCourse = await this.courseRepository.updateLecture(courseId, lectures);

        if(!updatedCourse){
            throw new CustomError('Failed to add lectures', 500)
        }
        return updatedCourse;
    }
}