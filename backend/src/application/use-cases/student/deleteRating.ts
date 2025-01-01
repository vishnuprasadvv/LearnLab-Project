import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IRatingRepository } from "../../repositories/IRatingRepository";

export class DeleteRatingUseCase {
    constructor(private ratingRepository: IRatingRepository) {}
    async execute(ratingId:string, userId:string):Promise<void> {
        const existingReview = await this.ratingRepository.findById(ratingId);
        if(!existingReview){
            throw new CustomError('Rating not found', 404);
        }
        if(existingReview.userId.toString() !== userId) {
            console.log(existingReview.userId, userId)
            throw new CustomError('You can only delete your own ratings', 403)
        }

        //delete the rating
        await this.ratingRepository.deleteById(ratingId)
    }
}