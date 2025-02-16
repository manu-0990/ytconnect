// import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: number | undefined;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            accessToken?: string;
            idToken?: string;
        };
    }

    interface User {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }

    interface Account {
        access_token?: string;
        id_token?: string;
    }

    interface JWT {
        accessToken?: string;
        idToken?: string;
    }
}
