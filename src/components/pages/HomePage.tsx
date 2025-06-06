'use client'

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideoCard from "../ui/videoCard";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Notifications from "./Notifications";
import { Role } from "@prisma/client";

interface ProjectData {
  projectId: number;
  imgLink?: string;
  title: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVIEW' | 'REJECTED';
  lastUpdated: string;
}

interface AllProjectData {
  projects: any[];
}

export default function HomePage({ role }: { role: Role }) {
  const [activeTab, setActiveTab] = useState("all");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await axios.get<AllProjectData>('/api/project/all-projects');
        const projectsData = response.data.projects;

        // console.log('Raw projectsData: ', projectsData);

        const mappedProjects: ProjectData[] = projectsData.map((project: any) => ({
          projectId: project.id,
          imgLink: project.video?.thumbnail?.[0]?.url || undefined,
          title: project.video?.title || '',
          status: project.status,
          lastUpdated: project.updatedAt,
        }));

        setProjects(mappedProjects);
      } catch (error: any) {
        console.error("Error fetching projects:", error);
        toast({
          title: 'Error...',
          description: error.message || 'Error getting the projects',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filteredProjects = activeTab === "all" ? projects : projects.filter((video) => video.status.toLowerCase() === activeTab);

  return (
    <Tabs
      defaultValue="all"
      onValueChange={setActiveTab}
      className="w-full h-full flex flex-col px-10"
    >
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="accepted">Accepted</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
        <TabsTrigger value="review">Review</TabsTrigger>
        
        <div className="ml-auto flex gap-10" >
          <Notifications />
          {role === Role.EDITOR && <Button variant='default' onClick={() => router.push('/upload')}><Plus/>Create New</Button>}
          {role === Role.CREATOR && <Button variant='default' onClick={() => router.push('/account')}><Plus/>Add Editor</Button>}
        </div>
      </TabsList>

      <TabsContent
        forceMount
        value="all"
        className="h-full grid grid-cols-3 gap-10 p-1"
      >
        {loading ? (
          <p>Loading...</p>
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((video) => (
            <VideoCard
              key={video.projectId}
              projectId={video.projectId}
              title={video.title}
              imgLink={video.imgLink}
              lastUpdated={video.lastUpdated}
            />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
