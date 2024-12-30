import { IWishlist } from "../../domain/models/Wishlist";

export interface IWishlistRepository { 
    getWishlistById(userId: string) : Promise<IWishlist| null> ;
    addToWishList(userId: string, courseId: string):Promise<boolean > ;
    removeFromWishList(userId: string, courseId : string) : Promise<boolean> 
}