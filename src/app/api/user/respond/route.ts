import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";
import { NextRequest, NextResponse } from "next/server";
import { NotificationType, Role } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const basicUser = await getUser();
    if (!basicUser?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { notificationId, action } = await request.json();

    if (!notificationId || typeof notificationId !== 'number') {
      return NextResponse.json({ error: "Invalid notification ID." }, { status: 400 });
    }
    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json({ error: "Invalid action." }, { status: 400 });
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        sender: {
          include: { creator: true, editor: true }
        },
        recipient: {
          include: { creator: true, editor: true }
        }
      }
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }

    if (notification.recipientId !== basicUser.id) {
      return NextResponse.json({ error: "Forbidden. You are not the recipient of this notification." }, { status: 403 });
    }

    if (notification.type !== NotificationType.EDITOR_INVITE && notification.type !== NotificationType.EDITOR_JOIN_REQUEST) {
      return NextResponse.json({ error: "This notification type cannot be accepted or declined." }, { status: 400 });
    }

    const sender = notification.sender;
    const recipient = notification.recipient;

    if (!sender || !recipient) {
         console.error("Sender or Recipient missing for actionable notification:", notificationId);
         return NextResponse.json({ error: "Internal server error: Missing sender/recipient data." }, { status: 500 });
    }


    if (action === 'accept') {
      let editorId: number;
      let creatorId: number;
      let editorUser: typeof recipient | typeof sender;
      let creatorUser: typeof recipient | typeof sender;

      if (notification.type === NotificationType.EDITOR_INVITE) {
        editorUser = recipient;
        creatorUser = sender;
        editorId = recipient.id;
        creatorId = sender.id;

        if (recipient.role && recipient.role !== Role.EDITOR) {
             return NextResponse.json({ error: `Cannot accept invitation: Recipient ${recipient.name || recipient.email} has role ${recipient.role}.` }, { status: 400 });
        }
         if (!sender.creator || sender.role !== Role.CREATOR) {
             return NextResponse.json({ error: `Cannot accept invitation: Sender ${sender.name || sender.email} is not a Creator.` }, { status: 400 });
         }
         if (recipient.editor?.creatorId && recipient.editor.creatorId !== sender.id) {
             return NextResponse.json({ error: "You are already linked with another creator. Leave their team first to accept this invite." }, { status: 409 });
         }

      } else {
        editorUser = sender;
        creatorUser = recipient;
        editorId = sender.id;
        creatorId = recipient.id;

         if (sender.role && sender.role !== Role.EDITOR) {
             return NextResponse.json({ error: `Cannot accept request: Sender ${sender.name || sender.email} has role ${sender.role}.` }, { status: 400 });
         }
        if (!recipient.creator || recipient.role !== Role.CREATOR) {
             return NextResponse.json({ error: `Cannot accept request: Recipient ${recipient.name || recipient.email} is not a Creator.` }, { status: 400 });
        }
         if (sender.editor?.creatorId && sender.editor.creatorId !== recipient.id) {
             return NextResponse.json({ error: `${sender.name || sender.email} is already linked with another creator.` }, { status: 409 });
         }
      }


      try {
        await prisma.$transaction(async (tx) => {
          await tx.editor.upsert({
            where: { id: editorId },
            update: { creatorId: creatorId },
            create: {
              id: editorId,
              creatorId: creatorId,
            },
          });

          await tx.user.update({
            where: { id: editorId },
            data: { role: Role.EDITOR },
          });
          await tx.user.update({
             where: { id: creatorId },
             data: { role: Role.CREATOR },
          })

          await tx.notification.delete({
            where: { id: notificationId },
          });

          await tx.notification.create({
            data: {
              recipientId: sender.id,
              senderId: recipient.id,
              type: NotificationType.JOIN_ACCEPTED,
              message: `${recipient.name || recipient.email} has accepted your ${notification.type === NotificationType.EDITOR_INVITE ? 'invitation' : 'request'}.`,
            },
          });
        });

        return NextResponse.json({ message: "Accepted successfully!" }, { status: 200 });

      } catch (e: any) {
           console.error("Transaction failed during acceptance:", e);
            if (e.code === 'P2002') {
                 return NextResponse.json({ error: "Failed to link profiles. A potential conflict occurred." }, { status: 409 });
            }
           return NextResponse.json({ error: "Failed to update profiles during acceptance." }, { status: 500 });
      }

    } else {
      try {
           await prisma.$transaction(async (tx) => {
                await tx.notification.delete({
                     where: { id: notificationId },
                });

                await tx.notification.create({
                     data: {
                          recipientId: sender.id,
                          senderId: recipient.id,
                          type: NotificationType.JOIN_REJECTED,
                          message: `${recipient.name || recipient.email} has declined your ${notification.type === NotificationType.EDITOR_INVITE ? 'invitation' : 'request'}.`,
                     },
                });
           });

            return NextResponse.json({ message: "Declined successfully." }, { status: 200 });
      } catch(e) {
          console.error("Transaction failed during decline:", e);
          return NextResponse.json({ error: "Failed to process decline action." }, { status: 500 });
      }
    }

  } catch (error: any) {
    console.error("Error processing notification response:", error);
     if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return NextResponse.json({ error: "Unauthorized: Invalid token." }, { status: 401 });
     }
     if (error instanceof SyntaxError) {
          return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
     }
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}