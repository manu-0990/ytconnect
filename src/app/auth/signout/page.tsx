"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export default function CustomSignOut() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Out</h1>
        <p className="text-center text-gray-600 mb-6">
          Are you sure you want to sign out?
        </p>
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? "Signing out..." : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
