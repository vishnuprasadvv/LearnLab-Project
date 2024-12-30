import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { WishlistRepository } from "../../../../infrastructure/repositories/wishlistRepository";
import { AddToWishlistUseCase } from "../../../../application/use-cases/student/addToWishlist";

const wishlistRepository = new WishlistRepository()
const addToWishlistUseCase = new AddToWishlistUseCase(wishlistRepository)

export const addToWishlistController = async(req:Request, res:Response, next:NextFunction)=> {
try {
    const {courseId} = req.body;
    if(!courseId) throw new CustomError('Course ID not found', 404)
    const user = req.user
if(!user || !user.id) throw new CustomError('User ID is required', 400)
    
    const addedToWishlist = await addToWishlistUseCase.execute(user.id, courseId)
    if(!addedToWishlist) throw new CustomError('Error adding to wishlist', 400)
        res.status(200).json({success: true, message : 'Course added to wishlist'})
} catch (error) {
    next(error)
}
}