"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// Map styles for light and dark themes
const getLightMapStyles = () => [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.attraction',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.school',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.sports_complex',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.place_of_worship',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit.station',
    stylers: [{ visibility: 'off' }],
  },
];

const getDarkMapStyles = () => [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.business',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit.station',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

interface Place {
  displayName?: { text: string };
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
}

function createBankIcon(): google.maps.Icon {
  return {
    url: '/bank.png',
    scaledSize: new google.maps.Size(40, 40),
    anchor: new google.maps.Point(20, 40),
  };
}

export default function ChaseMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showingDirections, setShowingDirections] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [manualLocationText, setManualLocationText] = useState('');
  const [userMarker, setUserMarker] = useState<google.maps.Marker | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [destinationMarker, setDestinationMarker] = useState<google.maps.Marker | null>(null);



  // Detect theme on mount and when it changes
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      
      // Update map styles if map exists
      if (map) {
        map.setOptions({
          styles: isDark ? getDarkMapStyles() : getLightMapStyles(),
        });
      }
    };

    // Check initial theme
    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, [map]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const initialIsDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(initialIsDark);

      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 37.33537673950195, lng: -121.87994384765625 },
        zoom: 12,
        styles: initialIsDark ? getDarkMapStyles() : getLightMapStyles(),
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
  
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
  
      fetchedPlaces.forEach((place: Place, index: number) => {
        const lat = place.location?.latitude;
        const lng = place.location?.longitude;
  
        if (lat && lng) {
          const marker = new google.maps.Marker({
            position: { lat, lng },
            map: mapInstance,
            title: place.displayName?.text || 'Chase ATM',
            icon: createBankIcon(),
          });
  
          marker.addListener('click', () => {
            setSelectedIndex(index);
            infoWin.setContent(`
              <div class="map-infowindow">
                <strong>${place.displayName?.text || 'Chase ATM'}</strong><br />
                ${place.formattedAddress || ''}
              </div>
            `);
            infoWin.open(mapInstance, marker);
          });
  
          markersRef.current.push(marker);
        }
      });
  
      setPlaces(fetchedPlaces);
    } catch (err) {
      console.error('Error fetching Chase locations:', err);
    }
  }
  

  const handleGeolocate = () => {
    if (!map || !infoWindow) return;

    resetDirections();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(pos);

          // Remove old user marker
          if (userMarker) userMarker.setMap(null);

          // Create new one
          const marker = new google.maps.Marker({
            position: pos,
            map: map,
            title: 'Your Location',
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: '#0096FF',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            },
          });

          // Save reference
          setUserMarker(marker);

          map.setCenter(pos);

          await fetchNearbyChase(map, infoWindow, pos);
        },
        () => {
          infoWindow.setContent('Error: The Geolocation service failed or was denied.');
        }
      );
    }
  };

  const handleManualLocationSearch = async () => {
    if (!map || !infoWindow || !manualLocationText.trim()) return;

    resetDirections();
  
    const geocoder = new google.maps.Geocoder();
  
    geocoder.geocode({ address: manualLocationText }, async (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const pos = { lat: location.lat(), lng: location.lng() };
  
        setUserLocation(pos);
  
        // Remove old user marker
        if (userMarker) userMarker.setMap(null);

        // Create new one
        const marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'Your Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#0096FF',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
          },
        });

        // Save reference
        setUserMarker(marker);
  
        map.setCenter(pos);
        map.setZoom(14);
  
        // Now fetch Chase ATMs near this location
        await fetchNearbyChase(map, infoWindow, pos);
      } else {
        alert('Could not find that location. Try another search.');
      }
    });
  };

  const handleManualLocationSubmit = async () => {
    if (!map || !infoWindow) return;

    resetDirections();
  
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
  
    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude numbers.');
      return;
    }
  
    const pos = { lat, lng };
    setUserLocation(pos);
  
    // Remove old user marker
    if (userMarker) userMarker.setMap(null);

    // Create new one
    const marker = new google.maps.Marker({
      position: pos,
      map: map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#0096FF',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2,
      },
    });

    // Save reference
    setUserMarker(marker);
  
    map.setCenter(pos);
  
    await fetchNearbyChase(map, infoWindow, pos);
  };
  

  const handleSelectPlace = (index: number) => {
    if (!map || !infoWindow) return;
    const place = places[index];
    const lat = place.location?.latitude;
    const lng = place.location?.longitude;
    if (!lat || !lng) return;

    const marker = markersRef.current[index];
    setSelectedIndex(index);

    map.setCenter({ lat, lng });
    map.setZoom(15);

    infoWindow.setContent(`
      <div class="map-infowindow">
        <strong>${place.displayName?.text || 'Chase ATM'}</strong><br />
        ${place.formattedAddress || ''}
      </div>
    `);
    infoWindow.open(map, marker);
  };

  async function showDirections(destination: { lat: number; lng: number }) {
    if (!directionsService || !directionsRenderer || !userLocation || !map) {
      alert('Please search near your location first!');
      return;
    }
  
    // Hide existing directions
    directionsRenderer.setDirections({ routes: [] });
    setShowingDirections(false);
  
    const request: google.maps.DirectionsRequest = {
      origin: userLocation,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };
  
    // Suppress default markers
    directionsRenderer.setOptions({
      suppressMarkers: true,
    });
  
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
  
  

  function resetDirections() {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] } as any);
    }
    setShowingDirections(false);
    setSelectedIndex(null);
  }

  const clearDirections = () => {
    if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] } as any);
      setShowingDirections(false);
    }

    setSelectedIndex(null);
  };

    const autocompleteRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (!window.google || !window.google.maps || !autocompleteRef.current || !window.google.maps.places) return;
    
      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteRef.current,
        {
          types: ["address"], // enables FULL street address autocomplete
          fields: ["formatted_address", "geometry", "address_components"],
        }
      );
    
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace() as google.maps.places.PlaceResult;
    
        if (!place.geometry || !place.geometry.location) return;
    
        const loc = place.geometry.location;
    
        setManualLocationText(place.formatted_address || "");
        setManualLat(loc.lat().toString());
        setManualLng(loc.lng().toString());
      });
    }, []);
    

  return (
    <div className="relative w-full h-screen flex bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
  
      {/* ---- MOBILE SIDEBAR TOGGLE BUTTON ---- */}
      <button
        className="sm:hidden absolute top-15 left-3 z-40
                  bg-primary dark:bg-sidebar-primary
                  text-primary-foreground dark:text-sidebar-primary-foreground
                  px-3 py-2 rounded-md shadow-md
                  hover:opacity-90 transition"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        Menu
      </button>
  
      {/* ---- MOBILE OVERLAY ---- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
  
      {/* ---- SIDEBAR ---- */}
      <div
        className={`
          fixed sm:static top-0 left-0 h-full w-72 sm:w-80 bg-sidebar text-sidebar-foreground 
          border-r border-sidebar-border shadow-sm overflow-y-auto overflow-x-hidden z-40
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}
      >
        <div className="sticky top-0 bg-sidebar border-b border-sidebar-border p-4 z-50">
          <div className="flex items-center gap-2 mb-3 w-full">
            <input
              type="text"
              ref={autocompleteRef}
              placeholder="City, ZIP, or full address..."
              value={manualLocationText}
              onChange={(e) => setManualLocationText(e.target.value)}
              className="
                flex-1 min-w-0 
                bg-input text-sidebar-foreground placeholder-muted-foreground
                border border-sidebar-border px-2 py-1 rounded-md
              "
            />
            <button
              onClick={handleManualLocationSearch}
              className="bg-sidebar-primary text-sidebar-primary-foreground px-3 py-1 rounded-md hover:opacity-90 transition"
            >
              Set
            </button>
          </div>
  
          <button
            onClick={handleGeolocate}
            className="
              w-full 
              bg-primary text-primary-foreground 
              px-3 py-2 rounded-md 
              hover:opacity-90 transition
            "
          >
            Search Locations Near You
          </button>
        </div>
  
        {/* RESULTS LIST */}
        <div className="p-3">
          {places.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">
              No results yet. Search to get started!
            </p>
          ) : (
            <ul className="space-y-3">
              {places.map((place, index) => (
                <li
                  key={index}
                  className={`
                    rounded-lg p-3 border transition cursor-pointer
                    ${
                      selectedIndex === index
                        ? "bg-sidebar-accent border-sidebar-border"
                        : "border-sidebar-border bg-sidebar"
                    }
                  `}
                >
                  <div onClick={() => handleSelectPlace(index)}>
                    <strong className="block text-sm font-semibold">
                      {place.displayName?.text || "Chase ATM"}
                    </strong>
  
                    <span className="text-xs text-muted-foreground block mb-2">
                      {place.formattedAddress || "No address"}
                    </span>
  
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showDirections({
                          lat: place.location!.latitude!,
                          lng: place.location!.longitude!,
                        });
                        setSidebarOpen(false); // Auto close sidebar on mobile
                      }}
                      className="
                        bg-secondary px-3 py-1 text-xs rounded-md
                        text-secondary-foreground hover:opacity-90
                        border border-sidebar-border transition
                      "
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

      {/* ---- MAP AREA ---- */}
      <div className="flex-1 h-full relative">
        {/* ---- Remove Directions Button ---- */}
        {showingDirections && !sidebarOpen && (
            <button
              onClick={clearDirections}
              className="
                fixed sm:absolute top-26 right-2 sm:top-16 sm:right-4
                bg-primary dark:bg-sidebar-primary
                text-primary-foreground dark:text-sidebar-primary-foreground
                px-4 py-2 rounded-lg shadow-md border border-gray-300 dark:border-gray-700
                hover:opacity-90 transition z-50
              "
            >
            Remove Directions
          </button>
        )}

        {/* ---- Map Container ---- */}
        <div ref={mapRef} className="h-full w-full" />
      </div>
    </div>
  );
}