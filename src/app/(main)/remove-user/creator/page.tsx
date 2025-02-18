"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

interface Editor {
  id: number;
  user: {
    id: number;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function CreatorDashboard() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchEditors = async () => {
    try {
      const res = await axios.get("/api/user/creator/my-editors");
      setEditors(res.data.editors);
    } catch (err: any) {
      console.error("Error fetching editors:", err);
      setError("Failed to fetch editors.");
    }
  };

  useEffect(() => {
    fetchEditors();
  }, []);

  const removeEditor = async (editorId: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/user/creator", { editorId });
      if (res.status === 200) {
        toast.success("Editor was removed successfully!");
        // Refresh the list after removal
        fetchEditors();
      }
    } catch (err: any) {
      console.error("Error removing editor:", err);
      const errorMsg = err.response?.data?.error || "Error removing editor.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Toaster />
      <h1 className="text-3xl font-bold mb-4">Your Connected Editors</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p>Loading...</p>}
      {editors.length === 0 && <p>No connected editors found.</p>}
      <ul className="space-y-4">
        {editors.map((editor) => (
          <li
            key={editor.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <p className="font-medium">
                {editor.user.name || editor.user.email}
              </p>
            </div>
            <button
              onClick={() => removeEditor(editor.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              disabled={loading}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
