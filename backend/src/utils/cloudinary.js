import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'

export const uploadOnCloudinary = async function (filePath){

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View Credentials' below to copy your API secret
    });
    
    // Upload an image
     const uploadResponse = await cloudinary.uploader
       .upload(
           filePath, {
            resource_type: "image",
            quality: "auto:good", 
            width: 800, 
            height: 800, 
            crop: "limit", 
            aspect_ratio: "1:1", 
            eager: [
                { width: 800, height: 800, crop: "limit", quality: "auto:good" }
            ]
        }
       )
       .catch((error) => {
           throw new ApiError(400,"Error in uploading file") ;
       });
     
       //Unlink or Remove image from locally saved temp folder
       fs.unlinkSync(filePath)
       return uploadResponse
    
};