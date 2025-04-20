"use client"

import InviteEditor from "@/components/alerts/InviteEditor";
import AccountCard from "@/components/ui/accountCard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Editors {
  user: {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
    role: "EDITOR";
    emailVerified: Date | null;
  }
}

export default function Account() {
  const [editors, setEditors] = useState<Editors[]>();
  const { toast } = useToast();
  const session = useSession();
  const user = session.data?.user;

  useEffect(() => {
    async function getEditor() {
      const editors: Editors[] = await axios.get("/api/creator/my-editors").then(res => res.data.editors);
      setEditors(editors);
    }
    getEditor();
  }, []);

  const removeHandler = async (editorId: number) => {
    const res = await axios.post("/api/creator/remove-editors", { editorId });
    if (res.status === 200)
      toast({
        title: "Editor removed successfully"
      });
  };


  return (
    <div className="w-full h-full flex flex-col gap-6 items-center justify-center p-7">

      <div className="w-2/5">
        <span className="text-3xl font-bold capitalize">{`Hi, ${user?.name?.toLowerCase() || 'User'}`}</span>
      </div>

      <div className="border w-2/5 p-10 rounded-lg flex flex-col justify-between gap-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-5xl font-bold">Team</span>
          <InviteEditor />
        </div>

        <div className="flex-grow h-full w-full flex flex-col gap-5">
          {editors ? (editors.map((editor, index) => (
            <AccountCard
              key={index}
              name={`${editor.user.name}`}
              email={`${editor.user.email}`}
              avatarUrl={`${editor.user.image}`}
              id={editor.user.id}
              onRemove={() => removeHandler(editor.user.id)}
            />
          ))) :
            <div>No editors connected</div>}
        </div>
      </div>
    </div>
  )
}