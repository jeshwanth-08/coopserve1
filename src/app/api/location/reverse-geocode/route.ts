import { NextResponse } from "next/server";
import { INDIAN_CITIES } from "@/lib/homeData";

export const dynamic = "force-dynamic";

// Centroids of supported Indian cooperative metro hubs
const HUB_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  "Delhi NCR": { lat: 28.6139, lng: 77.209 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
};

// Haversine distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest supported metro city
function findNearestHub(lat: number, lng: number): { name: string; distanceKm: number } {
  let nearestCity = "Bengaluru";
  let minDistance = Infinity;

  for (const [cityName, coords] of Object.entries(HUB_CENTROIDS)) {
    const dist = getDistanceKm(lat, lng, coords.lat, coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = cityName;
    }
  }

  return { name: nearestCity, distanceKm: Math.round(minDistance) };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let lat = Number(body.latitude ?? body.lat);
    let lng = Number(body.longitude ?? body.lng);

    // If no coordinates provided, try IP-based geolocation fallback
    if (isNaN(lat) || isNaN(lng)) {
      try {
        const ipRes = await fetch("https://ipapi.co/json/", {
          signal: AbortSignal.timeout(3000),
          headers: { "User-Agent": "CoopServe-Geo/1.0" },
        });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.latitude && ipData.longitude) {
            lat = Number(ipData.latitude);
            lng = Number(ipData.longitude);
          }
        }
      } catch (err) {
        console.warn("IP Geolocation fallback failed:", err);
      }
    }

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({
        success: true,
        city: "Bengaluru",
        locality: "Indiranagar (Default Node)",
        lat: 12.9716,
        lng: 77.5946,
        source: "default",
      });
    }

    const { name: nearestHub, distanceKm } = findNearestHub(lat, lng);
    let detectedCity = nearestHub;
    let detectedLocality = "";
    let formattedAddress = "";

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "CoopServe-GigPlatform/1.0 (contact@coopserve.org)",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(4000),
      });

      if (res.ok) {
        const data = await res.json();
        formattedAddress = data.display_name || "";
        const addr = data.address || {};

        detectedLocality =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.subdivision ||
          addr.quarter ||
          addr.road ||
          addr.village ||
          addr.hamlet ||
          "";

        const rawCity =
          addr.city ||
          addr.town ||
          addr.municipality ||
          addr.city_district ||
          addr.state_district ||
          "";

        const matchedKnownCity = INDIAN_CITIES.find(
          (c) =>
            c.name.toLowerCase().includes(rawCity.toLowerCase()) ||
            rawCity.toLowerCase().includes(c.name.toLowerCase())
        );

        if (matchedKnownCity) {
          detectedCity = matchedKnownCity.name;
        } else if (distanceKm <= 80) {
          detectedCity = nearestHub;
        } else if (rawCity) {
          detectedCity = rawCity;
        }
      }
    } catch (err) {
      console.warn("Nominatim reverse geocode error or timeout:", err);
    }

    if (!detectedLocality) {
      const cityData = INDIAN_CITIES.find((c) => c.name === detectedCity);
      if (cityData && cityData.localities.length > 0) {
        detectedLocality = `${cityData.localities[0]} (GPS Area)`;
      } else {
        detectedLocality = "Central Hub (GPS)";
      }
    }

    return NextResponse.json({
      success: true,
      city: detectedCity,
      locality: detectedLocality,
      formattedAddress: formattedAddress || `${detectedLocality}, ${detectedCity}`,
      lat,
      lng,
      distanceToHubKm: distanceKm,
      source: "gps",
    });
  } catch (error: any) {
    console.error("Reverse geocoding route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to resolve coordinates",
        city: "Bengaluru",
        locality: "Indiranagar (Fallback)",
      },
      { status: 500 }
    );
  }
}
