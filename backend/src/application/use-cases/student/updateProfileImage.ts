
import { deleteFromCloudinary, uploadToCloudinary } from "../../../infrastructure/cloud/cloudinary";
import { updateUserProfileImage } from "../../../infrastructure/repositories/userRepository";
import { CustomError } from "../../../interfaces/middlewares/errorMiddleWare";
import { UserRepository } from "../../repositories/IUserRepository";

interface UpdateProfileImageParams {
    userId: string, 
    fileBuffer : Buffer
}
export const updateProfileImage = async ({userId, fileBuffer}: UpdateProfileImageParams, userRepository: UserRepository) => {
    if(!fileBuffer) throw new CustomError('No file provided', 400)

       const user = await userRepository.findById(userId);
       if(!user) {
        throw new CustomError('User not found', 400);
       }

       //delete old profile image from cloudinary
       if(user.profileImagePublicId){
        await deleteFromCloudinary(user.profileImagePublicId)
       }

       const uploadedImage = await uploadToCloudinary(fileBuffer);
       console.log('upload image ', uploadedImage) //
       //update user profile with new image 
       user.profileImageUrl = uploadedImage.secure_url;
       user.profileImagePublicId = uploadedImage.public_id;

       console.log(user)

       return user.save()
}