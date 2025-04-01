// 'use client';

// import { ThumbnailUpload } from '@/components/ThumbnailUpload';
// import Button from '@/components/ui/button';
// import { useUpload } from '@/hooks/useUpload';
// import axios from 'axios';
// import { UploadCloudIcon } from 'lucide-react';
// import { ChangeEvent, useState } from 'react';
// import toast, { Toaster } from 'react-hot-toast';

// interface ThumbnailData {
//     url: string;
//     index: number;
// }

// export default function UploadPage() {
//     // Video upload
//     const {
//         url: videoLink,
//         uploading: videoUploading,
//         progress: videoProgress,
//         startUpload: startVideoUpload,
//         reset: resetVideo,
//     } = useUpload();

//     // Thumbnails configuration
//     const [thumbnails, setThumbnails] = useState<Array<{ url: string; index: number }>>([]);
//     const thumbnailCount = 4;
//     const [title, setTitle] = useState('');
//     const [description, setDescription] = useState('');

//     const anyUploading = videoUploading;

//     const handleVideoChange = async (e: ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;

//         // Video size validation
//         if (file.size > 500 * 1024 * 1024) {
//             toast.error('Video file must be 500MB or smaller');
//             e.target.value = '';
//             return;
//         }

//         try {
//             await startVideoUpload(file, process.env.NEXT_PUBLIC_CLOUDINARY_VIDEO_UPLOAD_PRESET!);
//         } catch (error) {
//             toast.error('Video upload failed');
//         }
//     };

//     const handleThumbnailUpload = (url: string, index: number) => {
//         setThumbnails(prev => {
//             const newThumbnails = [...prev];
//             newThumbnails[index] = { url, index };
//             return newThumbnails;
//         });
//     };



//     const handleFinalUpload = () => {
//         if (!title.trim()) {
//             toast.error('Title is required');
//             return;
//         }

//         if (!videoLink) {
//             toast.error('Video file is required');
//             return;
//         }

//         // Prepare for submission
//         const formData = new FormData();
//         formData.append('video', videoLink);
//         formData.append('title', title);
//         formData.append('description', description);
//         thumbnails.forEach((thumb) => {
//             formData.append(`thumbnail_${thumb.index}`, thumb.url);
//         });

//         const result = axios.post('/api/project/create-new-project', { formData: { videoLink, thumbnails, title, description } })
//             .then(res => res.data);
//     };


//     const handleCancel = () => {
//         resetVideo();
//         setTitle('');
//         setDescription('');
//         setThumbnails([]);
//     };

//     return (
//         <div className="flex bg-transparent text-white min-h-screen p-5">
//             <Toaster />

//             <div className="flex-1 px-5">
//                 <h1 className="mb-5 text-2xl font-bold">Upload Your Video & Thumbnails</h1>

//                 <div className="relative border-2 border-dashed border-gray-600 h-48 mb-4 flex items-center justify-center">
//                     {videoLink ? (
//                         <video
//                             src={videoLink}
//                             controls
//                             className="max-w-full max-h-full"
//                         />
//                     ) : (
//                         <label className="flex flex-col items-center justify-center cursor-pointer h-full w-full">
//                             <span className="mb-1"><UploadCloudIcon size={60} className='font-bold opacity-50' /></span>
//                             <span className="mb-1"><div className='font-bold text-lg opacity-50' >Upload Video</div></span>
//                             <input
//                                 type="file"
//                                 accept="video/*"
//                                 onChange={handleVideoChange}
//                                 className="hidden"
//                             />
//                         </label>
//                     )}

//                     {videoUploading && (
//                         <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-1 flex items-center justify-center">
//                             <progress
//                                 value={videoProgress}
//                                 max={100}
//                                 className="w-[90%] h-2 rounded-full"
//                             />
//                         </div>
//                     )}
//                 </div>

//                 <input
//                     type="text"
//                     placeholder="Title"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
//                 />
//                 <textarea
//                     placeholder="Description"
//                     value={description}
//                     onChange={(e) => setDescription(e.target.value)}
//                     className="w-full mb-2 p-2 rounded bg-gray-800 border border-gray-700 focus:outline-none"
//                 />

//                 <div className="flex gap-5">
//                     <Button
//                         variant='large'
//                         onClick={handleFinalUpload}
//                         disabled={anyUploading || !videoLink}
//                         className={`px-4 py-2 rounded ${anyUploading || !videoLink ? 'bg-gray-600 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-200 text-black'}`}
//                     >
//                         Upload
//                     </Button>
//                     <Button
//                         variant='large'
//                         onClick={handleCancel}
//                         className="px-4 py-2 rounded bg-white/5 hover:bg-red-700"
//                     >
//                         Discard
//                     </Button>
//                 </div>
//             </div>

//             <div className="w-52 px-5">
//                 <h2 className="text-xl font-semibold mb-2">Thumbnails</h2>
//                 {Array.from({ length: thumbnailCount }).map((_, index) => (
//                     <ThumbnailUpload
//                         key={index}
//                         index={index}
//                         uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_IMAGE_UPLOAD_PRESET!}
//                         onUploadSuccess={(url) => handleThumbnailUpload(url, index)}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// }