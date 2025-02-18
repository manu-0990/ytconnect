"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const [referralCode, setReferralCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const redeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!referralCode.trim()) {
      setError("Please enter a referral code.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/referral/redeem", {
        code: referralCode,
      });
      if (res.status === 200) {
        setMessage(res.data.message);
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Error redeeming code:", err);
      if (err.response?.status === 403) {
        setError("You are not authorized to redeem this code.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || "Invalid referral code.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Redeem Referral Code</h1>
      <form onSubmit={redeemCode} className="flex flex-col gap-4">
        <input
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Enter referral code"
          className="border p-3 rounded w-full bg-slate-800 font-medium text-xl text-white"
        />
        <button
          type="submit"
          disabled={loading || !referralCode.trim()}
          className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Redeeming..." : "Redeem Code"}
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
