import { WishlistRepository } from "../../../infrastructure/repositories/wishlistRepository";

export class GetWishlistCountUseCase {
    constructor(private wishlistRepository: WishlistRepository) {}
    async execute(userId: string) : Promise<string[] | []>{
        return await this.wishlistRepository.getWishlistCourseIds(userId);
    }
}