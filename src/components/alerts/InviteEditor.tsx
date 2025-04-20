"use client";

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
import { Input } from "../ui/input";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface Invitation {
  email: string;
  onInvite: () => void;
}

export default function InviteEditor() {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [resUser, setResUser] = useState<string>('');

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setEmail(newValue);
  };

  const searchUser = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email format",
          variant: "destructive",
          duration: 3000,
        })
        return;
      }
      const response = await axios.get("/api/user/find", { params: { email } });
      if (response.status === 200) {
        setResUser(response.data.username)
      } else {
        setResUser(response.data.message)
      }

    } catch (error: any) {
      toast({
        title: `${error.message || "An unknown error occurred."}`,
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  const inviteUser = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast({
          title: "Invalid email format",
          variant: "destructive",
          duration: 3000,
        })
        return;
      }
      const inviteResponse = await axios.post("src/app/api/user/invite/route.ts", { params: { email } })
      if (inviteResponse.status === 200) {
        toast({
          title: "Request sent.",
          duration: 3000,
        })
      }
    } catch (error: any) {

    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <span
          className={`bg-white hover:bg-white/85 text-black rounded-full h-10 py-4 px-8 text-xl font-semibold tracking-tight`}
          onClick={() => setOpen(true)}
        >
          Add New
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <Input
              placeholder="Enter email"
              onChange={handleChange}
              value={email}
              className="focus-visible:ring-0 focus-visible:outline-none"
            />
          </AlertDialogTitle>
          {resUser && <AlertDialogDescription>{`User: ${resUser}`}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setOpen(false);
              setEmail('');
              setResUser('');
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={resUser ? inviteUser : searchUser}
          >
            {resUser ? "Invite" : "Search"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}


