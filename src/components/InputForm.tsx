"use client";

import { useState } from 'react';
import { Input } from './ui/input';
import useDebouncer from '@/hooks/useDebouncer';

interface InputFormProps {
  title: string;
  setTitle: (titleVal: string) => void;
  description?: string;
  setDescription?: (descriptionVal: string) => void;
  disabled: boolean;
}

export default function InputForm({
  title,
  setTitle,
  description,
  setDescription,
  disabled
}: InputFormProps) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description || '');

  const debouncedSetTitle = useDebouncer(setTitle, 500);
  const debouncedSetDescription = setDescription ? useDebouncer(setDescription, 500) : null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalTitle(newValue);
    debouncedSetTitle(newValue);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalDescription(newValue);
    if (debouncedSetDescription) {
      debouncedSetDescription(newValue);
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col gap-4">

      <div className="border border-white/50 p-4 rounded-xl">
        <label className="block text-sm font-medium text-slate-400">
          Title (Required)
        </label>
        <Input
          type="text"
          placeholder="Enter the title here"
          className="w-full placeholder:text-slate-600 placeholder:text-lg border-0 focus-visible:ring-0 focus-visible:outline-none pl-0"
          value={localTitle}
          onChange={handleTitleChange}
          disabled={disabled}
        />
      </div>

      <div className="border border-white/50 p-4 flex-grow rounded-xl">
        <label className="block text-sm font-medium text-slate-400">
          Description
        </label>
        <textarea
          placeholder="Add description of your video"
          className={`h-[90%] w-full py-2 resize-none bg-transparent text-sm text-white placeholder:text-slate-600 placeholder:text-sm focus:outline-none disabled:cursor-not-allowed disabled:text-white/40`}
          value={localDescription}
          onChange={handleDescriptionChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
