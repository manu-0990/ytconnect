import { NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await request.json();
  if (!role || (role !== "CREATOR" && role !== "EDITOR")) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Update the user's role in the database
  await prisma.user.update({
    where: { email: session.user.email },
    data: { role },
  });

  return NextResponse.json({ message: "Role updated successfully" });
}
