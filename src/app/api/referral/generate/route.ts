import { NextResponse } from "next/server";
import prisma from "@/db";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "@/lib/utils/get-user";

export async function POST() {
  const user = await getUser();

  // Ensure the user is a creator.
  if (user.role !== "CREATOR") {
    return NextResponse.json(
      { error: "Only creators can generate referral codes." },
      { status: 403 }
    );
  }

  // Generate a unique referral code.
  const code = uuidv4();
  // Optionally set an expiration date (e.g., valid for 7 days)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Create the referral record in the database.
  const referral = await prisma.referral.create({
    data: {
      code,
      creatorId: user.id,
      expiresAt,
    },
  });

  return NextResponse.json({ referral });
}
