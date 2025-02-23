"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

export default function ReferralPage() {
  const { data: session } = useSession();
  const [role, setRole] = useState<string | null | undefined>(null);
  const [referralCode, setReferralCode] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Set the user's role from the session.
  useEffect(() => {
    if (session && session.user) {
      setRole(session.user.role);
    }
  }, [session]);

  // For creators: Generate a referral code.
  const generateReferral = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/referral/generate");
      setReferralCode(res.data.referral.code);
      toast.success("Referral code generated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Error generating referral code!");
    } finally {
      setLoading(false);
    }
  };

  // For editors: Redeem a referral code.
  const redeemReferral = async () => {
    try {
      setLoading(true);
      await axios.post("/api/referral/redeem", {
        code: redeemCode,
      });
      toast.success("Referral code redeemed successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Error redeeming referral code.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <p>Please sign in to access this page.</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Referral</h1>

      {role === "CREATOR" ? (
        <>
          <p className="mb-2">
            Generate your referral code to share with editors:
          </p>
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
              <input
                type="text"
                value={referralCode}
                readOnly
                className="border p-2 w-full bg-slate-800 rounded font-bold text-xl"
              />
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
