import { ICourses } from "../../../../domain/models/Courses";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class PublishCourseAdminUseCase {
    constructor(private courseRespository : ICourseRepository){}

    async execute(courseId: string, publishValue : boolean) : Promise<ICourses | null> {
        try {
            const foundCourse = await this.courseRespository.getCourseById(courseId)
            if(!foundCourse) throw new CustomError('Course not found', 404)
                if (!foundCourse.isPublished && foundCourse.lectures?.length === 0)
                    throw new CustomError(
                      `Course don't contain lectures, Add lectures before publish`,
                      400
                    );
            
            const publishedCourse = await this.courseRespository.publishCourse(courseId, publishValue);
            if(!publishedCourse) throw new CustomError('Failed to publish/unpublish course', 400)
                return publishedCourse;
        } catch (error) {
            throw error
        }
    }
}