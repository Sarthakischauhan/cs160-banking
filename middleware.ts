import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0, getRole } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  // Handle Auth0 callback errors
  if (request.nextUrl.pathname.includes("/auth/callback")) {
    const error = request.nextUrl.searchParams.get("error");
    const errorDescription = request.nextUrl.searchParams.get("error_description");
    
    if (error === "access_denied") {
      // User declined authorization, redirect to a friendly page
      return NextResponse.redirect(new URL("/auth/access-denied", request.url));
    }
    
    if (error) {
      // Other Auth0 errors
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }
  }

  if (request.nextUrl.pathname.includes("/auth/")) {
    return auth0.middleware(request);
  }

  const session = await auth0.getSession(request);

  if (session === null) {
    return auth0.middleware(request);
  }

   const role = getRole(session);
  const emailVerified = session.user?.email_verified

  if (!emailVerified && !request.nextUrl.pathname.includes("email-verify") && !request.nextUrl.pathname.includes("/api")) {
    return NextResponse.redirect(new URL('/email-verify', request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-user-role", role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
  // the reason we are using nodejs because the prisma adapter doesn't run on the default edge runtime of middleware
};