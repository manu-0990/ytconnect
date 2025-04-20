import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import prisma from "@/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (user.role !== "CREATOR") {
      return NextResponse.json(
        { error: "Only creators can remove editors." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const editorId = Number(body.editorId);
    if (isNaN(editorId) || editorId <= 0) {
      return NextResponse.json(
        { error: "Editor ID is required and must be a number." },
        { status: 400 }
      );
    }

    if (!editorId) {
      return NextResponse.json(
        { error: "Editor ID is required." },
        { status: 400 }
      );
    }

    const editorRecord = await prisma.editor.findUnique({
      where: { id: editorId },
    });
    if (!editorRecord || editorRecord.creatorId !== user.id) {
      return NextResponse.json(
        { error: "Editor not found or not connected to you." },
        { status: 400 }
      );
    }

    await prisma.editor.update({
      where: { id: editorId },
      data: { creatorId: null },
    });

    return NextResponse.json({
      status: 200,
      message: "Editor connection removed successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400 }
    );
  }
}
