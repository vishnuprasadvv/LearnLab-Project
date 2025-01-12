
import { deleteFromCloudinary, uploadToCloudinary } from "../../../infrastructure/cloud/cloudinary";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { IUserRepository } from "../../repositories/IUserRepository";

interface UpdateProfileImageParams {
    userId: string, 
    fileBuffer : Buffer
}

export class UpdateProfileImageUseCase {
    constructor(private userRepository: IUserRepository) {}
    async execute({userId, fileBuffer}: UpdateProfileImageParams){

        if(!fileBuffer) throw new CustomError('No file provided', 400)

            const user = await this.userRepository.findById(userId);
            if(!user) {
             throw new CustomError('User not found', 400);
            }
     
            //delete old profile image from cloudinary
            if(user.profileImagePublicId){
             await deleteFromCloudinary(user.profileImagePublicId)
            }
     
            const uploadedImage = await uploadToCloudinary(fileBuffer);
            //update user profile with new image 
            user.profileImageUrl = uploadedImage.secure_url;
            user.profileImagePublicId = uploadedImage.public_id;
            const updatedUser = await this.userRepository.update(user)

            if(!updatedUser) {
                throw new CustomError('Failed to update profile image', 400)
            }
            return updatedUser;
    }
}
