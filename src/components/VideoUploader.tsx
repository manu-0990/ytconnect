"use client"

import { useState } from "react";
import { ArrowUpFromLine } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface VideoUploaderProps {
  onUploadComplete: (url: string) => void;
  className?: string;
}

export default function VideoUploader({ onUploadComplete, className }: VideoUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const url = await uploadToCloudinary(
        file,
        process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_UPLOAD_PRESET as string,
        (progress: number) => setUploadProgress(progress)
      );

      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded successfully.",
      });
      setVideoUrl(url);
      onUploadComplete(url);
    } catch (err: any) {
      const errorMessage = err.message || "Upload failed";
      setError(errorMessage);

      toast({
        title: "Upload Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (videoUrl) {
    return (
      <div className={`${className} h-1/2 w-full flex items-center justify-center bg-slate-900`}>
        <video
          src={videoUrl}
          controls
          className="h-full w-auto object-cover"
        />
      </div>
    );
  }

  return (
    <div className={`${className} h-1/2 w-full p-16 rounded-xl flex flex-col items-center justify-around bg-slate-900`}>
      <div className="bg-gray-600 p-10 rounded-full">
        <ArrowUpFromLine size={45} />
      </div>

      <div className="flex flex-col items-center font-medium text-right leading-5 text-sm">
        <p className="text-white">Upload and publish a video to get started.</p>
        <p className="text-gray-500">
          Your videos will be private until you publish them.
        </p>
      </div>

      <label className="bg-slate-200 px-4 p-2 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-300">
        <span>
          <div className="text-black text-sm">Upload Video</div>
        </span>
        <Input
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {uploading && (
        <div className="w-full mt-4">
          <p className="text-white text-sm mb-2">Uploading: {uploadProgress}%</p>
          <Progress value={uploadProgress} max={100} />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
