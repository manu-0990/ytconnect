import prisma from "@/db";

export async function checkReferral(code: string) {
  if (!code) {
    throw new Error("Referral code is required.");
  }

  // Find the referral record by `code`.
  const referral = await prisma.referral.findUnique({
    where: { code },
  });
  if (!referral) {
    throw new Error("Invalid referral code.");
  }

  // Check if the referral has already been used.
  if (referral.usedAt) {
    throw new Error("Referral code has already been used.");
  }

  // Check if the referral has expired.
  if (referral.expiresAt && referral.expiresAt < new Date()) {
    throw new Error("Referral code has expired.");
  }

  return referral;
}
