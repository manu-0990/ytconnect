"use client";

import useSWR from "swr";
import axios from "axios";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function CreatorDashboard() {
  const session = useSession();
  const isCreator = session.data?.user.role === "CREATOR";

  const { data, error, mutate } = useSWR( "/api/project/pending-projects", fetcher );

  if (error) return <div>Error loading projects.</div>;
  if (!data) return <div>Loading...</div>;

  const { projects } = data;

  const handleAccept = async (projectId: number) => {
    try {
      const res = await axios.patch("/api/project/update-status", {
        projectid: projectId,
        status: "ACCEPTED",
      });
      mutate();
    } catch (error: any) {
      console.error("Error accepting project:", error.response?.data || error);
    }
  };

  const handleReject = async (projectId: number) => {
    try {
      const res = await axios.patch("/api/project/update-status", {
        projectid: projectId,
        status: "REJECTED",
      });
      mutate();
    } catch (error: any) {
      console.error("Error rejecting project:", error.response?.data || error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Your Pending Projects</h1>
      {projects.length === 0 ? (
        <p>No pending projects found.</p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project: any) => (
            <li key={project.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p>Status: {project.status}</p>
              {project.video && (
                <div className="mt-2">
                  <img
                    src={project.video.thumbnail || project.video.videoLink}
                    alt={project.video.title || "Project Video"}
                    className="w-full max-h-64 object-cover"
                  />
                  <p>{project.video.description}</p>
                </div>
              )}

              {isCreator && (
                <div className="mt-4">
                  <button
                    onClick={() => handleAccept(project.id)}
                    className="py-3 px-6 text-xl rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(project.id)}
                    className="ml-5 py-3 px-6 text-xl rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
