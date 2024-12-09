import { ICourses } from "../../../../domain/models/Courses";
import { uploadCourseImageToCloudinary } from "../../../../infrastructure/cloud/cloudinary";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class CreateCourseUseCase{
    constructor(private courseRepository : ICourseRepository){

    }

    async execute (data: Partial<ICourses>, courseImage: Buffer):Promise<ICourses > {
        if(!data){
            throw new CustomError('Data not provided', 400)
        }
        if(!courseImage){
            throw new CustomError('Image not provided', 400)
        }
        if(!data.category) {
            throw new CustomError('Category not provided', 400)
        }
        if(!data.title){
            throw new CustomError('Title required', 400)
        }

        const existCourse = await this.courseRepository.getCourseByName(data.title)

        if(existCourse){
            throw new CustomError('Course with same title already availble', 400)
        }

        //upload image to cloudinary

        const uploadCourseImg = await uploadCourseImageToCloudinary(courseImage)
        if(!uploadCourseImg){
            throw new CustomError('Uploading course image failed', 400)
        }

        const newCourse = await this.courseRepository.createCourse({...data, 
            imagePublicId : uploadCourseImg.public_id,
             imageUrl: uploadCourseImg.secure_url})

        if(!newCourse) {
            throw new CustomError('Course creation failed', 400)
        }
        return newCourse;
    }
}