import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import { getProjectDetails } from "@/lib/utils/project";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get('projectId');

        if (!projectId) {
            return NextResponse.json({ message: "Project ID is required." }, { status: 400 });
        }

        const [projectDetails, user] = await Promise.all([
            getProjectDetails(Number(projectId)),
            getUser(),
        ]);

        if (!projectDetails) {
            return NextResponse.json({ message: "Project not found." }, { status: 404 });
        }

        if (user.id !== projectDetails.creatorId && user.id !== projectDetails.editorId) {
            return NextResponse.json({ message: "Unauthorized access denied." }, { status: 401 });
        }

        return NextResponse.json({ projectDetails }, { status: 200 });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "An unexpected error occurred, try again later.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}