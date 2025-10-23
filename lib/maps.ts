export async function searchPlaces(textQuery: string) {
    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
      },
      body: JSON.stringify({
        textQuery,
      }),
    });
  
    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`);
    }
  
    const data = await response.json();
    return data.places;
  }