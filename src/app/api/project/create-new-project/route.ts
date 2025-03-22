import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";
import { CreateProjectInput, createProjectWithVideo } from "@/lib/utils/project";
import { NextRequest, NextResponse } from "next/server";

//This function saves the records of a projects in the db
export async function POST(req: NextRequest) {
    try {
        const user = await getUser();
        if (user.role !== "EDITOR") {
            return NextResponse.json(
                { error: "Only editors can create projects." },
                { status: 403 }
            );
        }

        const editorRecord = await prisma.editor.findUnique({
            where: { id: user.id }
        });
        if (!editorRecord || !editorRecord.creatorId) {
            return NextResponse.json(
                { error: "Editor is not connected to a creator." },
                { status: 400 }
            );
        }

        const body = await req.json();

        const { videoLink, thumbnails, title, description } = body.formData;
        if (!videoLink) {
            return NextResponse.json(
                { error: "videoLink is required." },
                { status: 400 }
            )
        }

        const input: CreateProjectInput = {
            videoLink,
            thumbnails,
            title,
            description,
            editorId: user.id,
            creatorId: editorRecord.creatorId,
            status: 'PENDING'
        };

        const { project, video } = await createProjectWithVideo(input);

        return NextResponse.json({
            message: "Project creation successful.",
            project,
            video,
        });
    } catch (error: any) {
        console.error("Error: ", error);
        return NextResponse.json(
            { error: error.message || "An unexpected error occured." },
            { status: 500 }
        );
    }
}