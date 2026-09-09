// src/lib/maintenanceScheduler.ts
// Smart Household Maintenance AMC & Revisit Scheduler
// Configurable rule-based scheduling on top of existing completed service history

export interface MaintenanceRule {
  id: string;
  category: string;
  keywords: string[];
  intervalMonths: number;
  seasonalWindowMonths?: number[]; // e.g. [3, 4] for March–April
  serviceName: string;
  serviceId: string;
  reminderHeadline: string;
  reason: string;
  recommendedActionLabel: string;
  amcEligible: boolean;
  defaultProName?: string;
}

export const MAINTENANCE_RULES: MaintenanceRule[] = [
  {
    id: "rule-ro",
    category: "Appliance Repair",
    keywords: ["ro", "water purifier", "filter", "purifier", "tds", "membrane"],
    intervalMonths: 4,
    serviceName: "Water Purifier / RO Filter",
    serviceId: "svc-6",
    reminderHeadline: "Your Water Purifier / RO Filter is due for periodic maintenance.",
    reason: "RO sediment & carbon filter cartridges saturate every 4 months, reducing filtration purity and water flow.",
    recommendedActionLabel: "Book Filter Replacement",
    amcEligible: true,
    defaultProName: "Marcus Thorne",
  },
  {
    id: "rule-ac",
    category: "AC Technician",
    keywords: ["ac", "air conditioner", "split ac", "cooling", "jet", "hvac"],
    intervalMonths: 6,
    seasonalWindowMonths: [3, 4], // March–April pre-summer window
    serviceName: "AC Jet Service",
    serviceId: "svc-5",
    reminderHeadline: "Your AC may be due for servicing.",
    reason: "Coils accumulate dust over winter. A pre-summer power jet cleaning restores 100% cooling and cuts power bills by 20%.",
    recommendedActionLabel: "Book AC Power Jet Service",
    amcEligible: true,
    defaultProName: "Rahul",
  },
  {
    id: "rule-pest",
    category: "Pest Control",
    keywords: ["pest", "cockroach", "termite", "bug", "insect", "ant", "rodent"],
    intervalMonths: 6,
    serviceName: "Pest Control",
    serviceId: "svc-8",
    reminderHeadline: "Your home is due for preventive pest control protection.",
    reason: "Protective chemical barrier baits and drain treatments degrade after 180 days, risking re-infestation.",
    recommendedActionLabel: "Book Pest Retreatment",
    amcEligible: true,
  },
  {
    id: "rule-deep-clean",
    category: "Cleaning",
    keywords: ["clean", "deep clean", "bathroom clean", "kitchen clean", "sofa wash"],
    intervalMonths: 4,
    serviceName: "Full Home Deep Cleaning",
    serviceId: "svc-7",
    reminderHeadline: "Your home is due for a seasonal deep sanitization.",
    reason: "Quarterly high-steam extraction removes deep tile limescale and upholstery allergens.",
    recommendedActionLabel: "Book Deep Cleaning",
    amcEligible: true,
  },
  {
    id: "rule-plumbing",
    category: "Plumber",
    keywords: ["plumber", "pipe", "leak", "tap", "drain", "geyser", "tank"],
    intervalMonths: 6,
    serviceName: "Plumbing & Valve Checkup",
    serviceId: "svc-2",
    reminderHeadline: "Your plumbing and geyser fittings are due for routine inspection.",
    reason: "Hard water creates mineral scale in geyser heating coils and causes slow cartridge leaks.",
    recommendedActionLabel: "Book Plumber Inspection",
    amcEligible: true,
    defaultProName: "David Chen",
  },
  {
    id: "rule-electrical",
    category: "Electrician",
    keywords: ["electrician", "mcb", "wiring", "switchboard", "inverter", "earthing"],
    intervalMonths: 12,
    serviceName: "Electrical & Earthing Safety Audit",
    serviceId: "svc-1",
    reminderHeadline: "Annual electrical distribution and earthing checkup recommended.",
    reason: "Prevents breaker trips and thermal resistance wear across switchboard screw terminals.",
    recommendedActionLabel: "Book Safety Audit",
    amcEligible: true,
    defaultProName: "Marcus Thorne",
  },
];

export interface ScheduledMaintenanceItem {
  id: string;
  ruleId: string;
  serviceName: string;
  serviceId: string;
  lastServiceDate: Date;
  nextReminderDate: Date;
  intervalMonths: number;
  isDue: boolean;
  isOverdue: boolean;
  dueStatus: "DUE_NOW" | "DUE_SOON" | "SCHEDULED";
  reminderHeadline: string;
  reason: string;
  recommendedActionLabel: string;
  bookUrl: string;
  seasonalNote?: string;
  amcEligible: boolean;
}

/**
 * Calculates next maintenance reminders from completed request history.
 * Formula: service completed date + maintenance interval = next reminder date
 * Applies seasonal windows where applicable (e.g. March–April for AC).
 */
export function calculateMaintenanceSchedule(
  completedRequests: any[]
): ScheduledMaintenanceItem[] {
  const scheduleItems: ScheduledMaintenanceItem[] = [];
  const processedRules = new Set<string>();

  const now = new Date();

  // 1. Process from actual completed request history
  for (const req of completedRequests) {
    // Only look at resolved / completed tasks
    const isCompleted =
      req.status === "RESOLVED" ||
      req.status === "CONFIRMED" ||
      Boolean(req.resolvedAt);

    if (!isCompleted) continue;

    const completionDateStr = req.resolvedAt || req.createdAt;
    const completedDate = new Date(completionDateStr);
    if (isNaN(completedDate.getTime())) continue;

    const textToMatch = `${req.category || ""} ${req.description || ""}`.toLowerCase();

    // Find matching rule
    const matchedRule = MAINTENANCE_RULES.find((rule) => {
      if (rule.category.toLowerCase() === (req.category || "").toLowerCase()) {
        return true;
      }
      return rule.keywords.some((kw) => textToMatch.includes(kw));
    });

    if (matchedRule && !processedRules.has(matchedRule.id)) {
      processedRules.add(matchedRule.id);

      const nextDate = calculateNextReminderDate(
        completedDate,
        matchedRule.intervalMonths,
        matchedRule.seasonalWindowMonths
      );

      const diffDays = Math.ceil(
        (nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      let dueStatus: "DUE_NOW" | "DUE_SOON" | "SCHEDULED" = "SCHEDULED";
      if (diffDays <= 0) {
        dueStatus = "DUE_NOW";
      } else if (diffDays <= 30) {
        dueStatus = "DUE_SOON";
      }

      const proParam = matchedRule.defaultProName
        ? `?pro=${encodeURIComponent(matchedRule.defaultProName)}`
        : "";

      scheduleItems.push({
        id: `sched-${req.id || matchedRule.id}`,
        ruleId: matchedRule.id,
        serviceName: matchedRule.serviceName,
        serviceId: matchedRule.serviceId,
        lastServiceDate: completedDate,
        nextReminderDate: nextDate,
        intervalMonths: matchedRule.intervalMonths,
        isDue: dueStatus === "DUE_NOW",
        isOverdue: diffDays < -15,
        dueStatus,
        reminderHeadline: matchedRule.reminderHeadline,
        reason: matchedRule.reason,
        recommendedActionLabel: matchedRule.recommendedActionLabel,
        bookUrl: `/book/${matchedRule.serviceId}${proParam}`,
        seasonalNote: matchedRule.seasonalWindowMonths
          ? "Pre-summer seasonal reminder"
          : undefined,
        amcEligible: matchedRule.amcEligible,
      });
    }
  }

  // 2. If user history has fewer than 2 completed items, provide realistic baseline maintenance tracking
  // so the member can immediately see AC Service and RO Filter reminders (as requested in spec)
  if (!processedRules.has("rule-ac")) {
    const acPastDate = new Date();
    acPastDate.setMonth(acPastDate.getMonth() - 5); // 5 months ago
    const acNext = calculateNextReminderDate(acPastDate, 6, [3, 4]);
    const diff = Math.ceil((acNext.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    scheduleItems.push({
      id: "sched-baseline-ac",
      ruleId: "rule-ac",
      serviceName: "AC Jet Service",
      serviceId: "svc-5",
      lastServiceDate: acPastDate,
      nextReminderDate: acNext,
      intervalMonths: 6,
      isDue: diff <= 0,
      isOverdue: false,
      dueStatus: diff <= 0 ? "DUE_NOW" : diff <= 30 ? "DUE_SOON" : "SCHEDULED",
      reminderHeadline: "Your AC may be due for servicing.",
      reason: "Pre-summer power jet cleaning restores 100% cooling power and cuts electric bills.",
      recommendedActionLabel: "Book AC Power Jet Service",
      bookUrl: "/book/svc-5?pro=Rahul",
      seasonalNote: "Seasonal window: March–April",
      amcEligible: true,
    });
  }

  if (!processedRules.has("rule-ro")) {
    const roPastDate = new Date();
    roPastDate.setMonth(roPastDate.getMonth() - 4); // 4 months ago (due now!)
    const roNext = calculateNextReminderDate(roPastDate, 4);
    const diff = Math.ceil((roNext.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    scheduleItems.push({
      id: "sched-baseline-ro",
      ruleId: "rule-ro",
      serviceName: "Water Purifier / RO Filter",
      serviceId: "svc-6",
      lastServiceDate: roPastDate,
      nextReminderDate: roNext,
      intervalMonths: 4,
      isDue: true,
      isOverdue: false,
      dueStatus: "DUE_NOW",
      reminderHeadline: "Your RO Filter is due for its 4-month replacement.",
      reason: "Carbon and sediment blocks saturate every 120 days, maintaining clean, odor-free drinking water.",
      recommendedActionLabel: "Book Filter Replacement",
      bookUrl: "/book/svc-6?pro=Marcus%20Thorne&prefilled=true&notes=RO+Filter+Replacement",
      amcEligible: true,
    });
  }

  return scheduleItems.sort((a, b) => {
    // Sort by Due Now first, then Due Soon, then Scheduled
    const score = (item: ScheduledMaintenanceItem) =>
      item.dueStatus === "DUE_NOW" ? 0 : item.dueStatus === "DUE_SOON" ? 1 : 2;
    return score(a) - score(b);
  });
}

function calculateNextReminderDate(
  completedDate: Date,
  intervalMonths: number,
  seasonalWindowMonths?: number[]
): Date {
  const nextDate = new Date(completedDate);
  nextDate.setMonth(nextDate.getMonth() + intervalMonths);

  // If seasonal window is defined (e.g. March–April = months 2, 3 in 0-indexed JS Date)
  if (seasonalWindowMonths && seasonalWindowMonths.length > 0) {
    const nextMonthIndex = nextDate.getMonth() + 1; // 1-indexed (1 = Jan, 3 = March)
    if (!seasonalWindowMonths.includes(nextMonthIndex)) {
      // Find the nearest upcoming seasonal window
      const targetMonth = seasonalWindowMonths[0]; // e.g. 3 (March)
      const currentYear = nextDate.getFullYear();
      const seasonalDate = new Date(currentYear, targetMonth - 1, 15);
      if (seasonalDate > completedDate) {
        return seasonalDate;
      }
    }
  }

  return nextDate;
}

export interface AmcPlan {
  id: string;
  name: string;
  tagline: string;
  pricePerYear: number;
  billingFrequency: string;
  savings: string;
  serviceId: string;
  features: string[];
  popular?: boolean;
}

export const COOP_AMC_PLANS: AmcPlan[] = [
  {
    id: "amc-ac",
    name: "CoopCool AC Annual Care",
    tagline: "2 Full Power Jet washes + Free refrigerant gas leakage inspection",
    pricePerYear: 899,
    billingFrequency: "/ year",
    savings: "Save ₹500 compared to individual bookings",
    serviceId: "svc-5",
    features: [
      "2 High-Pressure Jet washes (Pre-summer & Mid-season)",
      "Free gas pressure check & drain pipe flushing",
      "Priority same-day dispatch in peak heat wave",
      "60-day extended repair guarantee",
    ],
    popular: true,
  },
  {
    id: "amc-ro",
    name: "PureWater RO Maintenance Plan",
    tagline: "3 Periodic filter changes & automated TDS drinking water testing",
    pricePerYear: 1199,
    billingFrequency: "/ year",
    savings: "Includes genuine sediment, carbon & post-carbon cartridges",
    serviceId: "svc-6",
    features: [
      "3 On-schedule cartridge replacements (Every 4 months)",
      "Digital TDS & heavy metal testing on every visit",
      "Free booster pump pressure calibration",
      "Zero inspection fees for any mid-year breakdown",
    ],
  },
  {
    id: "amc-home",
    name: "Whole-Home Preventive Shield",
    tagline: "Complete electrical, plumbing & appliance preventive care",
    pricePerYear: 2499,
    billingFrequency: "/ year",
    savings: "All-in-one comprehensive neighborhood cooperative protection",
    serviceId: "svc-1",
    features: [
      "4 Comprehensive quarterly doorstep health checks",
      "Full electrical earthing & MCB thermal audit",
      "Bathroom & kitchen drainage acoustic leak detection",
      "Flat 15% discount on all parts and specialized trades",
    ],
  },
];
