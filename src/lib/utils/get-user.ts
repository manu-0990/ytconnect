// lib/utils/get-user.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/db";

export async function getUser() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
