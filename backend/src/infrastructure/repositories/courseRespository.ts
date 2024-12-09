import Courses, { ICourses } from "../../domain/models/Courses";
import { ICourseRepository } from "../../application/repositories/ICourseRepository";


export class CourseRepositoryClass implements ICourseRepository{
    async createCourse(data: Partial<ICourses>): Promise<ICourses>{
        const category = new Courses(data);
        return await category.save()
    }
   async getCourseById(id: string) : Promise<ICourses | null>{
        return await Courses.findById(id)
   }

   async getAllCourses() : Promise<ICourses[] | null>{
        return await Courses.find({isDeleted: false}).populate([
            { path: 'instructor', select: '-password -phone -profileImagePublicId' },
            {path: 'category', select: 'name _id'}
        ])
        .sort({createdAt: -1})
   }
   async getCourseByName(title: string) : Promise<ICourses | null> {
    return await Courses.findOne({title})
}
    
}