'use client'

import Button from "@/components/ui/button";
import axios from "axios";
import { Plus, Trash2, User, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import ReferralModal from "@/components/modals/ReferralModal";
import { useSession } from "next-auth/react";
import RemoveUserModal from "@/components/modals/RemoveUserModal";

interface User {
    image: string | null;
    id: number;
    name: string | null;
    role: "CREATOR" | "EDITOR" | null;
    email: string;
    emailVerified: Date | null;
}

interface EditorWithUser {
    id: number;
    creatorId: number | null;
    user: User;
}

export default function Team() {

    const [editors, setEditors] = useState<EditorWithUser[]>([]);
    const [userId, setUserId] = useState(Number);
    const [loading, setLoading] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);

    const session = useSession();

    useEffect(() => {
        if (session.status === "unauthenticated" || session.data?.user.role !== "CREATOR") {
            return;
        }

        (async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/creator/my-editors');
                setEditors(res.data.editors);
            } catch (error: any) {
                console.error('Error fetching editors: ', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [session.status, session.data]);

    return (
        <div className="h-full flex flex-col gap-5 p-10">
            <div className="flex items-center justify-between p-3 border-b">
                <h3 className="text-3xl tracking-tight font-sans font-medium">Your Team</h3>
                <Button 
                    onClick={() => setIsAddModalOpen(true)} 
                    variant="large" 
                    className="flex gap-3"
                >
                    <Plus /> Add New Mate
                </Button>
            </div>

            {loading && <div>Loading editor details...</div>}

            <div className="py-10 px-3">
                {editors.length === 0 ? (
                    <div className="text-2xl tracking-tight font-sans font-medium">
                        No editor data found...
                    </div>
                ) : editors.map((editor) => (
                    <div key={editor.id} className="border border-zinc-600 rounded-lg flex items-center justify-between mb-5 w-1/2 p-3 gap-5">
                        <div className="rounded-full w-20 h-20 overflow-hidden">
                            {editor.user.image ? (
                                <img src={editor.user.image} className="h-full w-full object-fill object-center" />
                            ) : (
                                <UserCircle2 className="h-full w-full" />
                            )}
                        </div>

                        <div className="grow h-full">
                            <h3>{editor.user.name || 'Unknown'}</h3>
                            <h4>{editor.user.email}</h4>
                        </div>

                        <div>
                            <Button 
                                onClick={() => {
                                    setIsRemoveModalOpen(true);
                                    setUserId(editor.id)
                                }}
                                variant="large" 
                                className="flex justify-between gap-2 hover:bg-rose-600"
                            >
                                <Trash2 />Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Render the modal */}
            <ReferralModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
            <RemoveUserModal isOpen={isRemoveModalOpen} onClose={() => setIsRemoveModalOpen(false)} userId={userId} />
        </div>
    )
}
