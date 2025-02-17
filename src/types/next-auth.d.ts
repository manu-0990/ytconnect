// import NextAuth from "next-auth";
import { DefaultSession } from "next-auth"



declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            accessToken?: string;
            idToken?: string;
            role?: 'CREATOR' | 'EDITOR' | null;
        } & DefaultSession["user"];
    }

    interface User {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: 'CREATOR' | 'EDITOR' | null;
    }

    interface Account {
        access_token?: string;
        id_token?: string;
    }

    interface JWT {
        accessToken?: string;
        idToken?: string;
        role?: 'CREATOR' | 'EDITOR' | null;
    }
      
}
