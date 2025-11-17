// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user?: DefaultSession["user"] & {
            id: string;
            role: Role;
            score: number;
        };
    }

    interface User {
        role: Role;
        score: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        role?: Role;
        score?: number;
    }
}
