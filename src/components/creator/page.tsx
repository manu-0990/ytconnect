'use client'

import { useRouter } from "next/navigation";

export default function CreatorPage() {
  const router = useRouter();

  return (
    <div>
    <h1>Creator Page</h1>

    <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/add-user')}>Connect editor</button>
    <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/remove-user/creator')}>Dicconnect editor</button>
    <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/dashboard/creator')}>Pending Projects</button>
    <button className="p-2 rounded border ml-5 mt-5" onClick={() => router.push('/dashboard/creator')}>Accepted Projects</button>
  </div>
  )
}
