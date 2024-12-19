import mongoose from "mongoose";
import { ICourses } from "../../domain/models/Courses";
interface Pagination {
    page: number,
    limit: number
  }
  
  interface Filter {
    [key : string] : any
  }
  
  interface PaginatedResultCourses {
    courses: ICourses[];
    totalCourses: number;
    totalPages : number | null;
  }


export interface ICourseRepository{

    createCourse (data: Partial<ICourses>) : Promise<ICourses>;

    getCourseById(id: string) : Promise<ICourses | null>
    getCourseByIds(id: string[]) : Promise<ICourses[] | null>

    getCourseByName(title: string) : Promise<ICourses | null>

    getAllCourses(userId: string) : Promise<ICourses[] | null>

    addLectures(courseId: string, lectures: any[]): Promise<ICourses | null>

    deleteCourse(courseId: string) : Promise<ICourses | null>

    updateCourse(courseId: string, updateData: Partial<ICourses>): Promise<ICourses | null>

    updateLecture(courseId: string, udpatedlectureData: any[]): Promise<ICourses | null>

    publishCourse(courseId: string, publishValue : boolean) : Promise<ICourses | null>

    //users
    getAllCoursesUsers () : Promise<ICourses[] | null >

    getAllFilteredCoursesUsers (filter:any, sort:any, pagination:any) : Promise<PaginatedResultCourses > 

    //admin
    getAllCoursesAdmin(filter:Filter, sort :any, pagination: Pagination | null) : Promise <PaginatedResultCourses>

}