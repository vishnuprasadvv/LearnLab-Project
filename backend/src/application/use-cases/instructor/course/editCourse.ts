import { ICourses } from "../../../../domain/models/Courses";
import { uploadCourseImageToCloudinary } from "../../../../infrastructure/cloud/cloudinary";
import { CustomError } from "../../../../interfaces/middlewares/errorMiddleWare";
import { ICourseRepository } from "../../../repositories/ICourseRepository";

export class EditCourseUseCase{
    constructor(private courseRepository : ICourseRepository){

    }

    async execute (id: string, data: Partial<ICourses>, courseImage?: Buffer):Promise<ICourses > {
        if(!data){
            throw new CustomError('Data not provided', 400)
        }
        if(!data.category) {
            throw new CustomError('Category not provided', 400)
        }
        if(!data.title){
            throw new CustomError('Title required', 400)
        }

        const findCourse = await this.courseRepository.getCourseById(id)
        if(!findCourse) {
            throw new CustomError('Course not found in database', 404)
        }

        if(data.title){
            const existCourse = await this.courseRepository.getCourseByName(data.title)
            if(existCourse && existCourse._id.toString() !== id){
                
                throw new CustomError('Course with same title already availble', 400)
            }
        }

         // Upload image if provided
         let uploadedImageUrl = findCourse.imageUrl; // Retain the existing image
         let uploadedImagePublicId = findCourse.imagePublicId;
         if (courseImage) {
             const uploadResult = await uploadCourseImageToCloudinary(courseImage);
             if (!uploadResult || !uploadResult.url) {
                 throw new CustomError("Uploading course image failed", 400);
             }
             uploadedImageUrl = uploadResult.secure_url; // Update with new image URL
             uploadedImagePublicId = uploadResult.public_id;
         }

        const updatedData = {
            title: data.title || findCourse.title, // Use new title if provided
            description: data.description || findCourse.description, // Update description if provided
            price: data.price || findCourse.price, // Update price if provided
            imageUrl: uploadedImageUrl, // Update image only if a new file is provided
            category: data.category || findCourse.category,
            imagePublicId : uploadedImagePublicId
        };


        const newCourse = await this.courseRepository.updateCourse(id, updatedData)

        if(!newCourse) {
            throw new CustomError('Course creation failed', 400)
        }
        return newCourse;
    }
}