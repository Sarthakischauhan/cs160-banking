import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth0, getRole } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
  const session = await auth0.getSession(request);

  if (!session) {
    return await auth0.middleware(request);
  }

  const role = getRole(session);
  const headers = new Headers(request.headers);
  headers.set("x-user-role", role);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
