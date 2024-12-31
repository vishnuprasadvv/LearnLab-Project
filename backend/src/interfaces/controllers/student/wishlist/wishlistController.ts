import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../middlewares/errorMiddleWare";
import { WishlistRepository } from "../../../../infrastructure/repositories/wishlistRepository";
import { AddToWishlistUseCase } from "../../../../application/use-cases/student/addToWishlist";
import { RemoveFromWishlistUseCase } from "../../../../application/use-cases/student/removeFromWishlist";
import { GetWishlistUseCase } from "../../../../application/use-cases/student/getWishlist";
import { GetWishlistCountUseCase } from "../../../../application/use-cases/student/wishlistCount";

const wishlistRepository = new WishlistRepository()
const addToWishlistUseCase = new AddToWishlistUseCase(wishlistRepository)
const removeFromWishlistUseCase = new RemoveFromWishlistUseCase(wishlistRepository)
const getWishlistUseCase = new GetWishlistUseCase(wishlistRepository)
const getWishlistCountUseCase = new GetWishlistCountUseCase(wishlistRepository)

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

export const deleteFromWishlistController = async(req:Request, res:Response, next:NextFunction)=> {
try {
    const {courseId} = req.body;
    if(!courseId) throw new CustomError('Course ID not found', 404)
    const user = req.user
if(!user || !user.id) throw new CustomError('User ID is required', 400)
    
    const removedFromWishlist = await removeFromWishlistUseCase.execute(user.id, courseId)
    if(!removedFromWishlist) throw new CustomError('Error removing from wishlist', 400)
        res.status(200).json({success: true, message : 'Course remove from wishlist'})
} catch (error) {
    next(error)
}
}

export const getWishlistController = async(req:Request, res:Response, next:NextFunction)=> {
try {
    const user = req.user
    if(!user || !user.id) throw new CustomError('User ID is required', 400)
    const getWishlist = await getWishlistUseCase.execute(user.id)
    if(!getWishlist) throw new CustomError('Error getting from wishlist', 400)
        res.status(200).json({success: true, message : 'fetching wishlist success' , data: getWishlist})
} catch (error) {
    next(error)
}
}

export const getWishlistCountController = async(req:Request, res:Response, next:NextFunction) => {
    try {
        const {user} = req;
        let wishlistCount:[] | string[] = []
        if(user){
             wishlistCount = await getWishlistCountUseCase.execute(user.id)
        }
        res.status(200).json({success:true, data: wishlistCount})
    } catch (error) {
        next(error)
    }
}
