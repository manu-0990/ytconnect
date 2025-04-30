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

export default function ConfirmUpload() {
  return (
    <AlertDialog>

      <AlertDialogTrigger>
        <span className="flex items-center justify-between gap-2 text-sm bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-7 w-auto py-4 px-4 rounded-md">
          Issues
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to upload?</AlertDialogTitle>
          <AlertDialogDescription>{`The privacy status is set to $privacyStatus and the isMadeForKids`}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  )
}

