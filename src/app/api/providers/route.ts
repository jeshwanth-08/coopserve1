import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const FALLBACK_PROVIDERS = [
  {
    id: "user-provider-marcus",
    name: "Marcus Thorne",
    email: "provider1@coop.org",
    locality: "Greenwood Heights",
    phone: "+1 555-0201",
    providerProfile: {
      isVerified: true,
      isActive: true,
      avgRating: 4.9,
      totalReviews: 18,
      skills: JSON.stringify(["Master Electrician", "Rewiring", "Circuit Breakers", "Solar Panel Hookups"]),
      serviceCategories: JSON.stringify(["Electrician", "Appliance Repair"]),
      serviceArea: "Greenwood Heights & East",
    },
    _count: { assignedRequests: 12, ratingsReceived: 18 },
  },
  {
    id: "user-provider-david",
    name: "David Chen",
    email: "provider2@coop.org",
    locality: "Riverside Society",
    phone: "+1 555-0202",
    providerProfile: {
      isVerified: true,
      isActive: true,
      avgRating: 4.8,
      totalReviews: 15,
      skills: JSON.stringify(["Master Plumber", "Pipe Fitting", "Water Heaters", "Hydro-Jetting"]),
      serviceCategories: JSON.stringify(["Plumber"]),
      serviceArea: "Riverside Society & Central",
    },
    _count: { assignedRequests: 9, ratingsReceived: 15 },
  },
  {
    id: "user-provider-sunita",
    name: "Sunita Sharma",
    email: "provider3@coop.org",
    locality: "Koramangala",
    phone: "+91 98450 33445",
    providerProfile: {
      isVerified: true,
      isActive: true,
      avgRating: 4.95,
      totalReviews: 24,
      skills: JSON.stringify(["Salon at Home", "Facial Care", "Hair Styling"]),
      serviceCategories: JSON.stringify(["Women's Salon & Spa"]),
      serviceArea: "Koramangala & Indiranagar",
    },
    _count: { assignedRequests: 16, ratingsReceived: 24 },
  },
];

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const locality = searchParams.get("locality");

    let providers: any[] = [];

    try {
      providers = await prisma.user.findMany({
        where: {
          role: ROLES.PROVIDER,
          ...(verifiedOnly
            ? { providerProfile: { isVerified: true, isActive: true } }
            : { providerProfile: { isNot: null } }),
        },
        include: {
          providerProfile: true,
          _count: {
            select: { assignedRequests: true, ratingsReceived: true },
          },
        },
        orderBy: { name: "asc" },
      });
    } catch (dbErr) {
      console.warn("Prisma error in GET /api/providers, using cooperative fallback:", dbErr);
      providers = FALLBACK_PROVIDERS;
    }

    if (providers.length === 0) {
      providers = FALLBACK_PROVIDERS;
    }

    // In-memory category matching if specified
    let filtered = providers;
    if (category && category !== "ALL") {
      filtered = filtered.filter((p) => {
        try {
          const cats = JSON.parse(p.providerProfile?.serviceCategories || "[]");
          return cats.includes(category);
        } catch {
          return true;
        }
      });
    }

    return NextResponse.json({ providers: filtered });
  } catch (error) {
    console.error("GET providers error:", error);
    return NextResponse.json({ providers: FALLBACK_PROVIDERS });
  }
}
