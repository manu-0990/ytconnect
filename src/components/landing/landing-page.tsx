'use client'

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function LandingPage() {
  const session = useSession();

  return (
    <div className="flex items-center justify-center gap-10">
      <div>landing-page</div>
      <hr />
      {!session.data?.user.accessToken && (
        <button onClick={() => redirect("/api/auth/signin")} className="border px-6 py-2 mt-5 rounded">Login</button>
      )}
    </div>
  );
}
