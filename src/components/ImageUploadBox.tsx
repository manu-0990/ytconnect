import { useRef, useState } from "react";
import { ArrowUpFromLine, X, Check } from "lucide-react";
import { uploadToCloudinary } from "@/lib/utils/cloudinary";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadBoxProps {
  imageLink?: string;
  setImageLink?: (newLink: string) => void;
  selected?: boolean;
  onSelect?: () => void;
  isThumbnailDisabled: boolean;
}

export default function ImageUploadBox({ imageLink, setImageLink, selected, onSelect, isThumbnailDisabled }: ImageUploadBoxProps) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleBoxClick = () => {
    if (imageLink && onSelect) {
      onSelect();
    } else if (fileInputRef.current && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isThumbnailDisabled) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Please select an image under 2MB",
      });
      e.target.value = "";
      return;
    }

    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Uploading ${file.type.split('/')[1]} file not allowed.`,
      });
      return;
    }
    setUploadProgress(0);
    setIsUploading(true);
    try {
      const preset = process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_UPLOAD_PRESET || "";
      const uploadedImageUrl = await uploadToCloudinary(
        file,
        preset,
        (progress: number) => setUploadProgress(progress)
      );
      if (setImageLink) {
        setImageLink(uploadedImageUrl);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload error...",
        description: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isThumbnailDisabled) return;
    if (setImageLink) {
      setImageLink("");
    }
    setUploadProgress(0);
  };

  return (
    <div
      className={`relative w-5/6 h-36 flex items-center justify-center rounded-lg overflow-hidden transition-all duration-200 cursor-pointer
          ${selected ? "border-2 border-rose-500 shadow-lg" : "border-2 border-x-accent"}
      `}
      onClick={handleBoxClick}
    >
      {imageLink ? (
        <div className="w-full h-full relative">
          <img
            src={imageLink}
            alt="Uploaded preview"
            className={`object-cover w-full h-full rounded-lg transition-transform duration-200 ${isThumbnailDisabled && "pointer-events-none"}`}
          />
          {!isThumbnailDisabled && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {selected && (
            <div className="absolute top-2 left-2">
              <Check className="w-6 h-6 text-slate-950 bg-white rounded-full" />
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="w-full h-full flex flex-col items-center justify-center">
            {isThumbnailDisabled ? (
              <span className="text-center text-sm text-gray-400 p-2">
                Uploading not available
              </span>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center hover:bg-slate-700/50 transition-colors">
                <span className="p-5 rounded-full bg-gray-600">
                  <ArrowUpFromLine size={25} />
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isThumbnailDisabled}
          />
        </>
      )}
      {isUploading && (
        <div className="absolute bottom-0 left-0 w-full">
          <Progress value={uploadProgress} />
        </div>
      )}
    </div>
  );
}
