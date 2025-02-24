"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CreateProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoLink: "",
    thumbnail: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/project/create-new-project", formData);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (err: any) {
      console.error("Error creating project:", err);
      toast.error(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Create a New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-2 w-full bg-slate-900 rounded"
        />
        <textarea
          name="description"
          placeholder="Project Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full bg-slate-900 rounded"
        ></textarea>
        <input
          type="url"
          name="videoLink"
          placeholder="Video Link"
          value={formData.videoLink}
          onChange={handleChange}
          className="border p-2 w-full bg-slate-900 rounded"
        />
        <input
          type="url"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={formData.thumbnail}
          onChange={handleChange}
          className="border p-2 w-full bg-slate-900 rounded"
        />
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
