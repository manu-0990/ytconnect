import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";
import { NextRequest, NextResponse } from "next/server";
import { Status, RequestType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({
    where: { email },
    include: { editor: true, creator: true },
  });
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (user.role === "EDITOR") {
    const me = await prisma.editor.findUnique({ where: { id: user.id } });
    if (!me) {
      return NextResponse.json({ error: "Editor profile missing." }, { status: 404 });
    }
    if (me.creatorId) {
      return NextResponse.json(
        { error: "You are already connected to a creator." },
        { status: 400 }
      );
    }

    if (!target.creator) {
      return NextResponse.json(
        { error: "Cannot request; target user is not a creator." },
        { status: 400 }
      );
    }
    const invitation = await prisma.invitation.create({
      data: {
        type: RequestType.REQUEST,
        status: Status.PENDING,
        editor:  { connect: { id: me.id } },
        creator: { connect: { id: target.creator.id } },
      },
    });
    return NextResponse.json(
      { message: "Join request sent.", invitation },
      { status: 200 }
    );
  }

  if (user.role === "CREATOR") {
    const me = await prisma.creator.findUnique({ where: { id: user.id } });
    if (!me) {
      return NextResponse.json({ error: "Creator profile missing." }, { status: 404 });
    }
    if (!target.editor) {
      return NextResponse.json(
        { error: "Cannot invite; target user is not an editor." },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.create({
      data: {
        type: RequestType.INVITE,
        status: Status.PENDING,
        creator: { connect: { id: me.id } },
        editor:  { connect: { id: target.editor.id } },
      },
    });
    return NextResponse.json(
      { message: "Invitation sent.", invitation },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { error: "You are not allowed." },
    { status: 403 }
  );
}
