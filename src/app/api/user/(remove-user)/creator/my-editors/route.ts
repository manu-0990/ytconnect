import { NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import prisma from "@/db";

export async function GET() {
  try {
    const user = await getUser();
    
    // Ensure the user is a creator.
    if (user.role !== "CREATOR") {
      return NextResponse.json(
        { error: "Only creators can access this endpoint." },
        { status: 403 }
      );
    }

    // Fetch all editors connected to the creator.
    const editors = await prisma.editor.findMany({
      where: { creatorId: user.id },
      include: { user: true } // to get editor's details
    });

    return NextResponse.json({ editors });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400 }
    );
  }
}
