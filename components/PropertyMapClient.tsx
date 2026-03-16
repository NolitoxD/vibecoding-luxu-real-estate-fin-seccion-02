"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "@/i18n/context";

// Fix Leaflet default icon in Next.js
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
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

interface PropertyMapClientProps {
  lat: number;
  lng: number;
  title: string;
  location: string;
}

export default function PropertyMapClient({
  lat,
  lng,
  title,
  location,
}: PropertyMapClientProps) {
  const { t } = useTranslation();
  useEffect(() => {
    // Fix Leaflet icon issue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
      <MapContainer
        center={[lat, lng]}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            <div style={{ fontFamily: "Inter, sans-serif", minWidth: 150 }}>
              <p style={{ fontWeight: 600, color: "#19322F", margin: 0 }}>
                {title}
              </p>
              <p style={{ color: "#006655", fontSize: 12, margin: "4px 0 0" }}>
                {location}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 z-[1000] bg-white/90 text-xs font-medium px-2 py-1.5 rounded shadow-sm text-nordic hover:text-mosque transition-colors backdrop-blur"
      >
        {t("common.view_on_maps")}
      </a>
    </div>
  );
}
