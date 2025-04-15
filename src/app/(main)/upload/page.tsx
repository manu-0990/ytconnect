'use client'

import InputForm from "@/components/InputForm";
import ImageUploadBox from "@/components/ImageUploadBox";
import { Button } from "@/components/ui/button";
import VideoUploader from "@/components/VideoUploader";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface Thumbnail {
  id: number;
  imageLink: string;
}

interface FormState {
  videoUrl: string | null;
  title: string;
  description: string;
  images: Thumbnail[];
}

const DEFAULT_STATE: FormState = {
  videoUrl: null,
  title: "",
  description: "",
  images: [
    { id: 1, imageLink: "" },
    { id: 2, imageLink: "" },
    { id: 3, imageLink: "" },
    { id: 4, imageLink: "" }
  ]
};

export default function UploadPage() {
  const { toast } = useToast();
  const [formState, setFormState] = useState<FormState>(DEFAULT_STATE);
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;

  const setImageLinkById = (id: number, newLink: string) => {
    setFormState(prev => ({
      ...prev,
      images: prev.images.map(img => (img.id === id ? { ...img, imageLink: newLink } : img))
    }));
  };
  const uploadedImages = formState.images.filter(img => img.imageLink !== '');

  async function handleUpload() {
    if (!formState.title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!formState.videoUrl) {
      toast({
        title: 'Error',
        description: 'Video file is required',
        variant: 'destructive'
      });
      return;
    }

    const payload = {
      formData: {
        videoLink: formState.videoUrl,
        thumbnails: uploadedImages,
        title: formState.title,
        description: formState.description,
      },
    };

    try {
      const { data } = await axios.post('/api/project/create-new-project', payload);
      toast({
        title: "Success",
        description: data.message || "Project created successfully.",
      });

      router.push('/home');
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.response?.data.error || error.message || "An unexpected error occurred.",
        variant: 'destructive'
      });
    }
  }

  return (
    <div className="h-full flex-grow pl-32 pr-16 py-14 flex gap-20 items-center">

      <div className="h-full w-2/3 flex flex-col gap-10 justify-between">
        <VideoUploader
          videoLink={formState.videoUrl}
          isUserAllowed={true}
          onUploadComplete={(url: string) =>
            setFormState(prev => ({ ...prev, videoUrl: url }))
          }
          className='max-h-[50dvh]'
        />

        <InputForm
          title={formState.title}
          setTitle={(title) =>
            setFormState(prev => ({ ...prev, title }))
          }
          description={formState.description}
          setDescription={(description) =>
            setFormState(prev => ({ ...prev, description }))
          }
          disabled={user?.role === "CREATOR"}
        />
      </div>

      <div className="h-full w-1/4 rounded-lg flex flex-col items-center gap-4">

        <div className="border-2 w-full rounded-lg flex flex-col justify-between items-center p-6 flex-grow">
          <p className="text-xl font-medium text-left leading-5 w-full">Upload thumbnails</p>

          {formState.images.map((img) => (
            <ImageUploadBox
              key={img.id}
              isThumbnailDisabled={user?.role === "CREATOR"}
              imageLink={img.imageLink}
              setImageLink={(link) => setImageLinkById(img.id, link)}
            />
          ))}
        </div>

        <div className=" w-full pt-2 flex items-center justify-around gap-6">
          <Button onClick={() => (setFormState(DEFAULT_STATE))} className="flex-grow h-12 font-bold text-lg bg-rose-500/90 hover:bg-rose-400/90">Cancel</Button>
          <Button onClick={handleUpload} className="flex-grow h-12 font-bold text-lg">Upload</Button>
        </div>
      </div>
    </div>
  )
}