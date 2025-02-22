import { NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import prisma from "@/db";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    // Ensure the user is a creator.
    if (user.role !== "CREATOR") {
      return NextResponse.json(
        { error: "Only creators can remove editors." },
        { status: 403 }
      );
    }

    // Parse the editorId from the request body.
    const { editorId } = await request.json();
    if (!editorId) {
      return NextResponse.json(
        { error: "Editor ID is required." },
        { status: 400 }
      );
    }

    // Check that the specified editor is connected to the creator.
    const editorRecord = await prisma.editor.findUnique({
      where: { id: editorId },
    });
    if (!editorRecord || editorRecord.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Editor not found or not connected to you." },
        { status: 400 }
      );
    }

    // Remove the connection by setting creatorId to null in the editor table.
    await prisma.editor.update({
      where: { id: editorId },
      data: { creatorId: null },
    });

    //  update the referral record to indicate the connection is removed.
    await prisma.referral.deleteMany({
      where: {
        editorId: editorRecord.id,
        creatorId: user.id,
      },
    });


    return NextResponse.json({
      message: "Editor connection removed successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400 }
    );
  }
}
