'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react";
import { Input } from "../ui/input";
import useDebouncer from "@/hooks/useDebouncer";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface IssueMessagePropsType {
  projectId: number
}

export default function CreateReviewAlert({ projectId }: IssueMessagePropsType) {

  const [issueTitle, setIssueTitle] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [_error, _setError] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { toast } = useToast();
  const router = useRouter();

  const debouncedSetTitle = useDebouncer(setIssueTitle, 500);
  const debouncedSetDescription = setIssueDescription ? useDebouncer(setIssueDescription, 500) : null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) _setError('');
    setIssueTitle(newValue);
    debouncedSetTitle(newValue);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setIssueDescription(newValue);
    if (debouncedSetDescription) {
      debouncedSetDescription(newValue);
    }
  };

  const handleReview = async () => {
    try {
      if (!issueTitle.trim()) {
        _setError('Title is required...')
        return;
      }

      const discardedProject = await axios.patch('/api/project/update-status', { projectId, status: "REVIEW", reviewData: { title: issueTitle, description: issueDescription } });
      if (discardedProject.statusText === "OK") {
        toast({
          title: "Issue created successfully.",
          duration: 3000
        });
        setIssueTitle('');
        setIssueDescription('');
        setIsOpen(false)
      }

      router.refresh();
      console.log('discardedProject: ', discardedProject);
    } catch (error: any) {
      console.error(error || 'An unexpected error occurred.');
      toast({
        title: "Unknown error",
        description: `${error.message || 'Project could not be discarded.'}`,
        variant: "destructive",
        duration: 3000
      });
    }
  }

  return (
    <AlertDialog open={isOpen}>

      <AlertDialogTrigger>
        <span
          className="px-5 py-2.5 text-lg bg-primary text-black font-medium shadow-sm hover:bg-primary/80 w-auto rounded-md"
          onClick={() => setIsOpen(true)}
        >
          Review
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent className="h-1/3 w-2/5 border flex flex-col">

        <AlertDialogHeader className="grow">
          <AlertDialogTitle>
            <label>
              <Input
                placeholder="Issue title"
                value={issueTitle}
                onChange={handleTitleChange}
                className={`focus-visible:ring-0 focus-visible:outline-none placeholder:text-slate-600 placeholder:text-sm placeholder:font-medium ${_error ? "border-red-500 placeholder: text-red-500" : ""}`}
              />
              <span className="text-xs text-red-500 font-normal">{_error}</span>
            </label>
          </AlertDialogTitle>
          <AlertDialogDescription className="grow">
            <textarea
              placeholder="Add description of your issue"
              className={`border h-full rounded-md w-full p-2 resize-none bg-transparent text-sm text-white placeholder:text-slate-600 placeholder:text-sm focus:outline-none disabled:cursor-not-allowed disabled:text-white/40`}
              value={issueDescription}
              onChange={handleDescriptionChange}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)} >Close</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleReview}
          >Save & Continue</AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  )
}

