'use client'

import { ArrowUpFromLine } from 'lucide-react';
import { Input } from './input';
import { useState, useRef, useCallback } from 'react';

export default function VideoUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    const files = e.dataTransfer.files;
    // Process the files as needed
    console.log(files);
  }, []);

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative h-1/2 w-2/3 p-16 rounded-xl flex flex-col items-center justify-around bg-slate-900"
    >
      {isDragging && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <p className="text-white text-xl font-semibold">Release to upload</p>
        </div>
      )}

      <div className="bg-gray-600 p-10 rounded-full">
        <ArrowUpFromLine size={45} />
      </div>

      <div className="flex flex-col items-center font-medium text-right leading-5 text-sm">
        <p className="text-white">Drag and drop video files to upload</p>
        <p className="text-gray-500">Your videos will be private until you publish them.</p>
      </div>

      <label className="bg-slate-200 px-4 p-2 rounded-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-300">
        <span>
          <div className="text-black text-sm">Select Video</div>
        </span>
        <Input type="file" accept="video/*" className="hidden" />
      </label>
    </div>
  );
}
