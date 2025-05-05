"use client"

import Request from "@/components/alerts/Request";
import AccountCard from "@/components/ui/accountCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  emailVerified: Date | null;
}

interface Editors {
  creatorID: number;
  id: number;
  user: User;
}

interface Creator {
  id: number;
  user: User;
}

export default function Account() {
  const [creator, setCreator] = useState<Creator>();
  const [editors, setEditors] = useState<Editors[]>();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const user = session?.user;

  useEffect(() => {
    async function fetchConnectedUsers() {
      if (status === "loading" || status === "unauthenticated" || !user) {
        return;
      }

      setEditors([]);
      setCreator(undefined);

      try {
        const response = await axios.get("/api/user/connected-with");

        if (user.role === Role.CREATOR) {
          setEditors(response.data.editors || []);
          if (!response.data.editors) {
            console.warn("API did not return 'editors' array for CREATOR.");
          }
        } else if (user.role === Role.EDITOR) {
          setCreator(response.data.creator);
          if (!response.data.creator) {
            console.warn("API did not return 'creator' object for EDITOR.");
          }
        } else {
          console.warn(`Unhandled user role: ${user.role}`);
          toast({
            title: `Cannot display team for role: ${user.role}`,
            variant: "destructive"
          });
        }

      } catch (err: any) {
        console.error("Failed to fetch connected users:", err);
      }
    };

    fetchConnectedUsers();
  }, [status, user, toast]);

  const removeHandler = async (editorId: number) => {
    try {
      const res = user?.role === Role.CREATOR ? (
        await axios.post("/api/creator/remove-editors", { editorId })
      ) : (
        await axios.post("/api/editor/resign")
      );

      if (res.status === 200) {
        toast({
          title: "Success",
          description: res.data.message || "Editor removed successfully."
        });
        setEditors((prev) => prev?.filter((e) => e.user.id !== editorId));
      } else {
        throw new Error(res.data.message || `Request failed with status ${res.status}`);
      }
    } catch (err: any) {
      console.error("Failed to remove editor:", err);
      const axiosError = err as AxiosError<{ error?: string }>;
      const message = axiosError.response?.data?.error || "Failed to remove editor.";
      toast({
        title: "Error Removing Editor",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 items-center justify-center p-7">

      <div className="w-2/5 flex justify-between items-center">
        <span className="text-3xl font-bold capitalize">{`Hi, ${user?.name?.toLowerCase() || 'User'}`}</span>
        <Button
          size="lg"
          variant="default"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut /> Sign out 
        </Button>
      </div>

      <div className="border w-2/5 p-10 rounded-lg flex flex-col justify-between gap-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-5xl font-bold">Team</span>
          <Request userType={user?.role as Role} />
        </div>

        <div className="flex-grow h-full w-full flex flex-col gap-5">
          {creator &&
            <AccountCard
              key={creator.user.id}
              name={`${creator.user.name}`}
              email={`${creator.user.email}`}
              avatarUrl={`${creator.user.image}`}
              id={creator.user.id}
              role={creator.user.role}
              onRemove={() => removeHandler(creator.user.id)}
            />
          }

          {user?.role === Role.CREATOR && (!editors || editors.length === 0) && (
            <div>No Editors Connected</div>
          )}

          {editors && editors.map((editor, index) => (
            <AccountCard
              key={index}
              name={`${editor.user.name}`}
              email={`${editor.user.email}`}
              avatarUrl={`${editor.user.image}`}
              id={editor.id}
              role={editor.user.role}
              onRemove={() => removeHandler(editor.user.id)}
            />
          ))}

          {user?.role === Role.EDITOR && !creator && (
            <div>No Creator Connected</div>
          )}
        </div>
      </div>
    </div>
  )
}
