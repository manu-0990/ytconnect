import { NextResponse } from "next/server";
import prisma from "@/db";
import { getUser } from "@/lib/utils/get-user";

export async function POST(req: Request) {
  try {
    const user = await getUser();

    const body = await req.json();
    const notificationIds = body.notificationIds;

    if (!Array.isArray(notificationIds)) {
      return new NextResponse("Invalid input: 'notificationIds' must be an array.", { status: 400 });
    }

    if (notificationIds.length === 0) {
      return new NextResponse("Invalid input: 'notificationIds' array cannot be empty.", { status: 400 });
    }

    const areAllValidIds = notificationIds.every(id =>
      typeof id === 'number' && Number.isInteger(id) && id > 0
    );

    if (!areAllValidIds) {
      return new NextResponse("Invalid input: 'notificationIds' must contain only positive integers.", { status: 400 });
    }

    const { count } = await prisma.notification.updateMany({
      where: {
        id: {
          in: notificationIds as number[],
        },
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return NextResponse.json({ message: `Successfully marked ${count} notifications as read.` }, { status: 200 });

  } catch (error) {
    console.error("[NOTIFICATIONS_MARK_READ_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}