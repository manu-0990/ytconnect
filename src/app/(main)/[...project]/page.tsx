"use client"

import { use, useEffect, useState } from "react";
import axios from "axios";
import ImageUploadBox from "@/components/ImageUploadBox";
import InputForm from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import VideoUploader from "@/components/VideoUploader";
import { Loader2, } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import IssueMessage from "@/components/alerts/issueMessage";
import CreateReviewAlert from "@/components/alerts/createReviewAlert";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { YTUploadDataType } from "@/app/api/youtube/upload/route";


interface Thumbnail {
  id: number;
  url: string;
  videoId: number;
}

interface VideoDetails {
  title: string;
  videoLink: string;
  description: string | null;
  id: number;
  editorId: number;
  projectId: number;
  thumbnail: Thumbnail[];
}

interface ReviewType {
  title: string;
  description: string;
}

interface ProjectDetails {
  id: number;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  editorId: number;
  status: "PENDING" | "REVIEW" | "ACCEPTED" | "REJECTED";
  video: VideoDetails;
  reviews: ReviewType;
}

export default function ProjectPage({ params }: { params: Promise<{ project: string[] }> }) {
  const { project } = use(params);
  const projectId = Number(project[1]);

  const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState<string>("");
  const [thumbnails, setThumbnails] = useState<{ id: number; url: string }[]>([]);
  const [issueTitle, setIssueTitle] = useState<string>('');
  const [issueDescription, setIssueDescription] = useState<string>('');
  const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(null);
  const [privacyStatus, setPrivacyStatus] = useState<"public" | "private" | "unlisted">("public");
  const [madeForKids, setMadeForKids] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [status, setStatus] = useState<ProjectDetails["status"]>('PENDING');

  const { toast } = useToast();
  const router = useRouter();

  const session = useSession();
  const user = session.data?.user;

  const isCreatorPending = user?.role === 'CREATOR' && status === 'PENDING';
  const isEditorReview = user?.role === 'EDITOR' && status === 'REVIEW';

  const formDisabled = !isCreatorPending && !isEditorReview;
  const isThumbnailDisabled = user?.role === 'CREATOR' || !isEditorReview;

  // Fetching all the projects data available from db when component mounts first.
  useEffect(() => {
    axios
      .get(`/api/project/get-project-details?projectId=${projectId}`)
      .then((response) => {
        const details = response.data.projectDetails as ProjectDetails;
        setProjectDetails(details);
        setStatus(details.status)
        setTitle(details.video.title);
        setDescription(details.video.description || "");
        setIssueTitle(details.reviews?.title);
        setIssueDescription(details.reviews?.description);
        setVideoLink(details.video.videoLink);
        const fetchedThumbs = details.video.thumbnail.map((t) => ({ id: t.id, url: t.url }));
        const paddedThumbs = Array.from({ length: 4 }, (_, index) => ({
          id: index + 1,
          url: fetchedThumbs[index]?.url || "",
        }));
        setThumbnails(paddedThumbs);
        const initialSelection = paddedThumbs.findIndex((thumb) => thumb.url.trim() !== "");
        setSelectedThumbnail(initialSelection >= 0 ? initialSelection : null);
      })
      .catch((error) => {
        console.error("Error fetching project details", error);
      });
  }, [projectId]);

  console.log(projectDetails);


  // If new thumbnail is uploaded then update them in the local state
  const updateThumbnail = (index: number, newUrl: string) => {
    setThumbnails((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], url: newUrl };
      return copy;
    });

    if (selectedThumbnail === index && newUrl.trim() === "") {
      setSelectedThumbnail(null);
    }
  };

  // If the project is discarded 
  const handleDiscard = async () => {
    try {
      const discardedProject = await axios.patch('/api/project/update-status', { projectId, status: "REJECTED" });
      if (discardedProject.statusText === "OK") {
        toast({
          title: "Discarded",
          description: "Project workspace is now blocked."
        });
      }
      router.refresh();
    } catch (error: any) {
      console.error(error || 'An unexpected error occurred.');
      toast({
        title: "Unknown error",
        description: `${error.message || 'Project could not be discarded.'}`,
        variant: "destructive"
      });
    }
  }

  // Function to save the data in the db updated by the editor in review mode 
  const handleEditorUpload = async () => {
    setIsUploading(true);
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Title is required',
        variant: 'destructive'
      });
      return;
    }

    if (!videoLink) {
      toast({
        title: 'Error',
        description: 'Video file is required',
        variant: 'destructive'
      });
      return;
    }

    const payload = {
      videoId: projectDetails?.video.id,
      videoLink: videoLink,
      thumbnails: thumbnails.filter(img => img.url !== ''),
      title: title,
      description: description,
    };
    console.log('Payload: ', payload);

    try {
      const { data } = await axios.patch('/api/project/update-video-details', {
        videoId: payload.videoId,
        details: {
          title: payload.title,
          description: payload.description,
          videoLink: payload.videoLink,
          thumbnails: payload.thumbnails
        }
      });
      console.log("Updated data: ", data);
      toast({
        title: "Success",
        description: "Project updated successfully.",
      });
      router.push('/home');
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Function to save the data updated by the creator in the db and upload the video on youtube 
  const handleCreatorUpload = async () => {
    const validThumbnails = thumbnails.filter((thumb) => thumb.url.trim() !== "");
    let thumbnailURL = "";
    if (validThumbnails.length > 0) {
      if (selectedThumbnail === null || thumbnails[selectedThumbnail].url.trim() === "") {
        setUploadError("Please select a thumbnail before uploading.");
        return;
      }
      thumbnailURL = thumbnails[selectedThumbnail].url;
    }

    setUploadError("");
    setIsUploading(true);
    try {
      // Update video details via PATCH call.
      await axios.patch("/api/project/update-video-details", {
        videoId: projectDetails?.video.id,
        details: {
          title,
          description,
          videoLink,
          thumbnails: thumbnails.filter((t) => t.url.trim() !== "").map((t) => ({ id: t.id, url: t.url })),
        },
      });

      const YTUploadData: YTUploadDataType = {
        projectId,
        videoLink,
        title,
        description,
        thumbnail: thumbnailURL,
        tags: [],
        privacyStatus,
        madeForKids
      }

      console.log("YTUploadData: ", YTUploadData)

      // Trigger YouTube upload via POST call.
      const YTUploadResult = await axios.post("/api/youtube/upload", { ...YTUploadData });
      if (YTUploadResult.statusText === 'OK') {
        toast({
          title: 'Video uploaded on youtube...',
          duration: 3000
        })
        router.push('/home');
      }

      console.log("Upload process completed successfully.");
    } catch (err: any) {
      setUploadError(err.response?.data?.error || "Upload failed");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  if (!projectDetails) {
    return <div className="flex items-center justify-center h-full w-full">Loading...</div>;
  }

  return (
    <div className="h-full flex-grow pl-32 pr-16 py-14 flex gap-20 items-center">
      {/* Main section: Video and InputForm */}
      <div className={`h-full w-2/3 flex flex-col ${isEditorReview ? 'gap-5' : 'gap-10'} items-end justify-center`}>
        <VideoUploader
          videoLink={videoLink}
          onUploadComplete={(url: string) => setVideoLink(url)}
          poster={selectedThumbnail !== null ? projectDetails.video.thumbnail[selectedThumbnail]?.url : undefined}
          isUserAllowed={isEditorReview}
          className="max-h-[50dvh] rounded-lg"
        />

        {isEditorReview && <IssueMessage
          issueTitle={issueTitle || 'Not specified'}
          issueDescription={issueDescription}
        />}

        <InputForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          disabled={formDisabled}
        />
      </div>

      {/* Thumbnails and Action Buttons */}
      <div className="h-full w-1/4 rounded-lg flex flex-col items-center justify-between gap-4">
        <div className="border-2 max-h-fit w-full rounded-lg flex flex-col justify-start items-center gap-5 px-6 py-5 flex-grow">
          <p className="text-xl font-medium text-left leading-5 w-full">
            Upload thumbnails
          </p>
          {thumbnails.map((thumb, index) => (
            <ImageUploadBox
              key={thumb.id}
              imageLink={thumb.url}
              setImageLink={(newLink) => updateThumbnail(index, newLink)}
              selected={selectedThumbnail === index && thumb.url.trim() !== ""}
              onSelect={() => {
                if (thumb.url.trim() !== "") {
                  setSelectedThumbnail(index);
                }
              }}
              isThumbnailDisabled={isThumbnailDisabled}
            />
          ))}
        </div>

        {isCreatorPending && <div className="h-8 w-full flex gap-5">
          {/* Privacy status selector */}
          <Select onValueChange={(value: "public" | "private" | "unlisted") => setPrivacyStatus(value)}>
            <SelectTrigger className="w-[45%] h-full">
              <SelectValue placeholder="Privacy Status" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>

          {/* Made for kids? */}
          <Select onValueChange={(value: string) => setMadeForKids(value === "true")}>
            <SelectTrigger className="w-[180px] h-full">
              <SelectValue placeholder="Made for Kids?" />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectItem value="true" >Yes, Made for Kids</SelectItem>
              <SelectItem value="false" >Not Made for Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>
        }
        {/* Action buttons */}
        <div className="w-full flex items-center justify-around gap-4">
          {(isCreatorPending || isEditorReview) && <Button
            size="sm"
            className="flex-grow h-11 px-0 to-white font-medium text-lg bg-emerald-400 hover:bg-emerald-500"
            onClick={isEditorReview ? handleEditorUpload : handleCreatorUpload}
            disabled={isUploading && !isCreatorPending && !isEditorReview}
          >
            {isUploading ? <Loader2 className="animate-spin" /> : (isEditorReview ? "Update" : "Upload")}
          </Button>}

          {isCreatorPending &&
            <CreateReviewAlert
              projectId={projectId}
            />}

          {(isCreatorPending || isEditorReview) && <Button
            size="sm"
            variant="secondary"
            onClick={handleDiscard}
            className="flex-grow h-11 p-0 font-medium text-lg hover:bg-rose-500/80"
          >
            Discard
          </Button>}
        </div>
        {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
      </div>
    </div>
  );
}
