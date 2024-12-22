import { ICourses, ILectureDocument } from "../../../domain/models/Courses";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { ICoursePopulated, ICourseRepository } from "../../repositories/ICourseRepository";
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
    const course:any = await this.courseRepository.getCourseById(courseId);
    if (!course) {
      throw new CustomError("No course available with this id", 404);
    }
    //sort lectures based on lecture order
    course.lectures.sort((a:any,b:any) => a.order - b.order)

    //if the user is the author of the course
    if(userId === course.instructor._id.toString()){
      console.log('user is the author of the course')
      return {course: course, purchased: true}
    }
    
    // Helper function to filter lectures
    const filterLectures = (lectures: ILectureDocument[] | undefined) => {
        return lectures?.sort((a,b)=> a.order - b.order).map((lecture) => ({
          ...lecture,
          videos: lecture.isFree ? lecture.videos : [], // Restrict videos
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

