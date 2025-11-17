// lib/auth.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "./prisma";
import { Role } from "@prisma/client";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token, user }) {
            // Lần đầu login, user sẽ có dữ liệu
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email ?? undefined },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.score = dbUser.score;
                }
            }
            // Những lần sau
            else if (token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email as string },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.score = dbUser.score;
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user && token) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
                session.user.score = token.score as number;
            }
            return session;
        },
    },

    // ⭐ Chỉ chạy sau khi PrismaAdapter tạo user xong → an toàn 100%
    events: {
        async createUser({ user }) {
            if (user.email && user.email === process.env.ADMIN_EMAIL) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: "ADMIN" },
                });
            }
        },
    },

    pages: {
        // có thể custom sau
    },
};
