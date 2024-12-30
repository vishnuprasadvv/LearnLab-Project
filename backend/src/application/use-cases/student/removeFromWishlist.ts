import { WishlistRepository } from "../../../infrastructure/repositories/wishlistRepository";

export class AddToWishlistUseCase {
    constructor(private wishlistRepository: WishlistRepository){}
    async execute(userId: string, courseId: string){
        const removeFromWishlist = await this.wishlistRepository.removeFromWishList(userId, courseId)
        if(!removeFromWishlist){
            throw new Error('Failed remove from wishlist')
        }
        return removeFromWishlist;
    }
}