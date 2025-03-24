'use client';

import { ChangeEvent } from 'react';
import { useUpload } from '../hooks/useUpload';
import toast from 'react-hot-toast';

interface ThumbnailUploadProps {
    index: number;
    uploadPreset: string;
    onUploadSuccess: (url: string) => void;
}

export const ThumbnailUpload = ({ index, uploadPreset, onUploadSuccess }: ThumbnailUploadProps) => {
    const { url, uploading, progress, startUpload } = useUpload();

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
    
        // Validate file size (2MB = 2 * 1024 * 1024 bytes)
        if (file.size > 2 * 1024 * 1024) {
            toast.error(`Thumbnail ${index + 1} must be 2MB or smaller`);
            e.target.value = ''; // Clear input
            return;
        }
    
        try {
            const uploadedUrl = await startUpload(file, uploadPreset);
            if (uploadedUrl) onUploadSuccess(uploadedUrl);
        } catch (error) {
            toast.error(`Thumbnail ${index + 1} upload failed`);
        }
    };

    return (
        <div className="relative border-2 border-dashed border-gray-600 h-20 mb-4 flex items-center justify-center">
            {url ? (
                <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="max-w-full max-h-full object-cover"
                />
            ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer h-full w-full">
                    <span className="text-2xl">+</span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            )}

            {uploading && (
                <div className="absolute bottom-0 left-0 right-0 p-1">
                    <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gray-50 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
