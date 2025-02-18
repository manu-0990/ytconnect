import { NextResponse } from "next/server";
import { getUser } from "@/lib/utils/get-user";
import { checkReferral } from "@/lib/utils/check-referral";
import prisma from "@/db";

export async function POST(request: Request) {
  try {
    const user = await getUser();

    // Ensure the user is an editor.
    if (user.role !== "EDITOR") {
      return NextResponse.json(
        { error: "Only editors can redeem referral codes." },
        { status: 403 }
      );
    }

    // Check if the editor is already connected to a creator.
    const editorRecord = await prisma.editor.findUnique({
      where: { id: user.id },
    });
    if (editorRecord?.creatorId) {
      return NextResponse.json(
        { error: "You are already connected to a creator." },
        { status: 400 }
      );
    }

    // Check if the user has already redeemed a referral code.
    const existingRedeemedReferral = await prisma.referral.findFirst({
      where: { editorId: user.id },
    });
    if (existingRedeemedReferral) {
      return NextResponse.json(
        { error: "You have already redeemed a referral code." },
        { status: 400 }
      );
    }

    // Parse the referral code from the request body.
    const { code } = await request.json();

    // Validate the referral code. (checkReferral() throws errors on invalid codes.)
    await checkReferral(code);

    // Redeem the referral code by updating it with the editor's ID and setting usedAt.
    const updatedReferral = await prisma.referral.update({
      where: { code },
      data: {
        editorId: user.id,
        usedAt: new Date(),
      },
    });

    // Connect the editor with the creator via upsert.
    await prisma.editor.upsert({
      where: { id: user.id },
      update: { creatorId: updatedReferral.creatorId },
      create: {
        user: { connect: { id: user.id } },
        creator: { connect: { id: updatedReferral.creatorId } },
      },
    });

    return NextResponse.json({
      message: "Referral code redeemed successfully.",
      referral: updatedReferral,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred." },
      { status: 400 }
    );
  }
}
