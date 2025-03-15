"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Modal from "react-modal";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "../ui/button";

interface Editor {
    id: number;
    user: {
        id: number;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

interface RemoveUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
}

export default function RemoveUserModal({ isOpen, onClose, userId }: RemoveUserModalProps) {
    const { data: session } = useSession();
    const router = useRouter();

    const [editors, setEditors] = useState<Editor[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // 1) For CREATOR: Fetch and Remove Editors
    const fetchEditors = async () => {
        try {
            const res = await axios.get("/api/creator/my-editors");
            setEditors(res.data.editors);
        } catch (err: any) {
            console.error("Error fetching editors:", err);
            setError("Failed to fetch editors.");
        }
    };

    const removeEditor = async (editorId: number) => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.post("/api/creator/remove-editors", { editorId });
            if (res.status === 200) {
                toast.success("Editor removed successfully!");
                // Refresh the list
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

    // 2) For EDITOR: Resign
    // Editor must see their creators (Yet to be done)
    const resign = async () => {
        setLoading(true);
        setError("");

        try {
            await axios.post("/api/editor/resign");
            toast.success("Successfully resigned from creator!");
            // Optionally close modal and/or navigate away
            onClose();
            router.push("/home");
        } catch (err: any) {
            const errorMsg = err.response?.data?.error || "An unexpected error occurred.";
            setError(errorMsg);
            toast.error(errorMsg);
            console.error("Error resigning:", err);
        } finally {
            setLoading(false);
        }
    };

    // If user is CREATOR, fetch editors on mount
    useEffect(() => {
        if (session?.user?.role === "CREATOR") {
            fetchEditors();
        }
    }, [session]);

    useEffect(() => {
        Modal.setAppElement("body");
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Remove User Actions"
            className="relative max-w-md w-full bg-[#18181b] p-6 rounded-lg text-white shadow-lg outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
        >
            <Toaster />

            {/* Close (X) Button */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
                <X size={24} />
            </button>

            {/* CREATOR UI */}
            {session?.user?.role === "CREATOR" && (
                <div>
                    <h1 className="mb-7 text-2xl font-semibold">Are you sure?</h1>
                    <p className="py-3 text-lg font-extralight">Are you sure you want to remove {editors.find((editor) => editor.id === userId)?.user?.name?.split(' ')[0]}</p>

                    {error && <p className="text-red-600 mb-4">{error}</p>}
                    {editors.length === 0 && !loading && (
                        <p>No connected editors found.</p>
                    )}
                    <div className="pt-5 flex gap-3 justify-end ">
                        <Button
                            variant="medium"
                            onClick={() => {
                                removeEditor(userId)
                                .then(onClose)
                                toast.success('Mate removed from you team.');
                            }}
                            className="hover:bg-red-700"
                            disabled={loading}
                        >
                            {loading ? "Removing..." : "Remove"}
                        </Button>
                        <Button
                            variant="medium"
                            onClick={onClose}
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                    </div>
                </div>
            )}

            {/* EDITOR UI */}
            {session?.user?.role === "EDITOR" && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Resign from Creator</h1>
                    <button
                        onClick={resign}
                        disabled={loading}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        {loading ? "Processing..." : "Resign from Creator"}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </div>
            )}

            {/* Fallback UI */}
            {!session?.user?.role && (
                <p className="text-white">
                    Role not recognized or user not logged in.
                </p>
            )}
        </Modal>
    );
}
