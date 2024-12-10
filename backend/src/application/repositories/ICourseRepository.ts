import mongoose from "mongoose";
import { ICourses } from "../../domain/models/Courses";

export interface ICourseRepository{

    createCourse (data: Partial<ICourses>) : Promise<ICourses>;

    getCourseById(id: string) : Promise<ICourses | null>

    getCourseByName(title: string) : Promise<ICourses | null>

    getAllCourses() : Promise<ICourses[] | null>

    addLectureToCourse(courseId: string, lectureId: string, options: {session?: mongoose.ClientSession}) : Promise<void> 
}