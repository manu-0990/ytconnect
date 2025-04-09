import { useState } from 'react';
import { Input } from './ui/input';
import useDebouncer from '@/hooks/useDebouncer';

interface InputFormProps {
  title: string;
  setTitle: (titleVal: string) => void;
  description?: string;
  setDescription?: (descriptionVal: string) => void;
}

export default function InputForm({
  title,
  setTitle,
  description,
  setDescription,
}: InputFormProps) {
  // Local state for immediate UI updates.
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description || '');

  // Create debounced versions of the parent update functions.
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
        />
      </div>

      <div className="border border-white/50 p-4 flex-grow rounded-xl">
        <label className="block text-base font-medium text-slate-400">
          Description
        </label>
        <textarea
          placeholder="Add description of your video"
          className="h-24 w-full resize-none bg-transparent text-white placeholder:text-slate-600 placeholder:text-lg focus:outline-none"
          value={localDescription}
          onChange={handleDescriptionChange}
        />
      </div>
    </div>
  );
}
