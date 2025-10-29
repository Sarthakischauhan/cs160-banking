'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface Place {
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
}

export default function ChaseMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [manualQuery, setManualQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showingDirections, setShowingDirections] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 37.33537673950195, lng: -121.87994384765625 },
        zoom: 12,
      });

      const infoWin = new google.maps.InfoWindow();
      setMap(mapInstance);
      setInfoWindow(infoWin);

      const dirService = new google.maps.DirectionsService();
      const dirRenderer = new google.maps.DirectionsRenderer({ map: mapInstance });
      setDirectionsService(dirService);
      setDirectionsRenderer(dirRenderer);
    });
  }, []);

  useEffect(() => {
    if (!infoWindow) return;

    const listener = infoWindow.addListener('closeclick', () => {
      setSelectedIndex(null);
    });

    return () => {
      listener.remove();
    };
  }, [infoWindow]);

  async function fetchNearbyChase(
    mapInstance: google.maps.Map,
    infoWin: google.maps.InfoWindow,
    location: { lat: number; lng: number } | string
  ) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const query =
        typeof location === 'string'
          ? `Chase ATMs near ${location}`
          : `Chase ATMs near ${location.lat},${location.lng}`;

      const res = await fetch(`${baseUrl}/api/maps?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      const fetchedPlaces = data.places || [];

      markers.forEach((m) => m.setMap(null));
      const newMarkers: google.maps.Marker[] = [];

      fetchedPlaces.forEach((place: Place, index: number) => {
        const lat = place.location?.latitude;
        const lng = place.location?.longitude;

        if (lat && lng) {
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstance,
            title: place.displayName?.text || 'Chase ATM',
          });

          marker.addListener('click', () => {
            setSelectedIndex(index);
            infoWin.setContent(`
              <div style="font-family: Arial; max-width: 200px;">
                <strong>${place.displayName?.text || 'Chase ATM'}</strong><br />
                ${place.formattedAddress || ''}
              </div>
            `);
            infoWin.open(mapInstance, marker);
          });

          newMarkers.push(marker);
        }
      });

      setMarkers(newMarkers);
      setPlaces(fetchedPlaces);

      if (fetchedPlaces.length > 0 && fetchedPlaces[0].location) {
        mapInstance.setCenter({
          lat: fetchedPlaces[0].location.latitude,
          lng: fetchedPlaces[0].location.longitude,
        });
      }
    } catch (err) {
      console.error('Error fetching Chase locations:', err);
    }
  }

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!map || !infoWindow || manualQuery.trim() === '') return;
    await fetchNearbyChase(map, infoWindow, manualQuery);
  };

  const handleGeolocate = () => {
    if (!map || !infoWindow) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(pos);

          new google.maps.Marker({
            position: pos,
            map: map,
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

          map.setCenter(pos);
          infoWindow.setPosition(pos);
          infoWindow.setContent(`Your location:<br>Latitude: ${pos.lat}<br>Longitude: ${pos.lng}`);
          infoWindow.open(map);

          await fetchNearbyChase(map, infoWindow, pos);
        },
        () => {
          infoWindow.setContent('Error: The Geolocation service failed or was denied.');
        }
      );
    }
  };

  const handleSelectPlace = (index: number) => {
    if (!map || !infoWindow) return;
    const place = places[index];
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;
    if (!lat || !lng) return;

    const marker = markers[index];
    setSelectedIndex(index);

    map.setCenter({ lat, lng });
    map.setZoom(15);

    infoWindow.setContent(`
      <div style="font-family: Arial; max-width: 200px;">
        <strong>${place.displayName?.text || 'Chase ATM'}</strong><br />
        ${place.formattedAddress || ''}
      </div>
    `);
    infoWindow.open(map, marker);
  };

  async function showDirections(destination: { lat: number; lng: number }) {
    if (!directionsService || !directionsRenderer || !userLocation) {
      alert('Please search near your location first!');
      return;
    }

    const request: google.maps.DirectionsRequest = {
      origin: userLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK' && result) {
        directionsRenderer.setDirections(result);
        setShowingDirections(true);
      } else {
        console.error('Directions request failed:', status);
        alert('Could not display directions: ' + status);
      }
    });
  }

    const clearDirections = () => {
      if (directionsRenderer) {
        directionsRenderer.setDirections({ routes: [] } as any);
        setShowingDirections(false);
      }

      setSelectedIndex(null);
    };

    return (
    <div className="relative w-full h-screen flex bg-white text-gray-800">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-md border-r border-gray-200 overflow-y-auto z-20">
        <div className="p-4 border-b border-gray-200">
          <form onSubmit={handleManualSearch} className="flex items-center space-x-2 mb-3">
            <input
              type="text"
              placeholder="Enter city or ZIP..."
              value={manualQuery}
              onChange={(e) => setManualQuery(e.target.value)}
              className="flex-1 border border-gray-300 bg-gray-50 rounded-md px-2 py-1 outline-none text-gray-800 placeholder-gray-400"
            />
            <button className="bg-gray-700 text-gray-100 px-3 py-1 rounded-md hover:bg-gray-800 cursor-pointer">
              Search
            </button>
          </form>

          <button
            onClick={handleGeolocate}
            className="w-full bg-blue-500 text-gray-100 px-3 py-2 hover:bg-blue-600 cursor-pointer"
          >
            Search Locations Near You
          </button>
        </div>

        <div className="p-3">
          {places.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No results yet. Search to get started!</p>
          ) : (
            <ul className="space-y-3">
              {places.map((place, index) => (
                <li
                  key={index}
                  className={`border rounded-lg p-3 transition ${
                    selectedIndex === index ? 'bg-gray-100 border-gray-500' : 'border-gray-200'
                  }`}
                >
                  <div className="cursor-pointer" onClick={() => handleSelectPlace(index)}>
                    <strong className="block text-sm font-semibold">
                      {place.displayName?.text || 'Chase ATM'}
                    </strong>
                    <span className="text-xs text-gray-500 block mb-2">
                      {place.formattedAddress || 'No address'}
                    </span>
                    <button
                      onClick={() =>
                        showDirections({
                          lat: place.location!.latitude!,
                          lng: place.location!.longitude!,
                        })
                      }
                      className="bg-gray-100 border border-gray-500 text-gray-700 text-xs px-3 py-1 rounded-md hover:bg-gray-200 cursor-pointer"
                    >
                      Get Directions
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 h-full relative">
        {showingDirections && (
          <button
            onClick={clearDirections}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 z-30"
          >
            Remove Directions
          </button>
        )}
        <div ref={mapRef} className="h-full w-full" />
      </div>
    </div>
  );
}
