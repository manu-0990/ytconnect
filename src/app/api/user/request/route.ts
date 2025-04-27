import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";
import { NextRequest, NextResponse } from "next/server";
import { NotificationType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const basicUser = await getUser();
    if (!basicUser || !basicUser.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: basicUser.id },
      include: {
        editor: true,
        creator: true,
      },
    });

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
      include: {
        editor: true,
        creator: true,
      },
    });

    if (!target) {
      return NextResponse.json({ error: "User with that email not found." }, { status: 404 });
    }

    if (user.id === target.id) {
      return NextResponse.json({ error: "You cannot send an invitation or request to yourself." },
        { status: 400 }
      );
    }

    let notificationType: NotificationType;
    let message: string;
    let senderIsCreator = !!user.creator;
    let senderIsEditor = !!user.editor;
    let targetIsCreator = !!target.creator;
    let targetIsEditor = !!target.editor;

    if (senderIsCreator) {
      if (targetIsCreator) {
        return NextResponse.json({ error: "Cannot invite another Creator." }, { status: 400 });
      }
      if (targetIsEditor && target.editor?.creatorId === user.id) {
        return NextResponse.json({ error: `${target.name || target.email} is already part of your team.` },
          { status: 409 }
        );
      }
      if (targetIsEditor && target.editor?.creatorId && target.editor.creatorId !== user.id) {
          return NextResponse.json({ error: `${target.name || target.email} is already linked with another creator.` },
            { status: 409 }
          );
      }

      notificationType = NotificationType.EDITOR_INVITE;
      message = `${user.name || user.email} has invited you to join their team as an Editor.`;

    } else if (senderIsEditor) {
       if (!targetIsCreator) {
         return NextResponse.json({ error: "You can only request to join a Creator." }, { status: 400 });
       }
       if (user.editor?.creatorId === target.id) {
         return NextResponse.json({ error: "You are already part of this Creator's team." }, { status: 409 });
       }
       if (user.editor?.creatorId && user.editor.creatorId !== target.id) {
          return NextResponse.json(
            { error: "You are already linked with another creator. Leave their team first." },
            { status: 409 }
          );
       }

       notificationType = NotificationType.EDITOR_JOIN_REQUEST;
       message = `${user.name || user.email} has requested to join your team as an Editor.`;

    } else {
      return NextResponse.json({ error: "You must be a Creator or Editor to send invitations or requests." },
        { status: 403 }
      );
    }

    const existingNotification = await prisma.notification.findFirst({
      where: {
        read: false,
        type: {
          in: [NotificationType.EDITOR_INVITE, NotificationType.EDITOR_JOIN_REQUEST],
        },
        OR: [
          { senderId: user.id, recipientId: target.id },
          { senderId: target.id, recipientId: user.id },
        ],
      },
    });

    if (existingNotification) {
      const existingType = existingNotification.type === NotificationType.EDITOR_INVITE ? 'invitation' : 'request';
      const direction = existingNotification.senderId === user.id ? 'You have already sent' : 'There is already a pending';
      return NextResponse.json(
        { error: `${direction} an ${existingType} involving ${target.name || target.email}. Please wait for a response.` },
        { status: 409 }
      );
    }

    const invitation = await prisma.notification.create({
      data: {
        recipientId: target.id,
        senderId: user.id,
        type: notificationType,
        message: message,
      },
    });

    const successMessage = notificationType === NotificationType.EDITOR_INVITE ? "Invitation sent successfully." : "Join request sent successfully.";
    return NextResponse.json(
      { message: successMessage, notification: invitation },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error processing invitation/request:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}