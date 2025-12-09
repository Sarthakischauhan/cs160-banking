import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Get the returnTo parameter, default to home
  const returnTo = request.nextUrl.searchParams.get("returnTo") || "/";
  
  // Build Auth0 logout URL
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  
  if (!auth0Domain || !clientId) {
    console.error("AUTH0_DOMAIN or AUTH0_CLIENT_ID not configured");
    return NextResponse.redirect(new URL("/", request.url));
  }
  
  const logoutUrl = `${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;
  
  // Redirect to Auth0 logout
  return NextResponse.redirect(logoutUrl);
}

export async function POST(request: NextRequest) {
  // POST should behave the same as GET for logout
  return GET(request);
}
