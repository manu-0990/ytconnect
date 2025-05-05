import { getUser } from "@/lib/utils/get-user";
import { updateVideoDetails } from "@/lib/utils/project";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
    const user = await getUser();
    try {
        const { videoId, details } = await req.json();

        if (!videoId || !details) {
            return NextResponse.json(
                { error: "Required fields cannot be empty." },
                { status: 204 }
            );
        }

        const updatedVideo = await updateVideoDetails(user.id, videoId, details);

        return NextResponse.json({
            message: "Status updated successfully.",
            poject: updatedVideo,
            status: 200
        });
    } catch (error: any) {
        console.error("Error in update-status route:", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occurred." },
            { status: 500 }
        );
    }
}