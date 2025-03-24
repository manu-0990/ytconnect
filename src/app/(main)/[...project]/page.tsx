'use client'
import ReviewMessage from "@/components/modals/ReviewMessageModal";
import Button from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import ImageRadioGroup from "@/components/ui/radioThumbnail";
import axios from "axios";
import { CircleArrowDown, CircleArrowUp, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

// Helper function to format an ISO date string into a human-readable format.
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();

    function getOrdinal(n: number): string {
        if (n >= 11 && n <= 13) return `${n}th`;
        switch (n % 10) {
            case 1: return `${n}st`;
            case 2: return `${n}nd`;
            case 3: return `${n}rd`;
            default: return `${n}th`;
        }
    }

    return `${dayName}, ${getOrdinal(day)} ${month} ${year}`;
}

interface Video {
    description: string;
    editorId: number;
    id: number;
    projectId: number;
    thumbnail: Thumbnail[];
    title?: string;
    videoLink: string;
}

interface Thumbnail {
    id: number;
    url: string;
}

interface ProjectDetails {
    createdAt: string;
    creatorId: number;
    editorId: number;
    id: number;
    status: "ACCEPTED" | "REJECTED" | "PENDING" | "REVIEW";
    updatedAt: string;
    video: Video;
    videoId: number;
}

export default function VideoDetails({ params }: { params: Promise<{ project: string[] }> }) {
    const { project } = use(params);
    const projectId = Number(project[1]);

    const [selectedThumbnailId, setSelectedThumbnailId] = useState<number>(1);
    const [projectDetails, setProjectDetails] = useState<ProjectDetails | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState<string>("");
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
    const [privacyStatus, setPrivacyStatus] = useState<string>('Privacy Status');
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isCreator, setIsCreator] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const user = useSession();

    useEffect(() => {
        if (user.status === "loading") return;
        if (!user.data) {
            router.push('/');
        } else if (user.data.user?.role === "CREATOR") {
            setIsCreator(true);
        }
    }, [user, router]);

    // Adjust the textarea height based on content and whether it's expanded
    const adjustTextareaHeight = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            if (isDescriptionExpanded) {
                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
            } else {
                textAreaRef.current.style.height = '96px';
            }
        }
    };

    useEffect(() => {
        async function fetchProjectDetails() {
            try {
                const res = await axios.get(`/api/project/get-project-details?projectId=${projectId}`);
                setProjectDetails(res.data.projectDetails);
            } catch (err: any) {
                console.error(err.message || "Error fetching project details");
            }
        }
        fetchProjectDetails();
    }, [projectId]);

    useEffect(() => {
        if (projectDetails) {
            setTitle(projectDetails.video.title || "");
            setDescription(projectDetails.video.description || "");
            if (projectDetails.video.thumbnail && projectDetails.video.thumbnail.length > 0) {
                setSelectedThumbnailId(projectDetails.video.thumbnail[0].id);
            }
        }
    }, [projectDetails]);

    useEffect(() => {
        adjustTextareaHeight();
    }, [description, isDescriptionExpanded]);

    // Prepare thumbnails for the ImageRadioGroup
    const videoThumbnails = projectDetails?.video.thumbnail && projectDetails.video.thumbnail.length > 0
        ? projectDetails.video.thumbnail.map((thumb) => ({
            id: thumb.id,
            src: thumb.url,
        }))
        : [{ id: 0, src: "https://res.cloudinary.com/dw118erfr/image/upload/v1741973772/thumbnails/v4dicernfro1stdqitz0.png" }];

    // Get the URL for the selected thumbnail
    const selectedThumbnailUrl = projectDetails?.video.thumbnail.find(t => t.id === selectedThumbnailId)?.url || "";

    const handleSave = async () => {
        if (!projectDetails) return;
        if (!title.trim()) return toast.error('Title cannot be empty')
        setIsLoading(true);
        try {
            const response = await axios.patch('/api/project/update-video-details', {
                videoId: projectDetails.videoId,
                details: { description, title }
            });
            console.log('Video details updated:', response.data);
        } catch (error) {
            console.error('Error updating video details:', error);
        }
        setIsLoading(false);
    };

    const handleUpload = async () => {
        try {
            setIsUploading(true);
            if (projectDetails?.video.title !== title || projectDetails.video.description !== description) {
                await handleSave();
            }
            if (!projectDetails) {
                toast.error("Uploading failed.");
                console.error("Project details not found.");
                return;
            }
            const response = await axios.post('/api/youtube/upload', {
                projectId: projectDetails.id,
                videoLink: projectDetails.video.videoLink,
                title: title,
                description: description,
                thumbnail: selectedThumbnailUrl,
                privacyStatus: privacyStatus === 'Privacy Status' ? 'public' : privacyStatus
            });
            toast.success('Uploading successful.');
            console.log(response.data);
        } catch (error: any) {
            toast.error("Uploading failed.");
            console.error(error.message || 'Unexpected error occurred');
        } finally {
            setIsUploading(false);
        }
    };

    const handleReject = async () => {
        try {
            const rejectRes = await axios.patch('/api/project/update-status', { projectId, status: 'REJECTED' });
            if (rejectRes.status === 200) {
                toast.success("Project rejected successfully.");
                router.push('/projects');
            } else {
                toast.error("Failed to reject the project.");
            }
        } catch (error: any) {
            console.error("Error rejecting project:", error.message || error);
            toast.error("An error occurred while rejecting the project.");
        }
    }

    return (
        <div className="w-full p-10 flex flex-col gap-3">
            <Toaster />
            {/* Date header */}
            <div className=" text-xl font-semibold font-sans">
                {projectDetails ? formatDate(projectDetails.createdAt) : "Loading date..."}
            </div>

            {/* Whole container */}
            <div className="w-full flex items-start gap-4">

                {/* Video part */}
                <div className="w-4/5 p-2 pt-0 flex flex-col">
                    <div className="relative border border-slate-600 cursor-pointer rounded-lg min-h-[70vh] max-h-[70vh] flex items-center justify-center">
                        {projectDetails ? (
                            <video
                                controls
                                poster={selectedThumbnailUrl}
                                className="absolute max-h-[80vh] h-full"
                            >
                                <source src={projectDetails.video.videoLink} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : ("Loading video...")}
                    </div>

                    <div>
                        {projectDetails ? (
                            <input
                                disabled={!isEditing}
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className={`h-14 text-xl font-medium w-full mt-2 rounded-md p-2 bg-transparent outline-none ${!isEditing ? 'cursor-not-allowed opacity-70' : 'cursor-text border border-slate-600'}`}
                                placeholder="Enter title..."
                            />
                        ) : ("Loading title...")}

                        {/* Description textarea with dynamic height */}
                        <div className="py-3 flex flex-col">
                            {projectDetails ? (
                                <textarea
                                    disabled={!isEditing}
                                    ref={textAreaRef}
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(e.target.value);
                                        adjustTextareaHeight();
                                    }}
                                    className={`w-full p-1 text-md tracking-tight leading-7 bg-neutral-700 rounded outline-none transition-all duration-300 resize-none overflow-hidden ${!isEditing ? 'cursor-not-allowed opacity-70' : 'cursor-text '}`}
                                    placeholder="Enter description..."
                                />
                            ) : ("Loading description...")}
                            <div
                                className="mt-2 self-center cursor-pointer"
                                onClick={() => setIsDescriptionExpanded(prev => !prev)}
                                children={isDescriptionExpanded ? <CircleArrowUp /> : <CircleArrowDown />}
                            />
                        </div>
                    </div>
                </div>

                {/* Thumbnail part */}
                {projectDetails && isCreator && !['ACCEPTED', 'REJECTED', 'REVIEW'].includes(projectDetails.status)
                    || (projectDetails && !['ACCEPTED', 'REJECTED'].includes(projectDetails.status) && !isCreator) && (
                        <div className="border border-gray-600 bg-[#212121] rounded-lg w-1/5 p-2 flex flex-col gap-2 h-auto">
                            <h3 className="text-xl font-sans font-medium">Thumbnails</h3>
                            <ImageRadioGroup
                                images={videoThumbnails}
                                selectedThumbnailId={selectedThumbnailId}
                                onChange={(id) => id !== 0 && setSelectedThumbnailId(id)}
                            />
                        </div>
                    )}

            </div>

            {/* Buttons container */}
            {(projectDetails && !['ACCEPTED', 'REJECTED', 'REVIEW'].includes(projectDetails.status) && isCreator)
                || (projectDetails && !['ACCEPTED', 'REJECTED'].includes(projectDetails.status) && !isCreator)
                ? <div className="h-20 p-3 flex gap-5">
                    <Button variant="large" onClick={() => setIsEditing(bool => !bool)} className="bg-yellow-500 hover:bg-yellow-600" >Edit</Button>
                    <Button variant="large" disabled={isLoading} onClick={handleSave} className="bg-sky-500 hover:bg-sky-600"
                    >
                        {isLoading ? "saving.." : "Save"}
                    </Button>
                    {isCreator &&
                        <>
                            <Button variant="large" onClick={handleUpload} className="bg-emerald-500 hover:bg-emerald-600" >
                                {isUploading ? (
                                    <span className="flex items-center">
                                        <Loader2 className="animate-spin mr-2" size={20} />
                                        Uploading...
                                    </span>
                                ) : "Upload"}
                            </Button>
                            <Button variant="large" onClick={() => (setIsOpen(true))} className="bg-slate-50 hover:bg-slate-200 text-black" >Review</Button>
                            <Button variant="large" onClick={handleReject} className="hover:bg-red-600" >Decline</Button>
                        </>
                    }
                    {!isCreator && <Button variant="large">Submit</Button>}

                    {isCreator && <Dropdown defaultName="Privacy Status" items={['unlisted', 'private', 'public']} selectedItem={privacyStatus} onChange={val => setPrivacyStatus(val)} />}
                </div>
                : null
            }

            <ReviewMessage projectId={projectId} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </div>
    );
}
