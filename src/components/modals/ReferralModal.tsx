"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";
import { X } from "lucide-react";

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function ReferralPage() {
    const { data: session } = useSession();
    const [role, setRole] = useState<string | null | undefined>(null);
    const [referralCode, setReferralCode] = useState("");
    const [redeemCode, setRedeemCode] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setRole(session.user.role);
        }
    }, [session]);

    const generateReferral = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post("/api/referral/generate");
            setReferralCode(data.referral.code);
            toast.success("Referral code generated successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Error generating referral code!");
        } finally {
            setLoading(false);
        }
    };

    const redeemReferral = async () => {
        setLoading(true);
        try {
            await axios.post("/api/referral/redeem", { code: redeemCode });
            toast.success("Referral code redeemed successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Error redeeming referral code.");
        } finally {
            setLoading(false);
        }
    };

    const copyReferralCode = () => {
        navigator.clipboard
            .writeText(referralCode)
            .then(() => toast.success("Referral code copied to clipboard!"))
            .catch((err) => {
                console.error("Failed to copy!", err);
                toast.error("Failed to copy referral code.");
            });
    };

    if (!session) return <p>Please sign in to access this page.</p>;

    return (
        <div className="max-w-xl mx-auto p-6">
            <Toaster />
            <h1 className="text-2xl font-bold mb-4">Referral</h1>

            {role === "CREATOR" ? (
                <>
                    <p className="mb-2">Generate your referral code to share with editors:</p>
                    <button
                        onClick={generateReferral}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "Generating..." : "Generate Code"}
                    </button>
                    {referralCode && (
                        <div className="mt-4">
                            <label className="block mb-1 font-medium">
                                Your Referral Code:
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={referralCode}
                                    readOnly
                                    className="border p-2 w-full bg-slate-800 rounded font-bold text-xl"
                                />
                                <button
                                    onClick={copyReferralCode}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : role === "EDITOR" ? (
                <>
                    <p className="mb-2">Enter a referral code provided by a creator:</p>
                    <input
                        type="text"
                        value={redeemCode}
                        onChange={(e) => setRedeemCode(e.target.value)}
                        placeholder="Enter referral code"
                        className="border p-2 w-full mb-2 bg-slate-800 text-xl rounded font-bold"
                    />
                    <button
                        onClick={redeemReferral}
                        disabled={loading || !redeemCode.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        {loading ? "Redeeming..." : "Redeem Code"}
                    </button>
                </>
            ) : (
                <p>Your role is not recognized.</p>
            )}
        </div>
    );
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
    useEffect(() => {
        Modal.setAppElement("body");
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Referral Modal"
            className="relative max-w-xl w-full bg-[#18181b] p-6 rounded-lg text-white shadow-lg outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center"
        >
            <button
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
            >
                <X size={24} />
            </button>
            <ReferralPage />
        </Modal>
    );
}
