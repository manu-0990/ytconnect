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
import { CircleDot } from "lucide-react"

interface IssueMessagePropsType { 
  issueTitle: string;
  issueDescription?: string;
}

export default function IssueMessage({ issueTitle, issueDescription }: IssueMessagePropsType ) {
  return (
    <AlertDialog>

      <AlertDialogTrigger>
        <span className="flex items-center justify-between gap-2 text-sm bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-7 w-auto py-4 px-4 rounded-md">
          <CircleDot size={17} />Issues
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>{issueTitle}</AlertDialogTitle>
          <AlertDialogDescription>{issueDescription}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  )
}

