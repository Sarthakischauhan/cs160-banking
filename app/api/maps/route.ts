import { NextResponse } from "next/server";
import { searchTextPlaces, searchNearbyPlaces } from "@/lib/maps";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let query = (searchParams.get("q") || "").trim();

  if (!query) query = "Chase ATMs Near Me";

  try {
    query = query.replace(/,+\s*$/, "").trim();

    const coordMatch = query.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      const places = await searchNearbyPlaces(lat, lng);
      return NextResponse.json({ success: true, places });
    }

    const nearMatch = query.match(/near\s+(.+)$/i);
    const locationText = nearMatch ? nearMatch[1].trim() : null;

    if (locationText) {
      const places = await searchTextPlaces(
        `Chase ATMs near ${locationText}`
      );
      return NextResponse.json({ success: true, places });
    }

    const places = await searchTextPlaces(query);
    return NextResponse.json({ success: true, places });
  } catch (err: any) {
    console.error("maps route error:", err);
    return NextResponse.json(
      { success: false, error: err.message ?? String(err) },
      { status: 500 }
    );
  }
}
