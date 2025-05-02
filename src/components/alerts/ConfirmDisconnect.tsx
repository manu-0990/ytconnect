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
import { Role } from "@prisma/client";

export default function ConfirmDisconnect({ role, onRemove, id }: { role: Role, onRemove: (id: number) => void, id: number }) {
  return (
    <AlertDialog>

      <AlertDialogTrigger
        className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full font-semibold transition"
      >
        <span className="flex items-center justify-between gap-2 text-sm bg-transparent text-secondary-foreground shadow-sm h-7 w-auto py-4 px-4 rounded-md">
          {role === Role.CREATOR ? "Leave" : "Remove"}
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent>

        <AlertDialogHeader>
          <AlertDialogTitle>Leaving Already?</AlertDialogTitle>
          <AlertDialogDescription>You won't be able to chat or share files anymore.</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onRemove(id)}
          >
            Yep, Let's Do It</AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  )
}

