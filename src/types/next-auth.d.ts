import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            accessToken?: string;
            refreshToken?: string;
            idToken?: string;
            accessTokenExpires?: number;
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
        refresh_token?: string;  // Add this
        id_token?: string;
        expires_at?: number;  // Add this
    }

    interface JWT {
        accessToken?: string;
        refreshToken?: string;  // Add this
        accessTokenExpires?: number;  // Add this
        idToken?: string;
        role?: 'CREATOR' | 'EDITOR' | null;
    }
}
