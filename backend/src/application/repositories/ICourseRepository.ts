import mongoose from "mongoose";
import { ICourses } from "../../domain/models/Courses";

export interface ICourseRepository{

    createCourse (data: Partial<ICourses>) : Promise<ICourses>;

    getCourseById(id: string) : Promise<ICourses | null>

    getCourseByName(title: string) : Promise<ICourses | null>

    getAllCourses() : Promise<ICourses[] | null>

    addLectures(courseId: string, lectures: any[]): Promise<ICourses | null>

    deleteCourse(courseId: string) : Promise<ICourses | null>

    updateCourse(courseId: string, updateData: Partial<ICourses>): Promise<ICourses | null>

    updateLecture(courseId: string, udpatedlectureData: any[]): Promise<ICourses | null>

    publishCourse(courseId: string, publishValue : boolean) : Promise<ICourses | null>
}