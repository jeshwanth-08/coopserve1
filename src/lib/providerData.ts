export type JobStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "ON_THE_WAY"
  | "ARRIVED"
  | "SERVICE_STARTED"
  | "PAUSED"
  | "COMPLETED"
  | "REJECTED";

export interface ProviderJob {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceName: string;
  category: string;
  address: string;
  locality: string;
  city: string;
  date: string;
  timeSlot: string;
  issueDescription: string;
  uploadedPhotos: string[];
  price: number;
  status: JobStatus;
  notes?: string;
  paymentStatus: "PENDING" | "PAID_ONLINE" | "CASH_ON_DELIVERY";
  paymentMethod?: string;
  warranty: string;
  materialsUsed?: { name: string; cost: number; quantity: number }[];
  additionalPaymentRequested?: number;
  serviceProof?: {
    photos: string[];
    technicianNotes: string;
    completedAt: string;
  };
  pausedReason?: string;
  history: { status: JobStatus; timestamp: string; note?: string }[];
}

export interface ProviderEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  monthName: string;
  pendingPayouts: number;
  completedPayouts: number;
  chartData: { day: string; amount: number }[];
  transactions: {
    id: string;
    serviceName: string;
    date: string;
    amount: number;
    status: "COMPLETED" | "PENDING";
    category: string;
  }[];
}

export interface ProviderPerformance {
  avgRating: number;
  totalReviews: number;
  completionRate: number;
  cancellationRate: number;
  jobsCompleted: number;
  repeatCustomerRate: number;
  avgResponseTimeMinutes: number;
  ratingBreakdown: { stars: number; count: number; percentage: number }[];
  monthlyCompletionTrend: { month: string; rate: number }[];
}

export interface ProviderAvailability {
  isOnDuty: boolean;
  workingDays: { day: string; active: boolean }[];
  workingHours: { start: string; end: string };
  breakTime: { start: string; end: string };
  daysOff: string[];
  serviceAreas: { name: string; radiusKm: number; active: boolean }[];
}

export interface ProviderServiceOffered {
  id: string;
  name: string;
  category: string;
  baseLaborRate: number;
  duration: string;
  active: boolean;
}

export interface ProviderDocument {
  id: string;
  title: string;
  type: string;
  issuedBy: string;
  status: "VERIFIED" | "PENDING" | "EXPIRED";
  verifiedDate: string;
  documentNumber: string;
  previewUrl: string;
}

export const INITIAL_PROVIDER_JOBS: ProviderJob[] = [
  {
    id: "JOB-401",
    customerName: "Aarav Mehta",
    customerPhone: "+91 98765 43210",
    serviceName: "AC Jet Foam & Deep Service",
    category: "AC Technician",
    address: "Flat 402, Sunshine Heights, 12th Main Road",
    locality: "Indiranagar",
    city: "Bengaluru",
    date: "Today",
    timeSlot: "10:30 AM",
    issueDescription: "AC making vibration sound and blowing room temperature air.",
    uploadedPhotos: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    ],
    price: 539,
    status: "ON_THE_WAY",
    notes: "Security gate code: #402. Please carry high-pressure jet pump.",
    paymentStatus: "PENDING",
    paymentMethod: "Pay After Service (Cash or UPI)",
    warranty: "30-Day CoopServe Protection Guarantee",
    history: [
      { status: "ASSIGNED", timestamp: "Today, 08:30 AM", note: "Auto-dispatched" },
      { status: "ACCEPTED", timestamp: "Today, 08:45 AM", note: "Accepted by Rahul" },
      { status: "ON_THE_WAY", timestamp: "Today, 09:50 AM", note: "Dispatched from Indiranagar hub" },
    ],
  },
  {
    id: "JOB-402",
    customerName: "Priya Nair",
    customerPhone: "+91 98123 45678",
    serviceName: "Refrigerator Gas Leak & Coil Repair",
    category: "Appliance Repair",
    address: "Villa 12, Palm Grove, 5th Block",
    locality: "Koramangala",
    city: "Bengaluru",
    date: "Today",
    timeSlot: "01:30 PM",
    issueDescription: "Compressor running continuously but fridge not cooling at all.",
    uploadedPhotos: [
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80",
    ],
    price: 799,
    status: "ACCEPTED",
    notes: "Double-door Samsung 320L inverter model.",
    paymentStatus: "PAID_ONLINE",
    paymentMethod: "CoopPay UPI Pre-authorized",
    warranty: "60-Day Compressor Warranty",
    history: [
      { status: "ASSIGNED", timestamp: "Today, 09:10 AM" },
      { status: "ACCEPTED", timestamp: "Today, 09:25 AM", note: "Accepted by Rahul" },
    ],
  },
  {
    id: "JOB-403",
    customerName: "Karthik Sundaram",
    customerPhone: "+91 99001 22334",
    serviceName: "Split AC PCB Circuit Board Check",
    category: "AC Technician",
    address: "Plot 88, 14th Cross, Sector 4",
    locality: "HSR Layout",
    city: "Bengaluru",
    date: "Today",
    timeSlot: "04:00 PM",
    issueDescription: "Error code E4 blinking continuously on the digital display panel.",
    uploadedPhotos: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=600&q=80",
    ],
    price: 899,
    status: "ASSIGNED",
    notes: "Voltas 1.5 Ton 5-star inverter unit.",
    paymentStatus: "PENDING",
    paymentMethod: "UPI on Completion",
    warranty: "30-Day CoopServe Warranty",
    history: [
      { status: "ASSIGNED", timestamp: "Today, 10:00 AM", note: "Awaiting pro acceptance" },
    ],
  },
  {
    id: "JOB-404",
    customerName: "Sneha Rao",
    customerPhone: "+91 97400 55667",
    serviceName: "Washing Machine Drum Alignment",
    category: "Appliance Repair",
    address: "Apt 203, Green Terrace, Defence Colony",
    locality: "Indiranagar",
    city: "Bengaluru",
    date: "Today",
    timeSlot: "09:00 AM",
    issueDescription: "Loud thumping sound during final spin cycle.",
    uploadedPhotos: [
      "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80",
    ],
    price: 499,
    status: "COMPLETED",
    notes: "LG 7kg Front Loader. Replaced drum damper shock absorbers.",
    paymentStatus: "PAID_ONLINE",
    paymentMethod: "Paid via UPI (₹499)",
    warranty: "90-Day Parts & Labor Guarantee",
    materialsUsed: [
      { name: "LG Frontload Shock Absorber Set", cost: 350, quantity: 2 },
    ],
    serviceProof: {
      photos: [
        "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80",
      ],
      technicianNotes: "Drum balance restored. Test spin completed at 1200 RPM with zero vibration.",
      completedAt: "Today, 10:15 AM",
    },
    history: [
      { status: "ASSIGNED", timestamp: "Today, 07:30 AM" },
      { status: "ACCEPTED", timestamp: "Today, 07:45 AM" },
      { status: "ON_THE_WAY", timestamp: "Today, 08:30 AM" },
      { status: "ARRIVED", timestamp: "Today, 08:50 AM" },
      { status: "SERVICE_STARTED", timestamp: "Today, 09:00 AM" },
      { status: "COMPLETED", timestamp: "Today, 10:15 AM", note: "Service resolved successfully" },
    ],
  },
  {
    id: "JOB-405",
    customerName: "Rohan Kapoor",
    customerPhone: "+91 98888 11223",
    serviceName: "AC Gas Charging & Leak Fix",
    category: "AC Technician",
    address: "Tower B, Penthouse 18, Prestige Oasis",
    locality: "Whitefield",
    city: "Bengaluru",
    date: "Tomorrow",
    timeSlot: "11:00 AM",
    issueDescription: "Refrigerant level low; cooling coil frosting up.",
    uploadedPhotos: [],
    price: 1499,
    status: "ACCEPTED",
    notes: "Please call 30 minutes before arrival.",
    paymentStatus: "PENDING",
    warranty: "60-Day Cooling Guarantee",
    history: [
      { status: "ASSIGNED", timestamp: "Yesterday, 04:00 PM" },
      { status: "ACCEPTED", timestamp: "Yesterday, 05:30 PM" },
    ],
  },
  {
    id: "JOB-406",
    customerName: "Meera Krishnan",
    customerPhone: "+91 97777 33445",
    serviceName: "AC Master Jet Servicing (2 Units)",
    category: "AC Technician",
    address: "House 45, 2nd Main, Indiranagar",
    locality: "Indiranagar",
    city: "Bengaluru",
    date: "Tomorrow",
    timeSlot: "03:00 PM",
    issueDescription: "Annual pre-monsoon jet cleaning for living room & master bedroom ACs.",
    uploadedPhotos: [],
    price: 998,
    status: "ACCEPTED",
    notes: "Daikin Inverter Split Units.",
    paymentStatus: "PENDING",
    warranty: "30-Day CoopServe Warranty",
    history: [
      { status: "ASSIGNED", timestamp: "Yesterday, 06:15 PM" },
      { status: "ACCEPTED", timestamp: "Yesterday, 06:30 PM" },
    ],
  },
];

export const INITIAL_EARNINGS: ProviderEarnings = {
  today: 2197,
  thisWeek: 11450,
  thisMonth: 48250,
  monthName: "September earnings",
  pendingPayouts: 3840,
  completedPayouts: 44410,
  chartData: [
    { day: "Mon", amount: 1850 },
    { day: "Tue", amount: 2400 },
    { day: "Wed", amount: 1950 },
    { day: "Thu", amount: 2800 },
    { day: "Fri", amount: 3100 },
    { day: "Sat", amount: 3950 },
    { day: "Sun", amount: 2197 },
  ],
  transactions: [
    {
      id: "TXN-801",
      serviceName: "AC Service",
      date: "Today, 10:15 AM",
      amount: 499,
      status: "COMPLETED",
      category: "AC Technician",
    },
    {
      id: "TXN-802",
      serviceName: "Deep Cleaning",
      date: "Yesterday, 04:30 PM",
      amount: 1299,
      status: "COMPLETED",
      category: "House Cleaning",
    },
    {
      id: "TXN-803",
      serviceName: "Plumbing",
      date: "06 Sep 2026",
      amount: 399,
      status: "COMPLETED",
      category: "Plumber",
    },
    {
      id: "TXN-804",
      serviceName: "AC PCB Diagnostic & Capacitor",
      date: "05 Sep 2026",
      amount: 850,
      status: "COMPLETED",
      category: "AC Technician",
    },
    {
      id: "TXN-805",
      serviceName: "Gas Top-Up R32",
      date: "04 Sep 2026",
      amount: 1450,
      status: "COMPLETED",
      category: "AC Technician",
    },
    {
      id: "TXN-806",
      serviceName: "Washing Machine Damper Replacement",
      date: "03 Sep 2026",
      amount: 849,
      status: "COMPLETED",
      category: "Appliance Repair",
    },
  ],
};

export const INITIAL_PERFORMANCE: ProviderPerformance = {
  avgRating: 4.9,
  totalReviews: 420,
  completionRate: 98,
  cancellationRate: 1.2,
  jobsCompleted: 342,
  repeatCustomerRate: 44,
  avgResponseTimeMinutes: 8,
  ratingBreakdown: [
    { stars: 5, count: 382, percentage: 91 },
    { stars: 4, count: 32, percentage: 7 },
    { stars: 3, count: 4, percentage: 1 },
    { stars: 2, count: 1, percentage: 0.5 },
    { stars: 1, count: 1, percentage: 0.5 },
  ],
  monthlyCompletionTrend: [
    { month: "May", rate: 96 },
    { month: "Jun", rate: 97 },
    { month: "Jul", rate: 98 },
    { month: "Aug", rate: 99 },
    { month: "Sep", rate: 98 },
  ],
};

export const INITIAL_AVAILABILITY: ProviderAvailability = {
  isOnDuty: true,
  workingDays: [
    { day: "Monday", active: true },
    { day: "Tuesday", active: true },
    { day: "Wednesday", active: true },
    { day: "Thursday", active: true },
    { day: "Friday", active: true },
    { day: "Saturday", active: true },
    { day: "Sunday", active: false },
  ],
  workingHours: { start: "08:00 AM", end: "08:00 PM" },
  breakTime: { start: "01:00 PM", end: "02:00 PM" },
  daysOff: ["2026-09-18", "2026-09-25"],
  serviceAreas: [
    { name: "Indiranagar", radiusKm: 6, active: true },
    { name: "Koramangala", radiusKm: 8, active: true },
    { name: "HSR Layout", radiusKm: 7, active: true },
    { name: "Whitefield", radiusKm: 12, active: true },
    { name: "Domlur", radiusKm: 5, active: true },
  ],
};

export const INITIAL_SERVICES: ProviderServiceOffered[] = [
  {
    id: "srv-ac-1",
    name: "Split AC Jet Service & Filter Wash",
    category: "AC Technician",
    baseLaborRate: 449,
    duration: "45 mins",
    active: true,
  },
  {
    id: "srv-ac-2",
    name: "AC PCB Board Diagnostic & Repair",
    category: "AC Technician",
    baseLaborRate: 699,
    duration: "60 mins",
    active: true,
  },
  {
    id: "srv-ac-3",
    name: "Refrigerant Gas Leak Detection & Top-Up",
    category: "AC Technician",
    baseLaborRate: 1199,
    duration: "90 mins",
    active: true,
  },
  {
    id: "srv-ac-4",
    name: "Window AC Deep Overhaul",
    category: "AC Technician",
    baseLaborRate: 549,
    duration: "60 mins",
    active: true,
  },
  {
    id: "srv-app-1",
    name: "Refrigerator Compressor & Thermostat Check",
    category: "Appliance Repair",
    baseLaborRate: 499,
    duration: "45 mins",
    active: true,
  },
];

export const INITIAL_DOCUMENTS: ProviderDocument[] = [
  {
    id: "doc-1",
    title: "Government Aadhaar Verification",
    type: "National ID Proof",
    issuedBy: "UIDAI (Govt. of India)",
    status: "VERIFIED",
    verifiedDate: "12 Jan 2024",
    documentNumber: "XXXX-XXXX-8921",
    previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "doc-2",
    title: "NSDC Level 4 Master HVAC Certificate",
    type: "Trade License & Skill Cert",
    issuedBy: "National Skill Development Corporation",
    status: "VERIFIED",
    verifiedDate: "05 Mar 2023",
    documentNumber: "NSDC-AC-88491",
    previewUrl: "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "doc-3",
    title: "Police Clearance Background Check",
    type: "Safety Verification",
    issuedBy: "Bengaluru City Police Crime Branch",
    status: "VERIFIED",
    verifiedDate: "10 Feb 2026",
    documentNumber: "BCP-CLR-2026-904",
    previewUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80",
  },
];

export const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    customerName: "Aarav Mehta",
    date: "Yesterday",
    rating: 5,
    service: "AC Jet Servicing",
    comment: "Rahul was very punctual and professional. Used proper protective masking sheets and deep jet cleaning. AC is cooling like brand new!",
    providerReply: "Thank you Aarav! Happy to serve you. Reach out anytime if you need assistance.",
  },
  {
    id: "rev-2",
    customerName: "Kavita Deshmukh",
    date: "05 Sep 2026",
    rating: 5,
    service: "AC Gas Leakage Fix",
    comment: "Detected the copper pipe flare joint micro-leak quickly where previous technicians failed. Genuine pricing and honest explanation.",
    providerReply: "Glad we could fix it for you Kavita! Enjoy the cool comfort.",
  },
  {
    id: "rev-3",
    customerName: "Vikram Singhania",
    date: "02 Sep 2026",
    rating: 4,
    service: "Washing Machine Noise Check",
    comment: "Resolved the drum thumping issue smoothly. Took slightly longer due to traffic in Koramangala, but work quality is top-notch.",
  },
];

// Helper: State Transition Validation
export const VALID_STATUS_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  ASSIGNED: ["ACCEPTED", "REJECTED"],
  ACCEPTED: ["ON_THE_WAY", "REJECTED"],
  ON_THE_WAY: ["ARRIVED"],
  ARRIVED: ["SERVICE_STARTED"],
  SERVICE_STARTED: ["PAUSED", "COMPLETED"],
  PAUSED: ["SERVICE_STARTED"],
  COMPLETED: [],
  REJECTED: [],
};

export function canTransitionStatus(from: JobStatus, to: JobStatus): boolean {
  return VALID_STATUS_TRANSITIONS[from]?.includes(to) || false;
}

// Storage helpers
export function getProviderJobs(): ProviderJob[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("coop_provider_jobs");
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return INITIAL_PROVIDER_JOBS;
}

export function saveProviderJobs(jobs: ProviderJob[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("coop_provider_jobs", JSON.stringify(jobs));
    } catch {}
  }
}

export function getProviderJobById(id: string): ProviderJob | null {
  const jobs = getProviderJobs();
  return jobs.find((j) => j.id === id) || INITIAL_PROVIDER_JOBS[0];
}
