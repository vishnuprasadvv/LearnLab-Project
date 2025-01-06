import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export interface IMetrics {
    totalStudents: number;
    totalCourses: number;
    totalEarnings: number;
  }

export class GetInstructorDashboardMetricsUseCase {
    constructor(private courseRepository: ICourseRepository){}

    async execute(instructorId: string) : Promise<IMetrics> {
        const courses = await this.courseRepository.getAllCourses(instructorId);
        if(!courses) {
            throw new CustomError("No courses found", 404) 
        }
        const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledCount || 0), 0);
        const totalEarnings = courses.reduce((sum, course) => {
            const price = course.price || 0;
            const enrolledCount = course.enrolledCount || 0;
            const earnings = parseFloat((price * 0.9 * enrolledCount).toFixed(2)); // Format each calculation
            return sum + earnings;
          }, 0);
        const totalCourses = courses.length;

        return{
            totalStudents, 
            totalEarnings,
            totalCourses
        }
    }
} 