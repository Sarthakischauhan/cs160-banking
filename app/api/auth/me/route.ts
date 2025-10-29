import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET(request:Request) {
  // If not logged in, you can choose to 401 or redirect to login
  const current = await auth0.getSession();
  if (!current) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  try {
    // Force-refresh tokens so claims are up to date and persisted
    await auth0.getAccessToken({ refresh: true });

    // Re-read the session to get fresh claims (like email_verified)
    const refreshed = await auth0.getSession();
    if (!refreshed) {
      return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user: refreshed.user,
      email_verified: !!refreshed.user?.email_verified,
    });
  } catch (e) {
    console.error("me refresh failed", e);
    return NextResponse.json({ error: "refresh_failed" }, { status: 500 });
  }
}