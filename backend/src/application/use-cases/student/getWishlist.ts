import { WishlistRepository } from "../../../infrastructure/repositories/wishlistRepository";

export class GetWishlistUseCase {
    constructor(private wishlistRepository : WishlistRepository){}

    async execute(userId: string){
        const userWishlist = await this.wishlistRepository.getWishlistById(userId);
        if(!userWishlist) throw new Error('Wishlist not found');
        return userWishlist.items;
    }
}