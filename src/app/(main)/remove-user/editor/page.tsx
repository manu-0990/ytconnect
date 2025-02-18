"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditorResignButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const resign = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/editor", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        // On success, you may redirect or show a success message.
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={resign}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Processing..." : "Resign from Creator"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
