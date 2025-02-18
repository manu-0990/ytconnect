'use client'

import axios from "axios";
import { useState } from "react";

export default function EditorPage() {
  const [referralCode, setReferralCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await axios.post("/api/referral/redeem", { code: referralCode });
      setMessage(res.data.message);
    } catch (err: any) {
      console.error("Error redeeming code:", err);
      setError(err.response?.data?.error || "An unexpected error occurred.");
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
          className="border p-3 rounded w-full bg-slate-800 font-medium text-xl"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Redeeming..." : "Redeem Code"}
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
