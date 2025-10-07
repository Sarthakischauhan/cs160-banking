import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0, getRole } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.includes("/auth/")) {
    return auth0.middleware(request);
  }

  const session = await auth0.getSession(request);
  if (!session) {
    return auth0.middleware(request);
  }
  const role = getRole(session);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-role", role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};