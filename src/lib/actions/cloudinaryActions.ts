import { v2 as cloudinary } from 'cloudinary';

type UploadResponse = {
    public_id: string;
    url: string;
};

type DeleteResponse = {
    result: string;
};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (filePath: string): Promise<UploadResponse> => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            folder: 'thumbnails',
            resource_type: 'image',
        });
        return { public_id: response.public_id, url: response.secure_url };
    } catch (error) {
        throw new Error('Image upload failed');
    }
};

export const uploadVideo = async (filePath: string): Promise<UploadResponse> => {
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            folder: 'videos',
            resource_type: 'video',
        });
        return { public_id: response.public_id, url: response.secure_url };
    } catch (error) {
        throw new Error('Video upload failed');
    }
};

export const deleteImage = async (publicId: string): Promise<DeleteResponse> => {
    try {
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'image',
        });
        return { result: response.result };
    } catch (error) {
        throw new Error('Image deletion failed');
    }
};

export const deleteVideo = async (publicId: string): Promise<DeleteResponse> => {
    try {
        const response = await cloudinary.uploader.destroy(publicId, {
            resource_type: 'video',
        });
        return { result: response.result };
    } catch (error) {
        throw new Error('Video deletion failed');
    }
};
