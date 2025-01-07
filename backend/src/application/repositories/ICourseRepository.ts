import { Document } from "mongoose";
import { ICourses, ILectureDocument } from "../../domain/models/Courses";
import { IUser } from "../../domain/models/User";
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

  export interface ICoursePopulated extends Document{
      instructor: IUser ,
      title:string,
      description?:string,
      imageUrl ?: string,
      imagePublicId ?: string,
      price?: number,
      isPublished? : boolean,
      category ?: string,
      level?: string,
      _id: string,
      duration? : number,
      isDeleted : boolean,
      lectures?: ILectureDocument[]
  }


export interface ICourseRepository{

    createCourse (data: Partial<ICourses>) : Promise<ICourses>;

    getCourseById(id: string) : Promise<ICourses | null>
    getCourseByIds(id: string[]) : Promise<ICourses[] | null>
    findById(id:string):Promise<ICourses | null> 

    getCourseByName(title: string) : Promise<ICourses | null>

    getAllCourses(userId: string) : Promise<ICourses[] | null>

    addLectures(courseId: string, lectures: any[]): Promise<ICourses | null>

    deleteCourse(courseId: string) : Promise<ICourses | null>

    updateCourse(courseId: string, updateData: Partial<ICourses>): Promise<ICourses | null>

    updateLecture(courseId: string, udpatedlectureData: any[]): Promise<ICourses | null>

    publishCourse(courseId: string, publishValue : boolean) : Promise<ICourses | null>

    //users
    getCourseByIdUser(id: string) : Promise<ICourses | null>
    getCourseByIdsUser(ids: string[]) : Promise<ICourses[] | null>
    getAllCoursesUsers () : Promise<ICourses[] | null >
    getTopRatedCoursesUser(limit:number): Promise<ICourses[]>
    getAllFilteredCoursesUsers (filter:any, sort:any, pagination:any) : Promise<PaginatedResultCourses > 

    //admin
    getAllCoursesAdmin(filter:Filter, sort :any, pagination: Pagination | null) : Promise <PaginatedResultCourses>

    incrementEnrolledCount(courseId: string, incrementBy:number): Promise<void>

    getVideoPublicUrl(courseId: string, videoId: string): Promise<string | null>
    updateRating(course: ICourses ):Promise<void> 

    //admin dashboard
    countAll():Promise<number>
    countPublished(): Promise<number>
    getBestSellingCourses(limit: number):Promise<ICourses[]>
}