import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { accountId } = await req.json();

  if (!accountId) {
    return NextResponse.json({ error: "Missing accountId" }, { status: 400 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("currentAccountId", accountId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
