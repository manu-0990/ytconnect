"use client";

import { signOut } from "next-auth/react";

export default function SignoutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white w-full font-bold py-3 px-4 rounded"
    >
      Sign Out
    </button>
  );
}
