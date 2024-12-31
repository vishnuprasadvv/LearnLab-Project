import mongoose from "mongoose";

export interface IWishlist {
    userId : string | mongoose.Types.ObjectId;
    items: [
        {
            courseId: string | mongoose.Types.ObjectId ,
            addedAt: Date,
        }
    ]
}
 interface ICourseDetailsWishlist {
  _id: string | mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  instructor: {
    name: string,
    _id:string,
  }
  imageUrl ?: string,
  category ?: {
    _id:string,
    name:string
  },
  level? : string;
}
export interface IPopulatedWishlist {
  userId: string | mongoose.Types.ObjectId;
  items: {
    courseId: ICourseDetailsWishlist; 
    addedAt: Date;
  }[];
}

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
        required: true,
      },
      addedAt: {
        type: Date,
        default : Date.now,
      }
    },
  ],
});

WishlistSchema.index({ userId: 1 });
export const Wishlist = mongoose.model('Wishlist', WishlistSchema)