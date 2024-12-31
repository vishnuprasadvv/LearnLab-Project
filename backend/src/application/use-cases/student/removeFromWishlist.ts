import { WishlistRepository } from "../../../infrastructure/repositories/wishlistRepository";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

export class RemoveFromWishlistUseCase {
    constructor(private wishlistRepository: WishlistRepository){}
    async execute(userId: string, courseId: string){
        const removeFromWishlist = await this.wishlistRepository.removeFromWishList(userId, courseId)
        if(!removeFromWishlist){
            throw new CustomError('Failed remove from wishlist', 400)
        }
        return removeFromWishlist;
    }
}