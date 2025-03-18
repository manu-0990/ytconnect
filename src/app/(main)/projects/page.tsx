'use client'

import YTCard from "@/components/ui/ytCard";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const tabs = [
  { key: 1, label: "All" },
  { key: 2, label: "Pending" },
  { key: 3, label: "Rejected" },
  { key: 4, label: "Accepted" }
];

const demoImage = 'https://res.cloudinary.com/dw118erfr/image/upload/v1741973772/thumbnails/v4dicernfro1stdqitz0.png';

export default function Projects() {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/project/pending-projects');
        setProjects(res.data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = activeTab === "All" ? projects : projects.filter(project => project.status.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="p-10 h-screen flex flex-col gap-8">
      {/* Tabs section */}
      <div className=" px-3 flex gap-6">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.label)}
            className={`px-5 py-1 rounded-full cursor-pointer transition-all ${activeTab === tab.label ? 'bg-slate-500 bg-opacity-50 backdrop-blur-3xl' : 'hover:bg-zinc-700  opacity-80 backdrop-blur-3xl font-medium'}`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {loading && <p>Loading projects...</p>}

      {/* Tab Content */}
      <div className="grid grid-cols-3 gap-5">
        {filteredProjects.map(project => (
          <YTCard
            key={project.id}
            onClick={() => router.push(`/project/${project.video.id}`)}
            imageUrl={project.video.thumbnail === 'demo image' ? demoImage : project.video.thumbnail}
            title={project.video.title || "Untitled"}
          />
        ))}
      </div>
    </div>
  );
}
