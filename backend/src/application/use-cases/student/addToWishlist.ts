import { WishlistRepository } from "../../../infrastructure/repositories/wishlistRepository";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";

export class AddToWishlistUseCase {
    constructor(private wishlistRepository: WishlistRepository){}
    async execute(userId: string, courseId: string){
        const addedToWishlist = await this.wishlistRepository.addToWishList(userId, courseId)
        if(!addedToWishlist){
            throw new CustomError('Failed add to wishlist',400)
        }
        return addedToWishlist;
    }
}