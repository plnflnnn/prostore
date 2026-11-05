import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import type { NextAuthConfig } from "next-auth";

export const config = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in"
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        if (!user || !user.password) return null;
        const passwordsMatch = compareSync(
          credentials.password as string,
          user.password,
        );
        if (!passwordsMatch) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as string;
      session.user.name = token.name as string;

      if(trigger === "update") {
        session.user.name = user.name as string;
      }

      return session;
    },
    async jwt({ token, user, trigger, session}) {
      // Assign user fields to token
      if(user) {
        token.role = user.role;

        if(user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];

          await prisma.user.update({
            where: {id: user.id},
            data: {name: token.name}
          });
        }
      }

      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    }
  }
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);