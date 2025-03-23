"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "react-modal";
import axios from "axios";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";

interface ReviewMessageProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewMessage({ projectId, isOpen, onClose }: ReviewMessageProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  async function handleFixRequest() {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      await axios.patch("/api/project/update-status", {
        projectId,
        status: "REVIEW",
        reviewData: { title, description },
      });
      router.push('/projects');
      onClose();
    } catch (err: any) {
      console.error("Error in handleFixRequest:", err);
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Request Fix Modal"
      className="relative max-w-xl w-full bg-[#18181b] p-8 rounded-lg text-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
    >
      {/* Close (X) Button */}
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-200">
        <X size={24} />
      </button>

      {session?.user?.role === "CREATOR" ? (
        <div>
          <label className="block text-lg mt-1 opacity-80 font-medium text-gray-200">Add a title *</label>
          <input
            type="text"
            placeholder={error ? error : "Title"}
            className={`mt-1 w-full p-2 rounded-md bg-white/5 focus:ring-1 focus:ring-gray-500 outline-none ${error ? "border border-red-600" : ""}`}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

          <label className="block text-lg mt-4 opacity-80 font-medium text-gray-200">Add a description</label>
          <textarea
            name="review-message"
            placeholder="Description"
            className="h-28 w-full p-3 mt-1 rounded-md bg-white/5 focus:ring-1 focus:ring-gray-500 focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="pt-5 flex gap-3 justify-end items-center">
            <Button variant="medium" onClick={handleFixRequest} className="hover:bg-gray-100 hover:text-black">
              Request Fix
            </Button>
            <Button variant="medium" onClick={onClose} className="hover:bg-teal-700">
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">You do not have permission to request a fix.</div>
      )}
    </Modal>
  );
}
