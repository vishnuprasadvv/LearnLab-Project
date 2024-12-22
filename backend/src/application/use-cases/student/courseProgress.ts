import Courses from "../../../domain/models/Courses";
import { CourseProgressRepository } from "../../../infrastructure/repositories/courseProgressRepository";

export class ProgressUseCase {
    constructor(private progressRepository: CourseProgressRepository){}

    async getProgress(userId: string, courseId : string) {
        return await this.progressRepository.getUserCourseProgress(userId, courseId);
    }

    async initializeProgress(userId:string, courseId: string) {
        const course = await Courses.findById(courseId).exec();
        if(!course || !course.lectures){
            throw new Error('Course not found or no lectures available')
        }
        return await this.progressRepository.createProgress(userId, courseId, course.lectures)
    }

    async completeVideo(userId: string, courseId : string, lectureId: string, videoId: string) {
       return await this.progressRepository.markVideoComplete(userId, courseId, lectureId, videoId)
    }

    async markCourseIncomplete (userId: string, courseId: string) {
        return await this.progressRepository.markCourseIncomplete(userId, courseId)
    }

    async markCourseComplete(userId: string, courseId: string) {
        return await this.progressRepository.markCourseComplete(userId, courseId);
    }
}