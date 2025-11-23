function isChase(place: any) {
  const name = place?.displayName?.text?.toLowerCase() || "";
  return name.includes("chase");
}

export async function searchTextPlaces(textQuery: string) {
  if (!textQuery) return [];

  const url = `${PLACES_BASE}/places:searchText`;
  const body = {
    textQuery,
    maxResultCount: 20,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Places text search failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  return (data.places || []).filter(isChase);
}

export async function searchNearbyPlaces(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey!,
        "X-Goog-FieldMask":
          "places.displayName,places.formattedAddress,places.location,places.id",
      },
      body: JSON.stringify({
        includedTypes: ["atm"], // keep ATM type
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 5000,
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Places nearby search failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  return (data.places || []).filter(isChase);
}
