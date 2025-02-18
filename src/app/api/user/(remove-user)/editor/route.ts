import { NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import prisma from "@/db";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    // Ensure the user is an editor.
    if (user.role !== "EDITOR") {
      return NextResponse.json(
        { error: "Only editors can resign." },
        { status: 403 }
      );
    }

    // Fetch the editor record
    const editorRecord = await prisma.editor.findUnique({
      where: { id: user.id },
    });

    // Check if the editor is currently connected to a creator.
    if (!editorRecord || !editorRecord.creatorId) {
      return NextResponse.json(
        { error: "No active creator connection found." },
        { status: 400 }
      );
    }

    // Remove the connection by setting creatorId to null.
    await prisma.editor.update({
      where: { id: user.id },
      data: { creatorId: null },
    });

    return NextResponse.json({
      message: "You have successfully resigned from your creator connection.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400 }
    );
  }
}
