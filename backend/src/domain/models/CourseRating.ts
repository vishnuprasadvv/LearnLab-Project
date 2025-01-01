import mongoose from "mongoose";

export interface ICourseRating {
    courseId: mongoose.Types.ObjectId | string;
    userId: mongoose.Types.ObjectId | string;
    rating: number;
    review?: string | null;
    _id? : string | mongoose.Types.ObjectId;
    createdAt ?: Date;
    updatedAt ?: Date;
}
const CourseRatingSchema = new mongoose.Schema({
    courseId: {type: mongoose.Schema.Types.ObjectId, ref:'Courses', required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    rating : { type: Number, required: true, min:1, max: 5},
    review: {type: String, },
}, {
    timestamps: true
})

export const CourseRating = mongoose.model('CourseRating', CourseRatingSchema)