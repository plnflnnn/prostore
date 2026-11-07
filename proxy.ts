import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import type { NextFetchEvent, NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Call auth as middleware (request in, Response out).
// Do not wrap with auth(() => {}) — that skips authorized === false redirects.
export default function proxy(request: NextRequest, event: NextFetchEvent) {
  return (
    auth as unknown as (request: NextRequest, event: NextFetchEvent) => Promise<Response>
  )(request, event);
}
