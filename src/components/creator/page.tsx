'use client'

import axios from "axios"
import { useState } from "react";

export default function CreatorPage() {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const generateCode = async () => {
    try {
      const res = await axios.post('/api/referral/generate');
      // Ensure you access the correct property from the API response
      setValue(res.data.referral.code || '');
      setCopied(false); // Reset copy state when generating a new code
    } catch (error) {
      console.error("Error generating code:", error);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" text after 2 seconds
  }

  return (
    <div>
      <div>Creator Page</div>

      <button onClick={generateCode} className="border px-6 py-2 mt-5 rounded">
        Generate Code
      </button>
      
      <div className="flex items-center mt-3">
        <input 
          className="bg-slate-800 w-1/5 h-11 p-3 rounded font-medium text-xl text-white" 
          type="text" 
          value={value} 
          readOnly 
        />
        <button 
          onClick={copyToClipboard} 
          className="ml-3 px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
          disabled={!value}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  )
}
