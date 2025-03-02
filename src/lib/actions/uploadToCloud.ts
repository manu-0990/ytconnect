import axios from "axios";

export async function uploadFileToCloudinary(
  file: File,
  resourceType: "video" | "image"
) {
  // Cloudinary settings: use environment variables for production.
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "your_unsigned_preset";

  // Cloudinary's upload endpoint
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

  // Set folder based on file type.
  // Videos will be stored in "video" folder and images in "thumbnails".
  const folder = resourceType === "video" ? "video" : "thumbnails";

  // Create FormData to send the file and configuration.
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  // If it's a video, explicitly tell Cloudinary the resource type.
  if (resourceType === "video") {
    formData.append("resource_type", "video");
  }

  try {
    const response = await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed");
  }
}
