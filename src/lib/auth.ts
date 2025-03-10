import NextAuth, { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: "openid email profile https://www.googleapis.com/auth/youtube.upload",
        }
      },
      idToken: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log('Received refresh token:', account.refresh_token);
        console.log('Received access token:', account.access_token);
        return {
          ...token,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
        };
      }
      return token;
    },

    async session({ session }: { session: Session }) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });
        if (user) {
          session.user.role = user.role;
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
