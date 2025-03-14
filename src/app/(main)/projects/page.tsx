'use client'

import YTCard from "@/components/ui/ytCard";
import { useState } from "react";

const tabs = [
  { key: 1, label: "All" },
  { key: 2, label: "Pending" },
  { key: 3, label: "Rejected" },
  { key: 4, label: "Accepted" }
];

export default function Projects() {
  const [activeTab, setActiveTab] = useState<string>('All');
  
  return (
    <div className="p-10 h-screen flex flex-col gap-8">

      {/* Tabs section */}
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <div key={tab.key} onClick={() => setActiveTab(`${tab.label}`)} className={`${activeTab === tab.label ? 'bg-slate-500 bg-opacity-50 backdrop-blur-3xl' : "" } bg-transparent px-6 py-1 rounded-full cursor-pointer `} >{tab.label}</div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="overflow-y-auto grid grid-cols-3 gap-5">
        <YTCard imageUrl="https://images.pexels.com/photos/4523001/pexels-photo-4523001.jpeg?auto=compress&cs=tinysrgb&w=600" />
        <YTCard imageUrl="https://images.pexels.com/photos/5912006/pexels-photo-5912006.jpeg?auto=compress&cs=tinysrgb&w=600" />
        <YTCard imageUrl="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600" />
        <YTCard imageUrl="https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&w=600" />
        <YTCard imageUrl="https://images.pexels.com/photos/8801117/pexels-photo-8801117.jpeg?auto=compress&cs=tinysrgb&w=600" />
        <YTCard imageUrl="https://images.pexels.com/photos/8801167/pexels-photo-8801167.jpeg?auto=compress&cs=tinysrgb&w=600" />
        <YTCard imageUrl="https://images.pexels.com/photos/461940/pexels-photo-461940.jpeg?auto=compress&cs=tinysrgb&w=600" />
      </div>
    </div>
  );
}
