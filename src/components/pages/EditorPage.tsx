'use client'

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideoCard from "../ui/videoCard";

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState("all");

  const videoData = [
    {
      id: 1,
      link: '',
      imgLink: '',
      title: 'pending',
      status: 'pending',
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      link: '',
      imgLink: '',
      title: 'accepted',
      status: 'accepted',
      lastUpdated: '2 hours ago'
    },
    {
      id: 3,
      link: '',
      imgLink: '',
      title: 'review',
      status: 'review',
      lastUpdated: '2 hours ago'

    },
    {
      id: 4,
      link: '',
      imgLink: '',
      title: 'rejected',
      status: 'rejected',
      lastUpdated: '2 hours ago'
    },
  ]

  // Filter videos: if activeTab is "all", show everything; otherwise, filter by status.
  const filteredVideos = activeTab === "all" ? videoData : videoData.filter((video) => video.status === activeTab);

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
      </TabsList>

      <TabsContent
        forceMount
        value="all"
        className="h-full grid grid-cols-3 gap-10 p-1"
      >
        {filteredVideos.map((video) => (
          <VideoCard
            key={video.id}
            link={video.link}
            title={video.title}
            imgLink={video.imgLink}
            lastUpdated={video.lastUpdated}
          />
        ))}
      </TabsContent>
    </Tabs>
  );
}
