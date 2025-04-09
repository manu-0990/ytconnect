'use client'

import InputForm from "@/components/InputForm";
import ThumbnailUploader from "@/components/ThumbnailUploader";
import VideoUploader from "@/components/VideoUploader";
import { useEffect, useState } from "react";

// import Button from "@/components/ui/button";
// import YTCard from "@/components/ui/ytCard";
// import axios from "axios";
// import { PlusIcon } from "lucide-react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// const tabs = [
//   { key: 1, label: "All" },
//   { key: 2, label: "Pending" },
//   { key: 3, label: "Review" },
//   { key: 4, label: "Accepted" },
//   { key: 5, label: "Rejected" },
// ];

// const demoImage = 'https://res.cloudinary.com/dw118erfr/image/upload/v1741973772/thumbnails/v4dicernfro1stdqitz0.png';

// export default function Projects() {
//   const [activeTab, setActiveTab] = useState<string>('All');
//   const [projects, setProjects] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);

//   const user = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         const res = await axios.get('/api/project/all-projects');
//         setProjects(res.data.projects);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   const filteredProjects = activeTab === "All" ? projects : projects.filter(project => project.status.toLowerCase() === activeTab.toLowerCase());

//   return (
//     <div className="p-10 h-screen flex flex-col gap-8">
//       {/* Tabs section */}
//       <div className="flex justify-between">

//         <div className="px-3 flex gap-6">
//         {tabs.map((tab) => (
//           <div
//             key={tab.key}
//             onClick={() => setActiveTab(tab.label)}
//             className={`px-6 py-2 rounded-full cursor-pointer transition-all ${activeTab === tab.label ? 'bg-slate-500 bg-opacity-40 backdrop-blur-3xl' : 'hover:bg-zinc-700  opacity-80 backdrop-blur-3xl font-medium'}`}
//           >
//             {tab.label}
//           </div>
//         ))}
//         </div>

//         {user.data?.user.role === 'EDITOR' && <Button variant="medium" onClick={() => router.push('/upload-page')} className="bg-zinc-50 hover:bg-zinc-200 text-black" ><PlusIcon />Create New</Button>
//         }
//       </div>

//       {loading && <p>Loading projects...</p>}

//       {/* Tab Content */}
//       <div className="grid grid-cols-3 gap-5">
//         {filteredProjects.length > 0 ? filteredProjects.map(project => (
//           <YTCard
//             key={project.id}
//             onClick={() => router.push(`/project/${project.id}`)}
//             imageUrl={!project.video.thumbnail[0].url ? demoImage : project.video.thumbnail[0].url}
//             title={project.video.title || "Untitled"}
//           />
//         )) : <div>No existing projects found...</div>}
//       </div>
//     </div>
//   );
// }

export default function UploadPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([
    { id: 1, imageLink: '' },
    { id: 2, imageLink: '' },
    { id: 3, imageLink: '' },
    { id: 4, imageLink: '' }
  ]);

  const setImageLinkById = (id: number, newLink: string) => {
    setImages(prev =>
      prev.map(img => (img.id === id ? { ...img, imageLink: newLink } : img))
    );
  };

  const handleSave = () => {
    const uploadedImages = images.filter(img => img.imageLink !== '');
    console.log('Uploaded thumbnails', uploadedImages);
    // Now, you can send `uploadedImages` to your DB or API.
  };

  return (
    <div className="h-full flex-grow pl-32 pr-16 py-14 flex gap-28 items-center justify-between">
      <div className="h-full w-2/3 flex flex-col gap-10 justify-between">
        <VideoUploader onUploadComplete={(url: string) => setVideoUrl(url)} className='max-h-[50dvh]' />
        <InputForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />
      </div>

      <div className="border-2 h-full w-1/4 rounded-lg flex flex-col justify-between items-end p-6">
        <p className="text-2xl font-medium text-left leading-5 w-full">Upload thumbnails</p>
        {images.map((img) => (
          <ThumbnailUploader
            key={img.id}
            imageLink={img.imageLink}
            setImageLink={(link) => setImageLinkById(img.id, link)}
          />
        ))}

        {/* <button
          type="button"
          onClick={handleSave}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Thumbnails
        </button> */}
      </div>

    </div>
  )
}