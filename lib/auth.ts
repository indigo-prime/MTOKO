// lib/auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./db";
import db from "@/lib/db";
import { schema } from "@/lib/schema";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const validated = schema.parse(credentials);
                const user = await db.user.findFirst({
                    where: {
                        email: validated.email,
                        password: validated.password, // Ideally, hashed comparison
                    },
                });

                if (!user) {
                    throw new Error("Invalid credentials");
                }

                return user;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token, user }) {
            if (session.user) {
                (session.user as any).id = user?.id ?? token.sub ?? null;
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
});
