import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface RouteMapProps {
  origin?: string;
  destination?: string;
  className?: string;
}

const locationCoordinates: Record<string, [number, number]> = {
  "Kolkata": [22.5726, 88.3639],
  "Howrah Station": [22.5836, 88.3422],
  "Sealdah Station": [22.5656, 88.3676],
  "Victoria Memorial": [22.5448, 88.3426],
  "Dakshineswar": [22.6553, 88.3573],
  "Salt Lake": [22.5800, 88.4179],
  "New Town": [22.5958, 88.4795],
  "Park Street": [22.5505, 88.3520],
  "Gariahat": [22.5155, 88.3704],
  "Jadavpur": [22.4989, 88.3714],
  "Behala": [22.4892, 88.3209],
  "Dumdum": [22.6233, 88.4207],
  "Barasat": [22.7232, 88.4802],
  "Darjeeling": [27.0410, 88.2663],
  "Siliguri": [26.7271, 88.3953],
  "NJP Station": [26.7064, 88.4298],
  "Bagdogra Airport": [26.6812, 88.3286],
  "Kalimpong": [27.0660, 88.4697],
  "Kurseong": [26.8810, 88.2783],
  "Mirik": [26.8867, 88.1858],
  "Jalpaiguri": [26.5444, 88.7294],
  "Cooch Behar": [26.3452, 89.4482],
  "Alipurduar": [26.4916, 89.5271],
  "Digha": [21.6278, 87.5098],
  "Mandarmani": [21.6691, 87.7114],
  "Tajpur": [21.6700, 87.6500],
  "Bakkhali": [21.5608, 88.2580],
  "Diamond Harbour": [22.1892, 88.1919],
  "Durgapur": [23.5204, 87.3119],
  "Asansol": [23.6850, 86.9529],
  "Bardhaman": [23.2324, 87.8615],
  "Bankura": [23.2324, 87.0649],
  "Bishnupur": [23.0766, 87.3152],
  "Purulia": [23.3321, 86.3648],
  "Shantiniketan": [23.6814, 87.6855],
  "Nabadwip": [23.4067, 88.3672],
  "Mayapur": [23.4231, 88.3891],
  "Murshidabad": [24.1746, 88.2681],
  "Malda": [25.0108, 88.1411],
  "Kharagpur": [22.3460, 87.2320],
  "Haldia": [22.0256, 88.0583],
  "Kolkata Airport": [22.6520, 88.4463],
  "Kalighat": [22.5204, 88.3463],
  "Science City": [22.5402, 88.3963],
  "Hooghly": [22.9000, 88.3900],
  "Chandannagar": [22.8671, 88.3674],
  "Patna": [25.5941, 85.1376],
  "Ranchi": [23.3441, 85.3096],
  "Bhubaneswar": [20.2961, 85.8245],
  "Guwahati": [26.1445, 91.7362],
};

const defaultCenter: [number, number] = [22.9868, 87.8550];

function getCoordinates(location: string): [number, number] | null {
  if (locationCoordinates[location]) {
    return locationCoordinates[location];
  }
  for (const [key, coords] of Object.entries(locationCoordinates)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(location.toLowerCase())) {
      return coords;
    }
  }
  return null;
}

export function RouteMap({ origin, destination, className = "" }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    const originCoords = origin ? getCoordinates(origin) : null;
    const destCoords = destination ? getCoordinates(destination) : null;

    const pickupIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="8"/></svg>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const dropIcon = L.divIcon({
      className: "custom-marker",
      html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
    });

    if (originCoords) {
      const marker = L.marker(originCoords, { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>Pickup:</b> ${origin}`);
      markersRef.current.push(marker);
    }

    if (destCoords) {
      const marker = L.marker(destCoords, { icon: dropIcon })
        .addTo(map)
        .bindPopup(`<b>Drop:</b> ${destination}`);
      markersRef.current.push(marker);
    }

    if (originCoords && destCoords) {
      polylineRef.current = L.polyline([originCoords, destCoords], {
        color: "#3b82f6",
        weight: 4,
        opacity: 0.8,
        dashArray: "10, 10",
      }).addTo(map);

      const bounds = L.latLngBounds([originCoords, destCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (originCoords) {
      map.setView(originCoords, 12);
    } else if (destCoords) {
      map.setView(destCoords, 12);
    } else {
      map.setView(defaultCenter, 7);
    }

    return () => {};
  }, [origin, destination]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" style={{ minHeight: "300px" }} />
      {!origin && !destination && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-xl">
          <div className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-muted-foreground">
            Select pickup and drop locations to see the route
          </div>
        </div>
      )}
    </div>
  );
}
