"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function RoleSelectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.role) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const selectRole = async (role: "CREATOR" | "EDITOR") => {
    try {
      await axios.post("/api/user/update-role", { role });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error selecting role:", error);
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4 items-center">
      <h2>Select Your Role</h2>
      <button onClick={() => selectRole("EDITOR")}>Editor</button>
      <button onClick={() => selectRole("CREATOR")}>Creator</button>
    </div>
  );
}
