import { NextResponse } from "next/server";
import { searchPlaces } from "@/lib/maps";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "Chase ATMs Near Me";

  try {
    const places = await searchPlaces(query);
    return NextResponse.json({ success: true, places });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
