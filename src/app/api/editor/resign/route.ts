import { NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import prisma from "@/db";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (user.role !== "EDITOR") {
      return NextResponse.json(
        { error: "Only editors can resign." },
        { status: 403 }
      );
    }

    const editorRecord = await prisma.editor.findUnique({
      where: { id: user.id },
    });

    if (!editorRecord || !editorRecord.creatorId) {
      return NextResponse.json(
        { error: "No active creator connection found." },
        { status: 400 }
      );
    }

    await prisma.editor.update({
      where: { id: user.id },
      data: { creatorId: null },
    });

    await prisma.notification.create({
      data: {
        recipientId: editorRecord.creatorId,
        senderId: editorRecord.id,
        type: "EDITOR_REMOVED",
        message: `${user.name} resigned from your team.`,
      }
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
