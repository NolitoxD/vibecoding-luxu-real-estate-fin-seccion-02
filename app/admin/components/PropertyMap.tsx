'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Dynamically import react-leaflet components (no SSR)
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

// Same custom icon as PropertyMapClient
const customIcon = L.divIcon({
  html: `
    <div style="
      width: 40px; height: 40px;
      background: #006655;
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,102,85,0.4);
    ">
      <span class="material-icons" style="color:white;font-size:18px;">home</span>
    </div>
  `,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

type PropertyMapProps = {
  address: string;
};

const DEFAULT_LAT = 40.4168;
const DEFAULT_LNG = -3.7038;

export default function PropertyMap({ address }: PropertyMapProps) {
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'found' | 'error'>('idle');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    // Fix Leaflet icon issue (same as PropertyMapClient)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Request user location
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  }, []);

  // Geocode address with debounce
  useEffect(() => {
    if (!address) return;

    const timer = setTimeout(async () => {
      setStatus('loading');
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
        );
        const data = await res.json();
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
          setStatus('found');
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [address]);

  const center: [number, number] = coords ?? userLocation ?? [DEFAULT_LAT, DEFAULT_LNG];
  const zoom = coords ? 14 : (userLocation ? 12 : 5);

  return (
    <div className="relative h-48 w-full rounded-lg overflow-hidden border border-gray-200">
      {status === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-[1000]">
          <span className="text-xs text-gray-500 font-sf-pro">Locating address...</span>
        </div>
      )}
      {status === 'error' && (
        <div className="absolute bottom-2 left-2 bg-orange-50 text-orange-600 text-[10px] px-2 py-1 rounded shadow font-sf-pro z-[1000]">
          Address not found
        </div>
      )}
      <MapContainer
        key={`${center[0]}-${center[1]}`}
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coords && (
          <Marker position={coords} icon={customIcon}>
            <Popup>
              <p style={{ fontWeight: 600, color: '#19322F', margin: 0 }}>{address}</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
