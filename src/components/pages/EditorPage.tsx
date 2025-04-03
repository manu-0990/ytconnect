"use client";

import { User } from "next-auth";
import { useRouter } from "next/navigation";

export default function EditorPage({ user }: { user: User }) {
  const router = useRouter();

  return (
    <div className="h-full grow flex items-center justify-center">
      
      <div className="flex gap-3">
        <img src={`${user.image}`} alt="user-image" className="border w-14 h-14 rounded-full" />
        <div className="flex flex-col">
        <span className="text-lg font-bold">{user.name}</span>
        <span className="text-md font-medium opacity-60">{user.email}</span>
        </div>
      </div>
    </div>
  );
}
