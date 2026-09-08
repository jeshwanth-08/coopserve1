export type AdminBookingStatus =
  | "Pending"
  | "Confirmed"
  | "Assigned"
  | "On the way"
  | "In progress"
  | "Completed"
  | "Cancelled"
  | "Refunded";

export interface AdminBooking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  proName: string;
  serviceName: string;
  category: string;
  date: string;
  timeSlot: string;
  amount: number;
  status: AdminBookingStatus;
  paymentMethod: string;
  paymentStatus: "SUCCESSFUL" | "PENDING" | "FAILED" | "REFUNDED";
  locality: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  locality: string;
  registeredDate: string;
  bookingCount: number;
  totalSpent: number;
  status: "ACTIVE" | "SUSPENDED";
}

export interface AdminProfessional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  skills: string[];
  registeredDate: string;
  jobCount: number;
  rating: number;
  verificationStatus: "VERIFIED" | "PENDING" | "REJECTED";
  status: "ACTIVE" | "ON_DUTY" | "OFF_DUTY" | "SUSPENDED";
}

export interface AdminCoupon {
  id: string;
  code: string;
  description: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  isFirstBookingOnly?: boolean;
}

export interface CouponValidationResult {
  isValid: boolean;
  status: "VALID" | "INVALID" | "EXPIRED" | "MIN_ORDER_NOT_MET" | "ALREADY_USED";
  discountAmount: number;
  message: string;
  coupon?: AdminCoupon;
}

export const ADMIN_METRICS = {
  totalCustomers: 1420,
  activeProfessionals: 84,
  bookingsToday: 38,
  revenue: 284500,
  cancellationRate: 1.8,
  averageRating: 4.8,
  customerSatisfaction: 96,
  weeklyRevenue: [
    { day: "Mon", revenue: 38500 },
    { day: "Tue", revenue: 42000 },
    { day: "Wed", revenue: 36800 },
    { day: "Thu", revenue: 44200 },
    { day: "Fri", revenue: 49500 },
    { day: "Sat", revenue: 58000 },
    { day: "Sun", revenue: 38500 },
  ],
  categoryBreakdown: [
    { category: "AC & Appliances", share: 38, count: 540 },
    { category: "Home Cleaning", share: 24, count: 341 },
    { category: "Electrician", share: 18, count: 256 },
    { category: "Plumbing", share: 12, count: 170 },
    { category: "Painting & Repairs", share: 8, count: 113 },
  ],
};

export const INITIAL_ADMIN_BOOKINGS: AdminBooking[] = [
  {
    id: "BK-849201",
    customerName: "Aarav Mehta",
    customerEmail: "aarav@gmail.com",
    customerPhone: "+91 98765 43210",
    proName: "Rahul",
    serviceName: "AC Jet Foam & Deep Service",
    category: "AC Technician",
    date: "Today",
    timeSlot: "10:30 AM",
    amount: 539,
    status: "On the way",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "PENDING",
    locality: "Indiranagar",
  },
  {
    id: "BK-849202",
    customerName: "Priya Nair",
    customerEmail: "priya.nair@outlook.com",
    customerPhone: "+91 98123 45678",
    proName: "Rahul",
    serviceName: "Refrigerator Gas Leak Repair",
    category: "Appliance Repair",
    date: "Today",
    timeSlot: "01:30 PM",
    amount: 799,
    status: "Assigned",
    paymentMethod: "Credit Card",
    paymentStatus: "SUCCESSFUL",
    locality: "Koramangala",
  },
  {
    id: "BK-849203",
    customerName: "Karthik Sundaram",
    customerEmail: "karthik.s@gmail.com",
    customerPhone: "+91 99001 22334",
    proName: "Rahul",
    serviceName: "Split AC PCB Circuit Check",
    category: "AC Technician",
    date: "Today",
    timeSlot: "04:00 PM",
    amount: 899,
    status: "Confirmed",
    paymentMethod: "Cash After Service",
    paymentStatus: "PENDING",
    locality: "HSR Layout",
  },
  {
    id: "BK-849204",
    customerName: "Sneha Rao",
    customerEmail: "sneha.rao@yahoo.com",
    customerPhone: "+91 97400 55667",
    proName: "Rahul",
    serviceName: "Washing Machine Drum Alignment",
    category: "Appliance Repair",
    date: "Today",
    timeSlot: "09:00 AM",
    amount: 499,
    status: "Completed",
    paymentMethod: "UPI (PhonePe)",
    paymentStatus: "SUCCESSFUL",
    locality: "Indiranagar",
  },
  {
    id: "BK-849205",
    customerName: "Rohan Kapoor",
    customerEmail: "rohan.k@techcorp.in",
    customerPhone: "+91 98888 11223",
    proName: "David Chen",
    serviceName: "Complete Bathroom Deep Clean",
    category: "House Cleaning",
    date: "Yesterday",
    timeSlot: "02:00 PM",
    amount: 699,
    status: "Completed",
    paymentMethod: "Debit Card",
    paymentStatus: "SUCCESSFUL",
    locality: "Whitefield",
  },
  {
    id: "BK-849206",
    customerName: "Meera Krishnan",
    customerEmail: "meera.k@gmail.com",
    customerPhone: "+91 97777 33445",
    proName: "Marcus Thorne",
    serviceName: "Master Electrician Switchboard Wiring",
    category: "Electrician",
    date: "Yesterday",
    timeSlot: "11:30 AM",
    amount: 449,
    status: "Completed",
    paymentMethod: "UPI (Paytm)",
    paymentStatus: "SUCCESSFUL",
    locality: "Indiranagar",
  },
  {
    id: "BK-849207",
    customerName: "Ananya Deshmukh",
    customerEmail: "ananya.d@gmail.com",
    customerPhone: "+91 99112 33445",
    proName: "Unassigned",
    serviceName: "Water Purifier RO Membrane Service",
    category: "Appliance Repair",
    date: "Tomorrow",
    timeSlot: "10:00 AM",
    amount: 599,
    status: "Pending",
    paymentMethod: "Net Banking",
    paymentStatus: "PENDING",
    locality: "Bellandur",
  },
  {
    id: "BK-849208",
    customerName: "Vikram Malhotra",
    customerEmail: "vikram.m@zenith.com",
    customerPhone: "+91 98223 99887",
    proName: "Sonia Patel",
    serviceName: "Kitchen Chimney Degreasing",
    category: "House Cleaning",
    date: "Tomorrow",
    timeSlot: "03:30 PM",
    amount: 1199,
    status: "In progress",
    paymentMethod: "Credit Card",
    paymentStatus: "SUCCESSFUL",
    locality: "Koramangala",
  },
  {
    id: "BK-849209",
    customerName: "Sunita Iyer",
    customerEmail: "sunita.iyer@gmail.com",
    customerPhone: "+91 98334 55667",
    proName: "Roberto Gomez",
    serviceName: "Wooden Door Frame Repair & Lock",
    category: "Carpenter",
    date: "05 Sep 2026",
    timeSlot: "04:30 PM",
    amount: 499,
    status: "Cancelled",
    paymentMethod: "UPI",
    paymentStatus: "REFUNDED",
    locality: "Malleshwaram",
  },
  {
    id: "BK-849210",
    customerName: "Deepak Sharma",
    customerEmail: "deepak.sharma@gmail.com",
    customerPhone: "+91 98445 66778",
    proName: "David Chen",
    serviceName: "Clogged Drain & Pipe Leak Fix",
    category: "Plumber",
    date: "04 Sep 2026",
    timeSlot: "01:00 PM",
    amount: 399,
    status: "Refunded",
    paymentMethod: "UPI (Google Pay)",
    paymentStatus: "REFUNDED",
    locality: "Jayanagar",
  },
];

export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = [
  {
    id: "CUST-101",
    name: "Aarav Mehta",
    email: "aarav@gmail.com",
    phone: "+91 98765 43210",
    locality: "Indiranagar, Bengaluru",
    registeredDate: "14 Jan 2025",
    bookingCount: 8,
    totalSpent: 4890,
    status: "ACTIVE",
  },
  {
    id: "CUST-102",
    name: "Priya Nair",
    email: "priya.nair@outlook.com",
    phone: "+91 98123 45678",
    locality: "Koramangala, Bengaluru",
    registeredDate: "02 Feb 2025",
    bookingCount: 5,
    totalSpent: 3650,
    status: "ACTIVE",
  },
  {
    id: "CUST-103",
    name: "Karthik Sundaram",
    email: "karthik.s@gmail.com",
    phone: "+91 99001 22334",
    locality: "HSR Layout, Bengaluru",
    registeredDate: "19 Mar 2025",
    bookingCount: 3,
    totalSpent: 2190,
    status: "ACTIVE",
  },
  {
    id: "CUST-104",
    name: "Sneha Rao",
    email: "sneha.rao@yahoo.com",
    phone: "+91 97400 55667",
    locality: "Indiranagar, Bengaluru",
    registeredDate: "11 Apr 2025",
    bookingCount: 12,
    totalSpent: 8450,
    status: "ACTIVE",
  },
  {
    id: "CUST-105",
    name: "Rohan Kapoor",
    email: "rohan.k@techcorp.in",
    phone: "+91 98888 11223",
    locality: "Whitefield, Bengaluru",
    registeredDate: "28 May 2025",
    bookingCount: 2,
    totalSpent: 1698,
    status: "ACTIVE",
  },
];

export const INITIAL_ADMIN_PROS: AdminProfessional[] = [
  {
    id: "PRO-201",
    name: "Rahul",
    email: "rahul@coop.org",
    phone: "+91 98765 01234",
    category: "AC & Appliance Repair",
    skills: ["Master AC Technician", "Inverter PCB", "Gas Leak Detection", "Jet Foam"],
    registeredDate: "10 Oct 2024",
    jobCount: 420,
    rating: 4.9,
    verificationStatus: "VERIFIED",
    status: "ON_DUTY",
  },
  {
    id: "PRO-202",
    name: "Marcus Thorne",
    email: "provider1@coop.org",
    phone: "+91 555-0201",
    category: "Electrician",
    skills: ["Master Electrician", "Rewiring", "Circuit Breakers", "Solar Hooks"],
    registeredDate: "15 Oct 2024",
    jobCount: 312,
    rating: 4.9,
    verificationStatus: "VERIFIED",
    status: "ACTIVE",
  },
  {
    id: "PRO-203",
    name: "David Chen",
    email: "provider2@coop.org",
    phone: "+91 555-0202",
    category: "Plumber",
    skills: ["Master Plumbing", "Drain Snaking", "Water Heaters", "Pipe Leak"],
    registeredDate: "20 Oct 2024",
    jobCount: 245,
    rating: 4.8,
    verificationStatus: "VERIFIED",
    status: "ACTIVE",
  },
  {
    id: "PRO-204",
    name: "Sonia Patel",
    email: "provider3@coop.org",
    phone: "+91 555-0203",
    category: "House Cleaning & Deep Sanitize",
    skills: ["Kitchen Degreasing", "Bathroom Deep Scrub", "Floor Buffing"],
    registeredDate: "05 Nov 2024",
    jobCount: 198,
    rating: 4.7,
    verificationStatus: "VERIFIED",
    status: "ACTIVE",
  },
  {
    id: "PRO-205",
    name: "Prakash Verma",
    email: "prakash.v@gmail.com",
    phone: "+91 98765 88990",
    category: "Carpenter",
    skills: ["Custom Cabinetry", "Door Hinges", "Furniture Assembly"],
    registeredDate: "02 Sep 2026",
    jobCount: 4,
    rating: 4.5,
    verificationStatus: "PENDING",
    status: "ACTIVE",
  },
];

export const INITIAL_ADMIN_COUPONS: AdminCoupon[] = [
  {
    id: "CPN-1",
    code: "FIRSTBOOK",
    description: "Get ₹150 off your first service booking.",
    discountType: "FIXED",
    discountValue: 150,
    minOrderValue: 399,
    expiryDate: "2026-12-31",
    usageLimit: 2000,
    usedCount: 542,
    isActive: true,
    isFirstBookingOnly: true,
  },
  {
    id: "CPN-2",
    code: "SUMMERCOOL",
    description: "20% off all AC service & appliance repairs.",
    discountType: "PERCENTAGE",
    discountValue: 20,
    maxDiscount: 300,
    minOrderValue: 599,
    expiryDate: "2026-10-31",
    usageLimit: 1000,
    usedCount: 289,
    isActive: true,
  },
  {
    id: "CPN-3",
    code: "DEEP250",
    description: "Flat ₹250 discount on premium home deep cleaning.",
    discountType: "FIXED",
    discountValue: 250,
    minOrderValue: 999,
    expiryDate: "2026-11-15",
    usageLimit: 500,
    usedCount: 114,
    isActive: true,
  },
  {
    id: "CPN-4",
    code: "EXPIRED50",
    description: "End of season ₹50 discount voucher.",
    discountType: "FIXED",
    discountValue: 50,
    minOrderValue: 299,
    expiryDate: "2026-08-31",
    usageLimit: 500,
    usedCount: 500,
    isActive: false,
  },
  {
    id: "CPN-5",
    code: "MINORDER500",
    description: "VIP ₹500 off on large orders of ₹2,000 or more.",
    discountType: "FIXED",
    discountValue: 500,
    minOrderValue: 2000,
    expiryDate: "2026-12-31",
    usageLimit: 300,
    usedCount: 42,
    isActive: true,
  },
  {
    id: "CPN-6",
    code: "COOPFIRST_USED",
    description: "Welcome voucher previously redeemed.",
    discountType: "FIXED",
    discountValue: 100,
    minOrderValue: 299,
    expiryDate: "2026-12-31",
    usageLimit: 1,
    usedCount: 1,
    isActive: true,
  },
];

// 5-State Coupon Validation Engine
export function validateCoupon(
  code: string,
  orderSubtotal: number,
  isFirstBooking: boolean = true,
  userAlreadyUsedCodes: string[] = ["COOPFIRST_USED"]
): CouponValidationResult {
  const cleanCode = code.trim().toUpperCase();
  const coupons = getAdminCoupons();
  const coupon = coupons.find((c) => c.code === cleanCode);

  if (!coupon) {
    return {
      isValid: false,
      status: "INVALID",
      discountAmount: 0,
      message: `Promo code "${cleanCode}" is invalid or does not exist.`,
    };
  }

  // Check Expiry or Active
  const now = new Date("2026-09-08T23:57:00");
  const expiry = new Date(coupon.expiryDate);
  if (!coupon.isActive || expiry < now) {
    return {
      isValid: false,
      status: "EXPIRED",
      discountAmount: 0,
      message: `Coupon "${cleanCode}" expired on ${coupon.expiryDate}.`,
      coupon,
    };
  }

  // Check Already Used
  if (userAlreadyUsedCodes.includes(cleanCode)) {
    return {
      isValid: false,
      status: "ALREADY_USED",
      discountAmount: 0,
      message: `You have already redeemed coupon "${cleanCode}" on a previous booking.`,
      coupon,
    };
  }

  // Check First Booking Condition
  if (coupon.isFirstBookingOnly && !isFirstBooking) {
    return {
      isValid: false,
      status: "ALREADY_USED",
      discountAmount: 0,
      message: `Coupon "${cleanCode}" is exclusively valid for first-time customers.`,
      coupon,
    };
  }

  // Check Minimum Order Value
  if (orderSubtotal < coupon.minOrderValue) {
    return {
      isValid: false,
      status: "MIN_ORDER_NOT_MET",
      discountAmount: 0,
      message: `Coupon requires a minimum order value of ₹${coupon.minOrderValue}. Add items worth ₹${coupon.minOrderValue - orderSubtotal} more.`,
      coupon,
    };
  }

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === "FIXED") {
    discount = coupon.discountValue;
  } else {
    discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  return {
    isValid: true,
    status: "VALID",
    discountAmount: Math.min(discount, orderSubtotal),
    message: `Coupon applied successfully! You saved ₹${discount}.`,
    coupon,
  };
}

// LocalStorage helpers for Admin state
export function getAdminBookings(): AdminBooking[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("coop_admin_bookings");
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return INITIAL_ADMIN_BOOKINGS;
}

export function saveAdminBookings(bookings: AdminBooking[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("coop_admin_bookings", JSON.stringify(bookings));
    } catch {}
  }
}

export function getAdminCoupons(): AdminCoupon[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("coop_admin_coupons");
      if (stored) return JSON.parse(stored);
    } catch {}
  }
  return INITIAL_ADMIN_COUPONS;
}

export function saveAdminCoupons(coupons: AdminCoupon[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("coop_admin_coupons", JSON.stringify(coupons));
    } catch {}
  }
}
