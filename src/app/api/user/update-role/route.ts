import { NextResponse } from "next/server";
import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    const { role } = await request.json();
    if (!role || (role !== "CREATOR" && role !== "EDITOR")) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update the user's role in the database
    await prisma.user.update({
      where: { email: user.email },
      data: { role },
    });

    if (role === "CREATOR") {
      await prisma.creator.create({
        data: { id: user.id },
      });
    } else if (role === "EDITOR") {
      await prisma.editor.upsert({
        where: { id: user.id },
        update: {},
        create: { id: user.id },
      });
    }

    return NextResponse.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
