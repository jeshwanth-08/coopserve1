import { prisma } from "@/lib/prisma";
import { REQUEST_STATUS, ROLES } from "@/lib/constants";
import { createNotification } from "@/lib/notifications";

// Coordinate approximations for Cooperative Localities (latitude, longitude)
export const LOCALITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Greenwood Heights": { lat: 12.9716, lng: 77.6412 },
  "Riverside Society": { lat: 12.9554, lng: 77.6089 },
  "Oakwood Valley": { lat: 12.9352, lng: 77.6245 },
  "Sunrise Enclave": { lat: 12.9856, lng: 77.6582 },
  "Palm Grove Colony": { lat: 12.9234, lng: 77.6741 },
  // Urban marketplace sectors
  "Indiranagar": { lat: 12.9784, lng: 77.6408 },
  "Koramangala": { lat: 12.9352, lng: 77.6245 },
  "HSR Layout": { lat: 12.9121, lng: 77.6446 },
  "Whitefield": { lat: 12.9698, lng: 77.7500 },
  "Jayanagar": { lat: 12.9308, lng: 77.5838 },
};

/**
 * Calculates straight-line distance in kilometers using the Haversine formula.
 * Gracefully handles unknown or matching locality strings.
 */
export function calculateDistanceKm(
  customerLocality: string,
  providerLocality: string,
  providerServiceArea?: string
): number {
  if (!customerLocality || !providerLocality) return 5.0;

  const normCustomer = customerLocality.toLowerCase().trim();
  const normProvider = providerLocality.toLowerCase().trim();
  const normServiceArea = (providerServiceArea || "").toLowerCase().trim();

  // 1. Exact same locality
  if (normCustomer === normProvider) {
    return 0.5; // Walking distance / immediate neighborhood (~500m)
  }

  // 2. Provider's explicit service area includes customer's locality or "all"
  if (normServiceArea.includes(normCustomer) || normServiceArea.includes("all")) {
    return 1.5; // Priority service area coverage
  }

  // 3. Known coordinate calculation
  const cCoord = LOCALITY_COORDINATES[customerLocality];
  const pCoord = LOCALITY_COORDINATES[providerLocality];

  if (cCoord && pCoord) {
    const R = 6371; // Earth's radius in km
    const dLat = ((pCoord.lat - cCoord.lat) * Math.PI) / 180;
    const dLng = ((pCoord.lng - cCoord.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((cCoord.lat * Math.PI) / 180) *
        Math.cos((pCoord.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  // 4. Default fallback distance
  return 4.0;
}

/**
 * Checks whether a provider is eligible to fulfill the requested category.
 * Matches category name against serviceCategories JSON and specialized skills.
 */
export function isProviderEligible(provider: any, requestedCategory: string): boolean {
  if (!requestedCategory) return true;
  const profile = provider.providerProfile;
  if (!profile) return false;

  const target = requestedCategory.toLowerCase().trim();

  // Category alias mappings for robust natural matching
  const categoryAliases: Record<string, string[]> = {
    "ac technician": ["hvac & ac technician", "ac repair", "appliance repair", "air conditioner"],
    "hvac & ac technician": ["ac technician", "ac repair", "air conditioner", "hvac"],
    "water purifier / ro filter": ["appliance repair", "plumber"],
    "appliance repair": ["electrician", "ro", "water purifier", "refrigeration"],
    "deep cleaning": ["cleaner", "cleaning"],
    "cleaner": ["deep cleaning", "sanitization", "cleaning"],
  };

  const aliases = categoryAliases[target] || [];

  // 1. Check serviceCategories JSON
  try {
    const cats: string[] = JSON.parse(profile.serviceCategories || "[]");
    for (const cat of cats) {
      const c = cat.toLowerCase();
      if (c === target || c.includes(target) || target.includes(c)) return true;
      if (aliases.some((a) => c.includes(a) || a.includes(c))) return true;
    }
  } catch {}

  // 2. Check skills JSON
  try {
    const skills: string[] = JSON.parse(profile.skills || "[]");
    for (const skill of skills) {
      const s = skill.toLowerCase();
      if (s.includes(target) || target.includes(s)) return true;
      if (aliases.some((a) => s.includes(a) || a.includes(s))) return true;
    }
  } catch {}

  return false;
}

/**
 * Checks whether a provider is active and available for assignments.
 * Admin toggle `isActive` controls this.
 */
export function isProviderAvailable(provider: any): boolean {
  if (provider.role !== ROLES.PROVIDER) return false;
  const profile = provider.providerProfile;
  if (!profile) return false;
  // If provider has been explicitly marked inactive by admin, they cannot be assigned
  if (profile.isActive === false) return false;
  return true;
}

export interface ProviderSelectionResult {
  provider: any | null;
  rule: "CUSTOMER_SELECTED" | "EMERGENCY_AUTO_DISPATCH" | "NORMAL_AUTO_DISPATCH" | "NO_PROVIDER_AVAILABLE";
  reason: string;
}

/**
 * Core Automated Provider Assignment Engine
 * Evaluates candidates according to strict priority order:
 *
 * PRIORITY 1: Customer-Selected Provider (if active & eligible)
 * PRIORITY 2: Emergency Request -> Nearest + highest-rated eligible available provider
 * PRIORITY 3: Normal Request -> Highest-rated eligible available provider (distance tie-breaker)
 * FALLBACK: No provider available -> Return null (leaves request PENDING for admin manual assignment)
 */
export async function selectBestProvider({
  category,
  locality,
  isEmergency,
  selectedProviderId,
}: {
  category: string;
  locality: string;
  isEmergency: boolean;
  selectedProviderId?: string | null;
}): Promise<ProviderSelectionResult> {
  // Fetch all active providers with profile from DB
  let allProviders: any[] = [];
  try {
    const rawProviders = await prisma.user.findMany({
      where: {
        role: ROLES.PROVIDER,
        providerProfile: {
          isNot: null,
        },
      },
      include: {
        providerProfile: true,
      },
    });
    // Filter active providers
    allProviders = rawProviders.filter((p) => p.providerProfile?.isActive === true);
  } catch (err) {
    console.warn("[Auto-Assign] Failed to query providers from DB, error:", err);
  }

  // =========================================================================
  // PRIORITY 1: Customer-Selected Provider
  // =========================================================================
  if (selectedProviderId) {
    // Find provider by ID, Name, or Slug
    const selected = allProviders.find(
      (p) =>
        p.id === selectedProviderId ||
        p.name.toLowerCase() === selectedProviderId.toLowerCase() ||
        p.email.toLowerCase() === selectedProviderId.toLowerCase()
    );

    if (selected) {
      const active = isProviderAvailable(selected);
      const eligible = isProviderEligible(selected, category);

      if (active && eligible) {
        return {
          provider: selected,
          rule: "CUSTOMER_SELECTED",
          reason: `Assigned customer-selected specialist: ${selected.name}`,
        };
      } else {
        console.warn(
          `[Auto-Assign] Customer-selected provider ${selected.name} is ineligible or unavailable (active=${active}, eligible=${eligible}). Falling back to automatic rules.`
        );
      }
    } else {
      console.warn(
        `[Auto-Assign] Selected provider ID '${selectedProviderId}' not found in active pool. Falling back to automatic rules.`
      );
    }
  }

  // Filter pool for eligible specialists
  const eligibleProviders = allProviders.filter((p) => {
    return isProviderAvailable(p) && isProviderEligible(p, category);
  });

  if (eligibleProviders.length === 0) {
    return {
      provider: null,
      rule: "NO_PROVIDER_AVAILABLE",
      reason: `No active specialist currently eligible for ${category}. Request preserved as PENDING for coordinator dispatch.`,
    };
  }

  // Calculate distance for all eligible providers
  const candidates = eligibleProviders.map((p) => {
    const dist = calculateDistanceKm(
      locality,
      p.locality || "Greenwood Heights",
      p.providerProfile?.serviceArea
    );
    const rating = p.providerProfile?.avgRating || 0.0;
    const isVerified = p.providerProfile?.isVerified ? 1 : 0;
    return {
      provider: p,
      distanceKm: dist,
      rating,
      isVerified,
    };
  });

  // =========================================================================
  // PRIORITY 2: Emergency Request Without Selection
  // Nearest available provider with the highest rating
  // =========================================================================
  if (isEmergency) {
    candidates.sort((a, b) => {
      // Primary: geographic proximity.
      // If distance difference is greater than 2 km, closer provider wins for fast emergency dispatch.
      const distDiff = a.distanceKm - b.distanceKm;
      if (Math.abs(distDiff) > 2.0) {
        return distDiff;
      }
      // Within comparable distance (<= 2 km), highest rating takes priority
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      // Tie breaker: verification status then closer distance
      if (b.isVerified !== a.isVerified) {
        return b.isVerified - a.isVerified;
      }
      return a.distanceKm - b.distanceKm;
    });

    const best = candidates[0];
    return {
      provider: best.provider,
      rule: "EMERGENCY_AUTO_DISPATCH",
      reason: `Emergency Auto-Dispatch: ${best.provider.name} assigned (${best.distanceKm} km away in ${best.provider.locality}, ★${best.rating.toFixed(1)})`,
    };
  }

  // =========================================================================
  // PRIORITY 3: Normal Request Without Selection
  // Highest-rated available provider (distance as secondary tie-breaker)
  // =========================================================================
  candidates.sort((a, b) => {
    // Primary: Provider rating
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    // Secondary tie-breaker: verification status
    if (b.isVerified !== a.isVerified) {
      return b.isVerified - a.isVerified;
    }
    // Tertiary tie-breaker: distance from customer
    return a.distanceKm - b.distanceKm;
  });

  const best = candidates[0];
  return {
    provider: best.provider,
    rule: "NORMAL_AUTO_DISPATCH",
    reason: `Auto-Dispatch: ${best.provider.name} assigned (★${best.rating.toFixed(1)}, ${best.distanceKm} km away in ${best.provider.locality})`,
  };
}

/**
 * Executes automatic provider assignment for a given service request.
 * Updates the database, writes statusHistory audit trail, and notifies both parties.
 * Safe against duplicate assignments.
 */
export async function autoAssignProvider(
  requestId: string,
  selectedProviderId?: string | null
): Promise<{
  success: boolean;
  assigned: boolean;
  provider?: any;
  rule: string;
  reason: string;
}> {
  try {
    // 1. Fetch current request state
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: {
        member: { select: { id: true, name: true, locality: true } },
      },
    });

    if (!request) {
      return {
        success: false,
        assigned: false,
        rule: "NO_PROVIDER_AVAILABLE",
        reason: "Request not found",
      };
    }

    // Guard: Prevent double-assignment
    if (request.assignedProviderId || request.status !== REQUEST_STATUS.PENDING) {
      return {
        success: true,
        assigned: true,
        rule: "ALREADY_ASSIGNED",
        reason: `Request already assigned to provider ${request.assignedProviderId}`,
      };
    }

    // 2. Determine best provider using priority rules
    const decision = await selectBestProvider({
      category: request.category,
      locality: request.locality,
      isEmergency: request.isEmergency,
      selectedProviderId,
    });

    // 3. Fallback handling: If no provider available, leave request in PENDING state
    if (!decision.provider) {
      await prisma.statusHistory.create({
        data: {
          requestId: request.id,
          status: REQUEST_STATUS.PENDING,
          changedById: request.memberId,
          note: `[Auto-Dispatch Notice] ${decision.reason}`,
        },
      });

      return {
        success: true,
        assigned: false,
        rule: decision.rule,
        reason: decision.reason,
      };
    }

    const assignedPro = decision.provider;

    // 4. Update request status to ASSIGNED
    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        assignedProviderId: assignedPro.id,
        status: REQUEST_STATUS.ASSIGNED,
      },
    });

    // 5. Create StatusHistory entry documenting the assignment rule and reason
    await prisma.statusHistory.create({
      data: {
        requestId: request.id,
        status: REQUEST_STATUS.ASSIGNED,
        changedById: request.memberId,
        note: `[Auto-Dispatch] ${decision.reason}`,
      },
    });

    // 6. Notify provider of automatic dispatch
    await createNotification({
      userId: assignedPro.id,
      type: "ASSIGNED",
      message: `${request.isEmergency ? "[EMERGENCY] " : ""}New job automatically assigned: ${request.category} at ${request.address} (${request.locality}).`,
      link: `/provider/requests/${request.id}`,
    });

    // 7. Notify customer of assigned specialist
    await createNotification({
      userId: request.memberId,
      type: "STATUS_CHANGE",
      message: `Specialist ${assignedPro.name} has been assigned to your ${request.category} request.`,
      link: `/member/requests/${request.id}`,
    });

    return {
      success: true,
      assigned: true,
      provider: assignedPro,
      rule: decision.rule,
      reason: decision.reason,
    };
  } catch (error) {
    console.error("[Auto-Assign] Error during provider assignment execution:", error);
    return {
      success: false,
      assigned: false,
      rule: "ERROR",
      reason: "Unexpected error during automatic assignment",
    };
  }
}
