export interface UploadProgressCallback {
    (progress: number): void;
}

export const uploadToCloudinary = async ( file: File, uploadPreset: string, onProgress: UploadProgressCallback): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error('Cloudinary cloud name not configured');

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`);

        xhr.onload = () => {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.secure_url);
            } else {
                reject(new Error(`Upload failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error while uploading'));
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round((event.loaded / event.total) * 100);
                onProgress(percentComplete);
            }
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);

        xhr.send(formData);
    });
};