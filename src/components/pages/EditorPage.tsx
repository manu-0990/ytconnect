"use client";

import { useRouter } from "next/navigation";

export default function EditorPage() {
  const router = useRouter();
  

  return (
    <div>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/add-user')}>Connect creator</button>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/remove-user/editor')}>Dicconnect creator</button>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/home/editor/create-project')}>Create New</button>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/home/pending-projects')}>Pending Projects</button>
      <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/home/history')}>History</button>
    </div>
  );
}
