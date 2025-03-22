import { uploadToCloudinary } from '@/lib/utils/cloudinary';
import { useState, useCallback } from 'react';

interface UploadState {
    file: File | null;
    url: string;
    uploading: boolean;
    progress: number;
}

export const useUpload = () => {
    const [uploadState, setUploadState] = useState<UploadState>({
        file: null,
        url: '',
        uploading: false,
        progress: 0,
    });

    const startUpload = useCallback(async (file: File, uploadPreset: string) => {
        setUploadState({
            file,
            url: '',
            uploading: true,
            progress: 0,
        });

        try {
            const url = await uploadToCloudinary(
                file,
                uploadPreset,
                (progress) => setUploadState((prev) => ({ ...prev, progress }))
            );

            setUploadState({
                file,
                url,
                uploading: false,
                progress: 100,
            });

            return url;
        } catch (error) {
            setUploadState((prev) => ({
                ...prev,
                uploading: false,
            }));
            throw error;
        }
    }, []);

    const reset = useCallback(() => {
        setUploadState({
            file: null,
            url: '',
            uploading: false,
            progress: 0,
        });
    }, []);

    return {
        ...uploadState,
        startUpload,
        reset,
    };
};
