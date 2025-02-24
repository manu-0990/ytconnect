"use client";

import { useRouter } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();
  

  return (
    <div>
      <h1>Editor Page</h1>

      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/add-user')}>Connect creator</button>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/remove-user/editor')}>Dicconnect creator</button>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/dashboard/pending-projects')}>Pending Projects</button>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/dashboard/history')}>History</button>
    </div>
  );
}
