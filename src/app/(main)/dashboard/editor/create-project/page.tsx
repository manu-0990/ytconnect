"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CreateProjectPage() {
  // State for text fields
  const [formFields, setFormFields] = useState({
    title: "",
    description: "",
  });
  // State for file inputs
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Update text fields state
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Update state for video file
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  // Update state for image files; supports multiple images
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Create a new FormData instance to send files and text fields.
    const data = new FormData();
    data.append("title", formFields.title);
    data.append("description", formFields.description);

    // Video file is required.
    if (videoFile) {
      data.append("video", videoFile);
    } else {
      toast.error("Video file is required");
      setLoading(false);
      return;
    }

    // Append each image file under the key "images"
    imageFiles.forEach((file) => {
      data.append("thumbnails", file);
    });

    try {
      const res = await axios.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        toast.success(res.data.message || "Project created successfully!");
      }
    } catch (err: any) {
      console.error("Error creating project:", err);
      toast.error(
        err.response?.data?.error || "An unexpected error occurred."
      );
      console.log(err.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Create a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formFields.title}
          onChange={handleInputChange}
          className="border p-2 w-full bg-slate-900 rounded"
        />
        {/* Description TextArea */}
        <textarea
          name="description"
          placeholder="Project Description"
          value={formFields.description}
          onChange={handleInputChange}
          className="border p-2 w-full bg-slate-900 rounded"
        ></textarea>
        {/* Video Input (required) */}
        <input
          type="file"
          name="video"
          onChange={handleVideoChange}
          className="border p-2 w-full bg-slate-900 rounded"
          accept="video/*"
        />
        {/* Image Input (optional, multiple allowed) */}
        <input
          type="file"
          name="thumbnails"
          onChange={handleImagesChange}
          className="border p-2 w-full bg-slate-900 rounded"
          accept="image/*"
          multiple
        />
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Creating Project..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
