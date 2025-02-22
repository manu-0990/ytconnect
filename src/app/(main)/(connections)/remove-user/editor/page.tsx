"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function EditorResignButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const resign = async () => {
    setLoading(true);
    setError("");

    try {
      await axios.post("/api/editor/resign");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
      console.log("Error: ", err);
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
