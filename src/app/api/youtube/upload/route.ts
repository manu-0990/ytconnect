import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { getUser } from "@/lib/utils/get-user";
import { updateProjectStatus } from "@/lib/utils/project";

export interface YTUploadDataType {
  projectId: number;
  videoLink: string;
  title: string;
  description: string;
  thumbnail?: string;
  tags?: string[];
  privacyStatus?: "public" | "private" | "unlisted";
  madeForKids: boolean;
}


//  This function is responsible for uploading a video on youtube 
export async function POST(req: NextRequest) {
  try {
    const { projectId, videoLink, title, description, thumbnail, tags, privacyStatus = 'public', madeForKids = false }: YTUploadDataType = await req.json();
    if (!videoLink || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await getUser();
    if (!user || user.role !== "CREATOR") {
      return NextResponse.json({ error: "Forbidden: Only creators can upload" }, { status: 403 });
    }

    const account = user.accounts.find(a => a.provider === "google" && a.access_token);
    if (!account || !account.access_token) {
      return NextResponse.json({ message: "Access token not found." }, { status: 400 });
    }

    const oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: account.access_token,
      refresh_token: account.refresh_token,
      expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const videoResponse = await axios.get(videoLink, { responseType: "stream" });
    const videoStream = videoResponse.data;

    const response = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: "22",
        },
        status: {
          privacyStatus,
          selfDeclaredMadeForKids: madeForKids
        },
      },
      media: {
        body: videoStream,
      },
    });

    const videoId = response.data.id;

    if (videoId && thumbnail) {
      const imageResponse = await axios.get(thumbnail, { responseType: 'stream' });

      await youtube.thumbnails.set({
        videoId,
        media: {
          body: imageResponse.data,
        },
      });
    }
    
    if (response.statusText === "OK") {
      let retries = 3;
      while (retries > 0) {
      try {
        await updateProjectStatus(projectId, "ACCEPTED");
        break;
      } catch (err: any) {
        retries--;
        console.error("Error updating project status, retries left:", retries, err);
        if (retries === 0) {
        return NextResponse.json({ error: "Video uploaded, but error updating project status after multiple attempts" }, { status: 500 });
        }
      }
      }
    }

    return NextResponse.json(
      {
        message: "Video uploaded successfully!",
        videoResponse: response.data,
      },
      { status: 200 });
  } catch (error: any) {
    console.error("YouTube Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
