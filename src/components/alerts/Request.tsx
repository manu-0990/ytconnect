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
import { Role } from "@prisma/client";

export default function Request({ userType }: { userType: Role }) {
  const [open, setOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [resUser, setResUser] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setResUser("");
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

      const response = await axios.get(`/api/user/find?email=${email.toLowerCase()}`);
      if (response.status === 200) {
        setResUser(response.data.username);
      } else {
        setResUser("");
      }
    } catch (error: any) {
      setError(error.response.data.error);
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
      const inviteResponse = await axios.post(`/api/user/request?email=${email}`);
      if (inviteResponse.status === 201) {
        toast({
          title: "Request sent.",
          duration: 3000,
        })
      }
      setResUser('');
      setEmail('');
    } catch (error: any) {
      toast({
        title: `${error.response?.data?.error || error.message || "An unknown error occurred."}`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setOpen(false);
      setEmail("");
      setError("");
      setResUser("");
    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger>
        <span
          className={`bg-white hover:bg-white/85 text-black rounded-full h-10 py-4 px-8 text-xl font-semibold tracking-tight`}
          onClick={() => setOpen(true)}
        >
          {userType === Role.CREATOR ? "Add New" : "Join a Creator"}
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
          <AlertDialogDescription className={`${error ? "text-red-500" : "text-muted-foreground"}`}>{resUser ? (`User: ${resUser}`) : (error)}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setOpen(false);
              setEmail("");
              setResUser("");
              setError("");
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={resUser ? inviteUser : searchUser}
          >
            {resUser ? (userType === "CREATOR" ? "Invite" : "Join") : "Search"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}


