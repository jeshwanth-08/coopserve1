export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROVIDER" | "MEMBER";
  locality: string;
  phone?: string;
  address?: string;
  password?: string;
  providerProfile?: {
    isVerified: boolean;
    isActive: boolean;
    avgRating: number;
    totalReviews: number;
    skills: string[];
    categories: string[];
    serviceArea: string;
  };
}

export const MOCK_USERS: Record<string, MockUser> = {
  "admin@coop.org": {
    id: "user-admin-eleanor",
    name: "Eleanor Vance (Coop Coordinator)",
    email: "admin@coop.org",
    role: "ADMIN",
    locality: "Greenwood Heights",
    phone: "+1 555-0100",
    address: "Suite 400, Central Cooperative HQ",
    password: "admin123",
  },
  "provider1@coop.org": {
    id: "user-provider-marcus",
    name: "Marcus Thorne",
    email: "provider1@coop.org",
    role: "PROVIDER",
    locality: "Greenwood Heights",
    phone: "+1 555-0201",
    address: "128 Artisan Way",
    password: "password123",
    providerProfile: {
      isVerified: true,
      isActive: true,
      avgRating: 4.9,
      totalReviews: 18,
      skills: ["Master Electrician", "Rewiring", "Circuit Breakers", "Solar Panel Hookups"],
      categories: ["Electrician", "Appliance Repair"],
      serviceArea: "Greenwood Heights & East",
    },
  },
  "rahul.ac@coop.org": {
    id: "user-provider-rahul",
    name: "Rahul Sharma",
    email: "rahul.ac@coop.org",
    role: "PROVIDER",
    locality: "Koramangala",
    phone: "+91 98450 11223",
    address: "7th Block, Koramangala",
    password: "password123",
    providerProfile: {
      isVerified: true,
      isActive: true,
      avgRating: 4.9,
      totalReviews: 28,
      skills: ["AC Deep Jet Cleaning", "Gas Charging", "Compressor Diagnostics", "Inverter AC Servicing"],
      categories: ["AC Technician", "Appliance Repair"],
      serviceArea: "Koramangala & HSR",
    },
  },
  "provider2@coop.org": {
    id: "user-provider-david",
    name: "David Chen",
    email: "provider2@coop.org",
    role: "PROVIDER",
    locality: "Riverside Society",
    phone: "+1 555-0202",
    address: "44 River Road",
    password: "password123",
    providerProfile: {
      isVerified: true,
      isActive: true,
      avgRating: 4.8,
      totalReviews: 14,
      skills: ["Master Plumbing", "Drain Snaking", "Water Heaters", "Pipe Leak Detection"],
      categories: ["Plumber"],
      serviceArea: "Riverside Society",
    },
  },
  "member1@coop.org": {
    id: "user-member-alice",
    name: "Alice Henderson",
    email: "member1@coop.org",
    role: "MEMBER",
    locality: "Greenwood Heights",
    phone: "+1 555-0301",
    address: "Apartment 4B, Greenwood Heights",
    password: "password123",
  },
  "member5@coop.org": {
    id: "user-member-elena",
    name: "Elena Rostova",
    email: "member5@coop.org",
    role: "MEMBER",
    locality: "Riverside Society",
    phone: "+1 555-0305",
    address: "Villa 12, Riverside Society",
    password: "password123",
  },
};

export interface MockServiceRequest {
  id: string;
  category: string;
  description: string;
  status: "PENDING" | "ASSIGNED" | "ACCEPTED" | "ON_THE_WAY" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  isEmergency: boolean;
  visibility: "PERSONAL" | "COMMUNITY";
  locality: string;
  address: string;
  memberId: string;
  assignedProviderId?: string;
  createdAt: string;
  completionNotes?: string;
  member?: { id: string; name: string; phone: string; locality: string };
  assignedProvider?: { id: string; name: string; phone: string };
  rating?: { stars: number; review?: string };
}

export let MOCK_REQUESTS: MockServiceRequest[] = [
  {
    id: "req-001",
    category: "Electrician",
    description: "Main circuit breaker keeps tripping when AC is turned on. Need immediate specialist inspection.",
    status: "ASSIGNED",
    isEmergency: true,
    visibility: "PERSONAL",
    locality: "Greenwood Heights",
    address: "Apartment 4B, Greenwood Heights",
    memberId: "user-member-alice",
    assignedProviderId: "user-provider-marcus",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    member: { id: "user-member-alice", name: "Alice Henderson", phone: "+1 555-0301", locality: "Greenwood Heights" },
    assignedProvider: { id: "user-provider-marcus", name: "Marcus Thorne", phone: "+1 555-0201" },
  },
  {
    id: "req-002",
    category: "AC Technician",
    description: "Seasonal AC deep power jet cleaning and coil check before summer heat.",
    status: "IN_PROGRESS",
    isEmergency: false,
    visibility: "PERSONAL",
    locality: "Greenwood Heights",
    address: "Apartment 4B, Greenwood Heights",
    memberId: "user-member-alice",
    assignedProviderId: "user-provider-marcus",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    member: { id: "user-member-alice", name: "Alice Henderson", phone: "+1 555-0301", locality: "Greenwood Heights" },
    assignedProvider: { id: "user-provider-marcus", name: "Marcus Thorne", phone: "+1 555-0201" },
  },
  {
    id: "req-003",
    category: "Plumber",
    description: "Bathroom sink faucet cartridge replacement and high pressure flush.",
    status: "RESOLVED",
    isEmergency: false,
    visibility: "PERSONAL",
    locality: "Greenwood Heights",
    address: "Apartment 4B, Greenwood Heights",
    memberId: "user-member-alice",
    assignedProviderId: "user-provider-david",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    completionNotes: "Replaced ceramic disc cartridge and tested water flow under 3.5 bar pressure. Certified leak-free.",
    member: { id: "user-member-alice", name: "Alice Henderson", phone: "+1 555-0301", locality: "Greenwood Heights" },
    assignedProvider: { id: "user-provider-david", name: "David Chen", phone: "+1 555-0202" },
    rating: { stars: 5, review: "Arrived right on time and fixed the leak cleanly!" },
  },
  {
    id: "req-004",
    category: "Appliance Repair",
    description: "Refrigerator condenser fan humming loudly in kitchen.",
    status: "ACCEPTED",
    isEmergency: false,
    visibility: "PERSONAL",
    locality: "Greenwood Heights",
    address: "Flat 2A, Greenwood Heights",
    memberId: "user-member-elena",
    assignedProviderId: "user-provider-marcus",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    member: { id: "user-member-elena", name: "Elena Rostova", phone: "+1 555-0305", locality: "Greenwood Heights" },
    assignedProvider: { id: "user-provider-marcus", name: "Marcus Thorne", phone: "+1 555-0201" },
  },
  {
    id: "req-005",
    category: "Electrician",
    description: "Community hallway light fixture failure near elevator lobby.",
    status: "PENDING",
    isEmergency: false,
    visibility: "COMMUNITY",
    locality: "Greenwood Heights",
    address: "Central Elevator Lobby, Block B",
    memberId: "user-member-alice",
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    member: { id: "user-member-alice", name: "Alice Henderson", phone: "+1 555-0301", locality: "Greenwood Heights" },
  },
];
