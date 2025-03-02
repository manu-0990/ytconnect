import prisma from "@/db";
import { uploadImage, uploadVideo } from "@/lib/actions/cloudinaryActions";
import { getUser } from "@/lib/utils/get-user";
import { CreateProjectInput, createProjectWithVideo } from "@/lib/utils/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
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

        // parse the incoming multipart/form-data request
        const formData = await req.formData();
        
        // Retrieve the video and image files if provided
        const videoFile = formData.get("video");
        const thumbnails = formData.getAll("thumbnails");
        const title = formData.get("title")?.toString() || "";
        const description = formData.get("description")?.toString() || "";

        // If no video file found then return
        if (!videoFile) {
            return NextResponse.json(
                { error: 'Video file is required.' },
                { status: 400 }
            )
        }

        const convertToDataURI = async (file: File) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            return `data:${file.type};base64,${buffer.toString('base64')}`;
        }

        const dataURI = await convertToDataURI(videoFile as File);
        const videoUpoadResult = await uploadVideo(dataURI);

        const thumbnailUploadResult = await Promise.all(
            thumbnails.map(async (image) => {
                const dataURI = await convertToDataURI(image as File);
                return await uploadImage(dataURI);
            })
        )

        const input: CreateProjectInput = {
            title,
            description,
            videoLink: videoUpoadResult.url,
            thumbnail: thumbnailUploadResult.length > 0 ? thumbnailUploadResult[0].url : 'demo image',
            editorId: user.id,
            creatorId: editorRecord.creatorId,
            status: 'PENDING'
        };
        const { project, video } = await createProjectWithVideo(input);

        return NextResponse.json(
            { message: 'New Project created.' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Upload error: ', error);
        return NextResponse.json(
            { error: error.message || 'Upload Failed.' },
            { status: 500 }
        );
    }
}