"use client";

import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function History() {
  const { data, error } = useSWR("/api/project/history", fetcher);

  if (error) return <div>Error loading projects.</div>;
  if (!data) return <div>Loading...</div>;

  const { projects } = data;

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
                  <br />
                  <p>{project.video.description}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
