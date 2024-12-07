import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/config";
import streamifier from 'streamifier'

cloudinary.config ({
    cloud_name:config.cloudinary.CLOUD_NAME,
    api_key : config.cloudinary.API_KEY,
    api_secret : config.cloudinary.API_SECRET
});


export const uploadToCloudinary = async (fileBuffer:Buffer) => {

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'user_profiles',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload failed:', error);
            return reject(new Error('Failed to upload to Cloudinary'));
          }
          resolve(result);
        }
      );

      // Pipe the file buffer to the upload stream
      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });

    return (result as any)

    } catch (error) {
        console.error('error uploading to cloudinary', error)
        throw new Error('Failed to upload image to Cloudinary')
    }
}

export const deleteFromCloudinary = async(public_id: string) => {
    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return result;
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw new Error('Failed to delete image from Cloudinary');
      }
}