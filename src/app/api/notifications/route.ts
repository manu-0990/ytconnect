import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/db';
import { getUser } from '@/lib/utils/get-user';

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const readParam = searchParams.get('read');

    const whereClause: any = {
      recipientId: user.id,
    };

    if (readParam === 'true') {
      whereClause.read = true;
    } else if (readParam === 'false') {
      whereClause.read = false;
    }
    const notifications = await prisma.notification.findMany({
      where: {recipientId: user.id},
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      { data: notifications },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications.' },
      { status: 500 }
    );
  }
}