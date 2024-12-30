import mongoose from "mongoose";
import { IWishlistRepository } from "../../application/repositories/IWishlistRepository";
import { IWishlist, Wishlist } from "../../domain/models/Wishlist";
import { CustomError } from "../../interfaces/middlewares/errorMiddleWare";

export class WishlistRepository implements IWishlistRepository{

    async getWishlistById(userId: string): Promise<IWishlist | null> {
        return await Wishlist.findOne({userId})
    }

    async addToWishList(userId: string, courseId: string): Promise<boolean> {
        const userObjectId = new mongoose.Types.ObjectId(userId);
  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  const wishlist = await Wishlist.findOne({userId, 'items.courseId': courseObjectId})
  if(wishlist) {
    throw new CustomError('Course already added to wishlist', 400)
  }
  console.log(wishlist)
        const updatedWishlist = await Wishlist.updateOne({userId: userObjectId}, {$addToSet:{items:{courseId: courseObjectId}} }, {upsert: true})
        return updatedWishlist.modifiedCount > 0 || updatedWishlist.upsertedCount > 0;
    }

    async removeFromWishList(userId: string, courseId: string): Promise<boolean> {
        const userObjectId = new mongoose.Types.ObjectId(userId);
  const courseObjectId = new mongoose.Types.ObjectId(courseId);
  
  const wishlist = await Wishlist.findOne({userId, 'items.courseId': courseObjectId})
  if(!wishlist) {
    throw new CustomError('Course is not added to wishlist', 400)
  }
        const updatedWishlist = await Wishlist.updateOne(
            {userId:userObjectId},
            { $pull: {items:{courseId:courseObjectId}}}
        )
        return updatedWishlist.modifiedCount > 0;
    }
}