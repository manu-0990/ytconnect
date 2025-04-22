import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/db";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const invites = await prisma.invitation.findMany({
    where: { email: session.user.email },
    orderBy: { sentAt: 'desc' },
  });

  return NextResponse.json(invites);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, action } = await request.json() as { id: number; action: 'accept' | 'decline' };
  const status = action === 'accept' ? 'ACCEPTED' : 'REJECTED';

  try {
    const updated = await prisma.invitation.update({
      where: { id },
      data: { status, respondedAt: new Date() },
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error('Prisma update error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}