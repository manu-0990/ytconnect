import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (user.role !== "CREATOR") {
    return NextResponse.json(
      { error: "Only creators can remove editors." },
      { status: 403 }
    );
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json(
      { error: "Email is required." },
      { status: 400 }
    );
  }
  
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User with the provided email does not exist." },
        { status: 400 }
      );
    }

    const existingEditor = await prisma.editor.findUnique({
      where: { id: existingUser.id },
    });

    if (existingEditor) {
      return NextResponse.json(
        { error: "This user is already an editor." },
        { status: 400 }
      );
    }

    // Create an invitation for the editor
    const invitation = await prisma.invitation.create({
      data: {
        email,
        creatorId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Editor invitation sent successfully.", invitation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error inviting editor:", error);
    return NextResponse.json(
      { error: "An error occurred while inviting the editor." },
      { status: 500 }
    );
  }
}