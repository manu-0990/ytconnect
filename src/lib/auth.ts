import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/db";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export default NextAuth(authOptions);
