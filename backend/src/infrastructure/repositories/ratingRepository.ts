import mongoose from "mongoose";
import { IRatingRepository } from "../../application/repositories/IRatingRepository";
import { CourseRating, ICourseRating } from "../../domain/models/CourseRating";

export class RatingRepository implements IRatingRepository{
    async submitRating(rating: ICourseRating): Promise<ICourseRating | null> {
        const newRating = new CourseRating({
            courseId: rating.courseId,
            userId : rating.userId,
            rating : rating.rating,
            review : rating.review
        });
       return (await newRating.save()).populate('userId','firstName lastName role profileImageUrl')
    }

    async getCourseRatings(courseId: string): Promise<ICourseRating[] | null> {
        const ratings = await CourseRating.find({courseId}).populate('userId', 'firstName lastName role profileImageUrl').sort({updatedAt: -1})
        return ratings.map((rating) => ({
            courseId: rating.courseId,
            userId: rating.userId,
            rating: rating.rating,
            review:rating.review,
            createdAt:rating.createdAt,
            updatedAt: rating.updatedAt,
            _id: rating._id
        }));
    }

    async getExistingRating(courseId: string, userId: string):Promise<ICourseRating | null> {
        const courseIdObject = new mongoose.Types.ObjectId(courseId)
        const userIdObject = new mongoose.Types.ObjectId(userId)
        const existRating = await CourseRating.findOne({courseId:courseIdObject, userId:userIdObject});
        return existRating || null;
    }

    async updateRating(rating: ICourseRating): Promise<void> {
        const {_id, ...updateData} = rating
         await CourseRating.findByIdAndUpdate(_id, updateData, {new: true})
    }

    async findById(ratingId:string):Promise<ICourseRating | null> {
        return await CourseRating.findById(ratingId)
    }
    async deleteById(ratingId: string):Promise<void>{
        await CourseRating.findByIdAndDelete(ratingId)
    }
}