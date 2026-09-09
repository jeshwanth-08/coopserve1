import { prisma } from "@/lib/prisma";

export interface SocietyPoolItem {
  id: string;
  code: string;
  societyName: string;
  locality: string;
  category: string;
  serviceWindow: string;
  date: string;
  timeSlot: string;
  status: "OPEN" | "FULL" | "SCHEDULED" | "COMPLETED" | "CANCELLED";
  maxCapacity: number;
  memberCount: number;
  benefits: string[];
}

export const INITIAL_SEEDED_POOLS: SocietyPoolItem[] = [
  {
    id: "pool-prestige-ac",
    code: "AC-SAT-15",
    societyName: "Prestige Ozone",
    locality: "Indiranagar",
    category: "HVAC & AC Technician",
    serviceWindow: "Saturday Morning (10:00 AM - 1:00 PM)",
    date: "Saturday",
    timeSlot: "10:30 AM",
    status: "OPEN",
    maxCapacity: 6,
    memberCount: 3,
    benefits: [
      "Same-day coordinated neighborhood dispatch",
      "Zero doorstep convenience fee",
      "Single-trip eco efficiency",
      "Group service priority window",
    ],
  },
  {
    id: "pool-sunshine-clean",
    code: "CLEAN-SUN-18",
    societyName: "Sunshine Heights",
    locality: "Indiranagar",
    category: "Deep Cleaning",
    serviceWindow: "Sunday Afternoon (2:00 PM - 5:00 PM)",
    date: "Sunday",
    timeSlot: "02:00 PM",
    status: "OPEN",
    maxCapacity: 5,
    memberCount: 2,
    benefits: [
      "Dedicated society cleaning crew",
      "Zero doorstep convenience fee",
      "Coordinated Sunday slot",
    ],
  },
  {
    id: "pool-greenwood-elec",
    code: "ELEC-FRI-10",
    societyName: "Greenwood Heights",
    locality: "Greenwood Heights",
    category: "Electrician",
    serviceWindow: "Friday Morning (9:00 AM - 12:00 PM)",
    date: "Friday",
    timeSlot: "10:00 AM",
    status: "OPEN",
    maxCapacity: 6,
    memberCount: 4,
    benefits: [
      "High-priority society transformer & wiring visit",
      "Zero doorstep convenience fee",
      "Shared coordinator supervision",
    ],
  },
  {
    id: "pool-sobha-plumb",
    code: "PLUMB-SAT-22",
    societyName: "Sobha City",
    locality: "Koramangala",
    category: "Plumbing",
    serviceWindow: "Saturday Afternoon (3:00 PM - 6:00 PM)",
    date: "Saturday",
    timeSlot: "03:00 PM",
    status: "OPEN",
    maxCapacity: 6,
    memberCount: 2,
    benefits: [
      "Society water pipeline inspection & repairs",
      "Zero doorstep convenience fee",
      "Group plumbing dispatch",
    ],
  },
];

// Helper to normalize strings for robust society matching
export function normalizeSocietyName(name: string): string {
  return (name || "")
    .toLowerCase()
    .replace(/^(apartment|flat|tower|block|villa|house|no|door|plot)[\s\d,-]*/gi, "")
    .replace(/[^a-z0-9]/g, " ")
    .trim();
}

// Category normalization to match user selections with pool categories
export function areCategoriesCompatible(catA: string, catB: string): boolean {
  if (!catA || !catB) return false;
  const a = catA.toLowerCase().trim();
  const b = catB.toLowerCase().trim();
  if (a === b || a.includes(b) || b.includes(a)) return true;

  const aliases: Record<string, string[]> = {
    ac: ["hvac", "ac technician", "ac repair", "ac servicing", "air conditioner", "appliance", "cooling", "ac"],
    electrician: ["electrical", "wiring", "inverter", "switchboard", "electrician", "electric"],
    plumber: ["plumbing", "pipe", "leak", "drainage", "plumber"],
    cleaning: ["deep cleaning", "home cleaning", "maid", "sanitization", "cleaning"],
    carpenter: ["carpentry", "furniture", "woodwork", "carpenter"],
    painter: ["painting", "whitewash", "painter", "paint"],
  };

  for (const [group, list] of Object.entries(aliases)) {
    const matchA = a.includes(group) || list.some((term) => a.includes(term));
    const matchB = b.includes(group) || list.some((term) => b.includes(term));
    if (matchA && matchB) return true;
  }

  return false;
}

/**
 * Validates whether a customer request can join a given society pool.
 */
export function validatePoolJoining(
  pool: SocietyPoolItem,
  request: { societyName: string; category: string; locality?: string }
): { eligible: boolean; reason?: string } {
  // 1. Status Check
  if (pool.status !== "OPEN") {
    return {
      eligible: false,
      reason: "This pool is currently " + pool.status.toLowerCase() + " and not accepting new residents.",
    };
  }

  // 2. Capacity Check
  if (pool.memberCount >= pool.maxCapacity) {
    return {
      eligible: false,
      reason: "This pool has reached its maximum capacity of " + pool.maxCapacity + " residents.",
    };
  }

  // 3. Society Compatibility Check
  const normRequest = normalizeSocietyName(request.societyName);
  const normPool = normalizeSocietyName(pool.societyName);

  if (normRequest && normPool) {
    const isSocietyMatch =
      normRequest.includes(normPool) ||
      normPool.includes(normRequest) ||
      normRequest === normPool;

    if (!isSocietyMatch) {
      return {
        eligible: false,
        reason: "Society Mismatch: Pool " + pool.code + " is strictly for residents of " + pool.societyName + ". Your location is " + (request.societyName || "different") + ".",
      };
    }
  }

  // 4. Service Category Compatibility Check
  if (!areCategoriesCompatible(pool.category, request.category)) {
    return {
      eligible: false,
      reason: "Service Incompatible: Pool " + pool.code + " is dedicated to " + pool.category + ". You requested " + request.category + ".",
    };
  }

  return { eligible: true };
}

/**
 * Fetches all active society pools from DB with fallback to seeded data.
 */
export async function getActiveSocietyPools(filters?: {
  society?: string;
  category?: string;
  locality?: string;
}): Promise<SocietyPoolItem[]> {
  try {
    const where: any = {};
    if (filters?.locality) {
      where.locality = { contains: filters.locality };
    }

    const dbPools = await prisma.societyPool.findMany({
      where,
      include: {
        _count: { select: { requests: true, bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbPools.length > 0) {
      return dbPools.map((p) => {
        const totalJoined = (p._count?.requests || 0) + (p._count?.bookings || 0);
        return {
          id: p.id,
          code: p.code,
          societyName: p.societyName,
          locality: p.locality,
          category: p.category,
          serviceWindow: p.serviceWindow,
          date: p.date || "Upcoming Weekend",
          timeSlot: p.timeSlot || "Morning",
          status: p.status as any,
          maxCapacity: p.maxCapacity,
          memberCount: Math.max(totalJoined, 2),
          benefits: [
            "Coordinated neighborhood dispatch",
            "Zero doorstep convenience fee",
            "Same-day service window",
          ],
        };
      });
    }
  } catch (err) {
    console.warn("[SocietyPool] Prisma read notice, using seeded memory pools:", err);
  }

  // Seeded fallback
  let pools = [...INITIAL_SEEDED_POOLS];

  if (filters?.society) {
    const norm = normalizeSocietyName(filters.society);
    if (norm) {
      const matched = pools.filter((p) => {
        const pNorm = normalizeSocietyName(p.societyName);
        return pNorm.includes(norm) || norm.includes(pNorm);
      });
      if (matched.length > 0) return matched;
    }
  }

  if (filters?.category) {
    const filtered = pools.filter((p) => areCategoriesCompatible(p.category, filters.category!));
    if (filtered.length > 0) return filtered;
  }

  return pools;
}

/**
 * Finds a pool by exact group code.
 */
export async function getPoolByCode(code: string): Promise<SocietyPoolItem | null> {
  const cleanCode = (code || "").trim().toUpperCase();
  if (!cleanCode) return null;

  try {
    const pool = await prisma.societyPool.findUnique({
      where: { code: cleanCode },
      include: {
        _count: { select: { requests: true, bookings: true } },
      },
    });

    if (pool) {
      const totalJoined = (pool._count?.requests || 0) + (pool._count?.bookings || 0);
      return {
        id: pool.id,
        code: pool.code,
        societyName: pool.societyName,
        locality: pool.locality,
        category: pool.category,
        serviceWindow: pool.serviceWindow,
        date: pool.date || "Saturday",
        timeSlot: pool.timeSlot || "10:30 AM",
        status: pool.status as any,
        maxCapacity: pool.maxCapacity,
        memberCount: Math.max(totalJoined, 3),
        benefits: [
          "Same-day coordinated neighborhood dispatch",
          "Zero doorstep convenience fee",
          "Single-trip eco efficiency",
        ],
      };
    }
  } catch (err) {
    console.warn("[SocietyPool] Error querying pool by code:", err);
  }

  return INITIAL_SEEDED_POOLS.find((p) => p.code.toUpperCase() === cleanCode) || null;
}
