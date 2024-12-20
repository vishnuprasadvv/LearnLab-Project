import { ICourses, ILectureDocument } from "../../../domain/models/Courses";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../repositories/ICourseRepository";
import { IOrderRepository } from "../../repositories/IOrderRepository";

interface IGetCourseByIdStudentProps{
    course: ICourses;
    purchased : boolean
}
export class GetCourseByIdStudentUseCase {
  constructor(
    private courseRepository: ICourseRepository,
    private orderRepository: IOrderRepository
  ) {}
  async execute(
    courseId: string,
    userId: string | null
  ): Promise<IGetCourseByIdStudentProps | null> {
    if (!courseId) {
      throw new CustomError("Course id not found", 404);
    }
    const course = await this.courseRepository.getCourseById(courseId);
    if (!course) {
      throw new CustomError("No course available with this id", 404);
    }
    
    // Helper function to filter lectures
    const filterLectures = (lectures: ILectureDocument[] | undefined) => {
        return lectures?.map((lecture) => ({
          ...lecture, // Ensure plain object conversion
          videos: [], // Restrict videos
        }));
      };
  
      // For not logged-in users
      if (userId === null) {
        const { lectures, ...courseWithoutVideos } = course.toObject();
        const filteredCourses =  {
          ...courseWithoutVideos,
          lectures: filterLectures(lectures),
        } as ICourses
        return {course: filteredCourses, purchased: false}
      }
  
      // Check if user has purchased the course
      const hasPurchased = await this.orderRepository.hasUserPurchasedCourse(
        userId,
        courseId
      );
      console.log(hasPurchased)
      //for users who purchased course
      if (hasPurchased) {
        return {course, purchased: true};
      }
      // for users not purchased the couse
      const { lectures, ...courseWithoutVideos } = course.toObject();
      const filteredCourses =  {
        ...courseWithoutVideos,
        lectures: filterLectures(lectures),
      } as ICourses;

      return {course: filteredCourses, purchased:false}
  }
}
// export class GetCourseByIdStudentUseCase {
//     constructor(private courseRepository: ICourseRepository){

//     }
//     async execute(courseId: string) : Promise<ICourses | null> {
//         if(!courseId){
//             throw new CustomError('Course id not found', 404)
//         }
//         const course = await this.courseRepository.getCourseById(courseId)
//         if(!course) {
//             throw new CustomError('No course available with this id', 404)
//         }
//         return course;
//     }
// }
