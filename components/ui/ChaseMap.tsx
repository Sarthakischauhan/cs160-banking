'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function ChaseMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: "quarterly",
      });

      const { Map } = await loader.importLibrary("maps");
      const { Marker } = await loader.importLibrary("marker");
      const { InfoWindow } = await loader.importLibrary("maps");

      if (!mapRef.current) return;

      const map = new Map(mapRef.current, {
        center: { lat: 37.4333666, lng: -121.9015582 },
        zoom: 12,
      });

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/maps?q=Chase ATMs Near Me`);
        const data = await res.json();
        console.log("Fetched data:", data);

        const places = data.places || [];

        if (Array.isArray(places) && places.length > 0) {
          const infoWindow = new InfoWindow();

          places.forEach((place: any, i: number) => {
            const lat = place.location?.latitude;
            const lng = place.location?.longitude;

            if (lat && lng) {
              const marker = new Marker({
                position: { lat, lng },
                map,
                title: place.displayName?.text || "Chase ATM",
              });

              marker.addListener("click", () => {
                infoWindow.setContent(`
                  <div style="font-family: Arial; max-width: 200px;">
                    <strong>${place.displayName?.text || "Chase ATM"}</strong><br />
                    ${place.formattedAddress || ""}
                  </div>
                `);
                infoWindow.open(map, marker);
              });
            }
          });

          map.setCenter({
            lat: places[0].location.latitude,
            lng: places[0].location.longitude,
          });
        } else {
          console.warn("No valid places found in API response");
        }
      } catch (err) {
        console.error("Error fetching Chase locations:", err);
      }
    };

    initializeMap();
  }, [isClient]);

  if (!isClient) return <div className="h-[600px] bg-gray-100">Loading map...</div>;

  return <div className="h-[600px]" ref={mapRef} />;
}
