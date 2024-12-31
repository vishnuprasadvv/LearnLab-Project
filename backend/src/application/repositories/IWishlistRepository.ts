import { IPopulatedWishlist, IWishlist } from "../../domain/models/Wishlist";

export interface IWishlistRepository { 
    getWishlistById(userId: string) : Promise<IPopulatedWishlist| null> ;
    addToWishList(userId: string, courseId: string):Promise<boolean > ;
    removeFromWishList(userId: string, courseId : string) : Promise<boolean> 
    getWishlistByCourseId(userId: string, courseId: string) : Promise<boolean>
    getWishlistCourseIds ( userId: string):Promise<string[] | []>
}