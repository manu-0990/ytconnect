import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { getUser } from "@/lib/utils/get-user";

export async function POST(req: NextRequest) {
  try {
    const { videoUrl, title, description, thumbnail, tags } = await req.json();
    if (!videoUrl || !title) {
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
      refresh_token: account.refresh_token || undefined,
      expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
    });

    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    const videoResponse = await axios.get(videoUrl, { responseType: "stream" });
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
          privacyStatus: "public",
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

    return NextResponse.json({
      message: "Video uploaded successfully!",
      videoResponse: response.data,
    },
      {
        status: 200
      });
  } catch (error: any) {
    console.error("YouTube Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
