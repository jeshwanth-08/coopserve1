"use client";

import React, { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Compass, Layers, Check } from "lucide-react";

export interface LocationCoords {
  lat: number;
  lng: number;
  address?: string;
  locality?: string;
}

interface ServiceLocationMapProps {
  initialLat?: number;
  initialLng?: number;
  initialLocality?: string;
  onLocationSelect?: (location: LocationCoords) => void;
  height?: string;
  readOnly?: boolean;
  markers?: Array<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
    isHub?: boolean;
  }>;
}

// Preset cooperative localities / societies
export const COOP_SOCIETY_LOCATIONS = [
  { name: "Greenwood Heights", lat: 12.9716, lng: 77.5946, locality: "Central Hub", providers: 8 },
  { name: "Prestige Ozone", lat: 12.9592, lng: 77.7499, locality: "Whitefield", providers: 14 },
  { name: "Sunshine Heights", lat: 12.9352, lng: 77.6245, locality: "Koramangala", providers: 11 },
  { name: "Sobha City", lat: 13.0624, lng: 77.6394, locality: "Thanisandra", providers: 9 },
  { name: "Brigade Gateway", lat: 13.0125, lng: 77.5552, locality: "Rajajinagar", providers: 7 },
];

export default function ServiceLocationMap({
  initialLat = 12.9716,
  initialLng = 77.5946,
  initialLocality = "Greenwood Heights",
  onLocationSelect,
  height = "320px",
  readOnly = false,
  markers = [],
}: ServiceLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [selectedSociety, setSelectedSociety] = useState<string>(initialLocality);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState<string>(
    initialLocality ? `${initialLocality}, Bangalore` : "Central Hub, Bangalore"
  );

  // Load Leaflet CSS and JS dynamically to prevent SSR hydration errors
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if Leaflet CSS already exists
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Check if Leaflet JS already exists
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setLeafletLoaded(true);
    document.body.appendChild(script);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Fix default Leaflet icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);
    mapInstanceRef.current = map;

    // OpenStreetMap standard tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors • CoopServe GIS',
      maxZoom: 19,
    }).addTo(map);

    // Add multiple markers if provided
    if (markers.length > 0) {
      markers.forEach((m) => {
        const marker = L.marker([m.lat, m.lng]).addTo(map);
        marker.bindPopup(`<strong>${m.title}</strong><br/>${m.description || ""}`);
      });
    } else {
      // Primary draggable marker
      const pin = L.marker([initialLat, initialLng], {
        draggable: !readOnly,
      }).addTo(map);

      pin.bindPopup(`<strong>${initialLocality}</strong><br/>CoopServe Verified Location`).openPopup();
      markerRef.current = pin;

      if (!readOnly) {
        pin.on("dragend", async (e: any) => {
          const latlng = e.target.getLatLng();
          handleLocationUpdate(latlng.lat, latlng.lng);
        });

        map.on("click", (e: any) => {
          pin.setLatLng(e.latlng);
          handleLocationUpdate(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  const handleLocationUpdate = async (lat: number, lng: number, societyName?: string) => {
    setCurrentCoords({ lat, lng });

    // Reverse geocoding simulation with OpenStreetMap Nominatim fallback
    setGeocoding(true);
    let addr = societyName ? `${societyName}, Bangalore` : `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

    try {
      // Light reverse geocode query to Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { "User-Agent": "CoopServe-GIS-Web/1.0" } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          const parts = data.display_name.split(",").slice(0, 3).join(", ");
          addr = parts || addr;
        }
      }
    } catch {
      // Fallback cleanly without disruption
    } finally {
      setGeocoding(false);
    }

    setResolvedAddress(addr);

    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address: addr,
        locality: societyName || selectedSociety,
      });
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.bindPopup(`<strong>${addr}</strong><br/>CoopServe Verified Node`).openPopup();
    }
  };

  const handleSelectPreset = (soc: (typeof COOP_SOCIETY_LOCATIONS)[0]) => {
    setSelectedSociety(soc.name);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([soc.lat, soc.lng], 14, { duration: 1 });
    }
    handleLocationUpdate(soc.lat, soc.lng, soc.name);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-3 p-4">
      {/* Map Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>OpenStreetMap &bull; Leaflet Live Canvas</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                Co-op GIS Node
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              {readOnly
                ? "Showing registered cooperative service territory"
                : "Drag the pin or click anywhere on the map to accurately pinpoint your doorstep."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-mono text-[11px] text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
            {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Society Quick Selection Pills */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Societies:
          </span>
          {COOP_SOCIETY_LOCATIONS.map((soc) => (
            <button
              key={soc.name}
              type="button"
              onClick={() => handleSelectPreset(soc)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSociety === soc.name
                  ? "bg-slate-900 text-white shadow-sm font-bold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {soc.name}
            </button>
          ))}
        </div>
      )}

      {/* Map Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-inner">
        {!leafletLoaded && (
          <div
            style={{ height }}
            className="w-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 gap-2"
          >
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Initializing OpenStreetMap Tiles...</span>
          </div>
        )}
        <div
          ref={mapContainerRef}
          style={{ height, display: leafletLoaded ? "block" : "none" }}
          className="w-full z-0"
        />

        {/* Resolved Address Floating Pill */}
        <div className="absolute bottom-2 left-2 right-2 z-10 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-slate-200 shadow-md flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate font-semibold text-slate-800">
              {geocoding ? "Detecting address..." : resolvedAddress}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0 font-mono ml-2">OSM &bull; Leaflet</span>
        </div>
      </div>
    </div>
  );
}
