import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      //Aray of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      //Get pathname from the req URL object
      const { pathname } = request.nextUrl;

      //Check if user is not authenticated and accessing a protected path
      if(!auth && protectedPaths.some((p) => p.test(pathname))) return false;


      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        });
        response.cookies.set("sessionCartId", sessionCartId);
        return response;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
