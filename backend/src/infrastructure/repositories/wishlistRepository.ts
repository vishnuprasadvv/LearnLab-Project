import mongoose from "mongoose";
import { IWishlistRepository } from "../../application/repositories/IWishlistRepository";
import { IPopulatedWishlist, IWishlist, Wishlist } from "../../domain/models/Wishlist";
import { CustomError } from "../../interfaces/middlewares/errorMiddleWare";

export class WishlistRepository implements IWishlistRepository {
  async getWishlistById(userId: string): Promise<IPopulatedWishlist | null> {
    const wishlist = await Wishlist.findOne({ userId }).populate({
      path: 'items.courseId', // Populate the courseId field
      model: 'Courses',      // Reference the Courses model
      select: 'title description price instructor imageUrl category level averageRating ratingsCount', // Select specific fields
      populate: [
        {
          path: 'instructor',
          model: 'User', // Adjust to your instructor model name
          select: 'firstName lastName', // Select fields you need for the instructor
        },
        {
          path: 'category',
          model: 'CourseCategory', // Adjust to your category model name
          select: 'name', // Select fields you need for the category
        },
      ],
    }).sort({'items.addedAt' : -1}).lean()

    if (!wishlist) {
      return null; // Explicitly handle null case
    }
    // Map and ensure the correct structure of the items
  const transformedWishlist: IPopulatedWishlist = {
    userId: wishlist.userId.toString(), // Ensure userId is a string
    items: wishlist.items.map((item: any) => ({
      courseId: {
        _id: item.courseId._id.toString(), // Ensure _id is a string
        title: item.courseId.title,
        description: item.courseId.description,
        price: item.courseId.price,
        instructor: {
          _id: item.courseId.instructor?._id?.toString(),
          name: `${item.courseId.instructor?.firstName} ${item.courseId.instructor?.lastName}`,
        },
        imageUrl: item.courseId.imageUrl,
        category: {
          _id:item.courseId.category?._id?.toString(),
          name: item.courseId.category?.name
        },
        level: item.courseId.level,
        averageRating : item.courseId.averageRating,
        ratingsCount: item.courseId.ratingsCount,
      },
      addedAt: new Date(item.addedAt), // Ensure Date type
    })),
  };

  return transformedWishlist;
  }

  async getWishlistByCourseId(userId: string, courseId: string) : Promise<boolean>{
    const userObjectId = new mongoose.Types.ObjectId(userId)
    const courseObjectId = new mongoose.Types.ObjectId(courseId)
    const wishlist = await Wishlist.findOne({userId:userObjectId, "items.courseId": courseObjectId})
    return wishlist ? true : false;
  }

  async addToWishList(userId: string, courseId: string): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const wishlist = await Wishlist.findOne({
      userId,
      "items.courseId": courseObjectId,
    });
    if (wishlist) {
      throw new CustomError("Course already added to wishlist", 400);
    }
    const updatedWishlist = await Wishlist.updateOne(
      { userId: userObjectId },
      { $addToSet: { items: { courseId: courseObjectId } } },
      { upsert: true }
    );
    return (
      updatedWishlist.modifiedCount > 0 || updatedWishlist.upsertedCount > 0
    );
  }

  async removeFromWishList(userId: string, courseId: string): Promise<boolean> {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    const wishlist = await Wishlist.findOne({
      userId,
      "items.courseId": courseObjectId,
    });
    if (!wishlist) {
      throw new CustomError("Course is not in wishlist", 400);
    }
    const updatedWishlist = await Wishlist.updateOne(
      { userId: userObjectId },
      { $pull: { items: { courseId: courseObjectId } } }
    );
    return updatedWishlist.modifiedCount > 0;
  }

  async getWishlistCourseIds ( userId: string):Promise<string[] | []> {
    const userWishlist = await Wishlist.findOne({userId})
    if(!userWishlist) return [];
    const courseIds =  userWishlist.items.map((item) => item.courseId.toString() ) || [];
    return courseIds;
  }
}
