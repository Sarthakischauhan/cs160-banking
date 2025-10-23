'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export default function ChaseMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [routeActive, setRouteActive] = useState(false);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;

    const initializeMap = async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'quarterly',
      });

      const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;
      const { Marker } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;
      const { DirectionsService, DirectionsRenderer } = await loader.importLibrary('routes') as google.maps.RoutesLibrary;

      if (!mapRef.current) return;

      const initialMap = new Map(mapRef.current, {
        center: { lat: 37.337427, lng: -121.888427 },
        zoom: 12,
      });
      setMap(initialMap);

      const infoWindow = new google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;

      infoWindow.addListener("closeclick", () => {
        setSelectedIndex(null);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLocation(loc);
            new Marker({
              position: loc,
              map: initialMap,
              title: 'Your Location',
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
              },
            });
            initialMap.setCenter(loc);
          },
          err => console.warn('Could not get location', err)
        );
      }

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/maps?q=Chase ATMs Near Me`);
        const data = await res.json();
        const fetchedPlaces = data.places || [];
        setPlaces(fetchedPlaces);

        const newMarkers: google.maps.Marker[] = [];

        fetchedPlaces.forEach((place: any, index: number) => {
          const lat = place.location?.latitude;
          const lng = place.location?.longitude;

          if (lat && lng) {
            const marker = new Marker({
              position: { lat, lng },
              map: initialMap,
              title: place.displayName?.text || 'Chase ATM',
            });

            marker.addListener('click', () => {
              setSelectedIndex(index);
              infoWindow.setContent(`
                <div style="font-family: Arial; max-width: 200px;">
                  <strong>${place.displayName?.text || 'Chase ATM'}</strong><br />
                  ${place.formattedAddress || ''}
                </div>
              `);
              infoWindow.open(initialMap, marker);
              initialMap.panTo(marker.getPosition()!);
              initialMap.setZoom(14);
            });

            newMarkers.push(marker);
          }
        });

        setMarkers(newMarkers);

        if (fetchedPlaces.length > 0) {
          initialMap.setCenter({
            lat: fetchedPlaces[0].location.latitude,
            lng: fetchedPlaces[0].location.longitude,
          });
        }

        const dirRenderer = new DirectionsRenderer({ suppressMarkers: false });
        dirRenderer.setMap(initialMap);
        setDirectionsRenderer(dirRenderer);
      } catch (err) {
        console.error('Error fetching Chase locations:', err);
      }
    };

    initializeMap();
  }, [isClient]);

  useEffect(() => {
    if (selectedIndex !== null && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIndex]);

  const handleSelectPlace = (index: number) => {
    const place = places[index];
    const marker = markers[index];
    setSelectedIndex(index);

    if (marker && infoWindowRef.current && map) {
      infoWindowRef.current.setContent(`
        <div style="font-family: Arial; max-width: 200px;">
          <strong>${place.displayName?.text || 'Chase ATM'}</strong><br />
          ${place.formattedAddress || ''}
        </div>
      `);
      infoWindowRef.current.open(map, marker);
      map.panTo(marker.getPosition()!);
      map.setZoom(14);
    }
  };

  const handleGetDirections = (index: number) => {
    if (!userLocation || !directionsRenderer) return alert('User location not found!');
    const place = places[index];
    const destination = {
      lat: place.location.latitude,
      lng: place.location.longitude,
    };

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer.setDirections(result);
          setRouteActive(true);
        } else {
          console.error('Directions request failed:', status);
        }
      }
    );
  };

  const handleClearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
      setRouteActive(false);
    }
  };

  if (!isClient) return <div className="h-[600px] bg-gray-100">Loading map...</div>;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar list */}
      <div className="w-1/3 overflow-y-auto bg-gray-50 border-r border-gray-200 p-3">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Chase ATMs</h2>
          {routeActive && (
            <button
              onClick={handleClearDirections}
              className="text-sm text-red-600 hover:underline"
            >
              Clear Route
            </button>
          )}
        </div>

        {places.length === 0 ? (
          <p>Loading locations...</p>
        ) : (
          places.map((place, i) => (
            <div
              key={i}
              ref={(el) => (itemRefs.current[i] = el)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-all duration-150 ${
                selectedIndex === i
                  ? 'bg-gray-200 border border-black shadow-md'
                  : 'bg-white border border-gray-200 shadow-sm hover:bg-gray-100 hover:shadow-md'
              }`}
              onClick={() => handleSelectPlace(i)}
            >          
              <p className="font-medium">{place.displayName?.text || 'Chase ATM'}</p>
              <p className="text-sm text-gray-600">{place.formattedAddress}</p>

              <button
                className="mt-2 text-blue-600 hover:underline text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGetDirections(i);
                }}
              >
              </button>
            </div>
          ))
        )}
      </div>

      {/* Map */}
      <div className="flex-1" ref={mapRef} />
    </div>
  );
}
