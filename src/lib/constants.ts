export const ROLES = {
  MEMBER: "MEMBER",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const REQUEST_STATUS = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  ACCEPTED: "ACCEPTED",
  ON_THE_WAY: "ON_THE_WAY",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  DECLINED: "DECLINED",
  CANCELLED: "CANCELLED",
} as const;

export type RequestStatus = typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];

export const VISIBILITY = {
  PERSONAL: "PERSONAL",
  COMMUNITY: "COMMUNITY",
} as const;

export type Visibility = typeof VISIBILITY[keyof typeof VISIBILITY];

export const CATEGORIES = [
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Cleaner",
  "Gardener",
  "Appliance Repair",
  "HVAC & AC Technician",
  "Women's Salon & Spa",
  "Pest Control",
  "Locksmith",
  "Masonry & Concrete",
  "Roofing & Waterproofing",
] as const;

export const LOCALITIES = [
  "Greenwood Heights",
  "Riverside Society",
  "Oakwood Valley",
  "Sunrise Enclave",
  "Palm Grove Colony",
] as const;

export const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; bg: string; text: string; border: string; step: number }
> = {
  PENDING: {
    label: "Pending Assignment",
    bg: "bg-amber-50 dark:bg-amber-950/40",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
    step: 1,
  },
  ASSIGNED: {
    label: "Provider Assigned",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
    step: 2,
  },
  ACCEPTED: {
    label: "Accepted by Provider",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
    step: 3,
  },
  ON_THE_WAY: {
    label: "Provider On The Way",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
    step: 4,
  },
  IN_PROGRESS: {
    label: "Work In Progress",
    bg: "bg-sky-50 dark:bg-sky-950/40",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-800",
    step: 5,
  },
  RESOLVED: {
    label: "Resolved & Completed",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-800",
    step: 6,
  },
  DECLINED: {
    label: "Declined by Provider",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
    step: 0,
  },
  CANCELLED: {
    label: "Cancelled by Member",
    bg: "bg-rose-50 dark:bg-rose-950/40",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
    step: 0,
  },
};
