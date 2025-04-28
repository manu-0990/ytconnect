import { NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import prisma from "@/db";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    if (user.role === "CREATOR") {
      const editors = await prisma.editor.findMany({
        where: { creatorId: user.id },
        include: { user: true },
      });

      return NextResponse.json({ editors }, { status: 200 });
    }

    if (user.role === "EDITOR") {
      const me = await prisma.editor.findUnique({
        where: { id: user.id },
      });

      if (!me) {
        return NextResponse.json(
          { error: "Editor profile missing." },
          { status: 404 }
        );
      }
      if (!me.creatorId) {
        return NextResponse.json(
          { error: "No creator connected to this editor." },
          { status: 404 }
        );
      }
      const creator = await prisma.creator.findUnique({
        where: { id: me.creatorId },
        include: { user: true },
      });

      if (!creator) {
        return NextResponse.json(
          { error: "Creator not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ creator }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid user role." }, { status: 403 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
