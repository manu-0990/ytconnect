// /api/referral/redeem/route.ts
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

    // Parse the referral code from the request body.
    const { code } = await request.json();

    // Check the referral code using the utility function.
    await checkReferral(code);

    // Mark the referral as redeemed by updating it with the editor's ID and setting usedAt.
    const updatedReferral = await prisma.referral.update({
      where: { code },
      data: {
        editorId: user.id,
        usedAt: new Date(),
      },
    });

    // Ensure that the Creator record exists for the referral's creator.
    await prisma.creator.upsert({
      where: { id: updatedReferral.creatorId },
      update: {},
      create: {
        // Connect the creator record to the corresponding User.
        user: { connect: { id: updatedReferral.creatorId } },
      },
    });

    // Upsert the Editor record for the current user to connect it to the creator.
    await prisma.editor.upsert({
      where: { id: user.id },
      update: { creatorId: updatedReferral.creatorId },
      create: {
        // Connect the Editor to the current User.
        user: { connect: { id: user.id } },
        // Also connect the Editor to the Creator.
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
