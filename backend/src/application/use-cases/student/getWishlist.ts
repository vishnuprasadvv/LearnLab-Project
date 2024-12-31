import { WishlistRepository } from "../../../infrastructure/repositories/wishlistRepository";

export class GetWishlistUseCase {
    constructor(private wishlistRepository : WishlistRepository){}

    async execute(userId: string){
        const userWishlist = await this.wishlistRepository.getWishlistById(userId);
        if(!userWishlist) {
            console.error('Wish not found')
            return []
        };
        return userWishlist.items;
    }
}