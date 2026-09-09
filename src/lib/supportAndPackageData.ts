// Unified Support, Membership, Notifications, Packages and Address Store

export interface ServicePackageItem {
  id: string;
  slug: string;
  title: string;
  tag: string;
  originalPrice: number;
  packagePrice: number;
  savings: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  image: string;
  description: string;
  includedServices: { name: string; desc: string; icon: string }[];
  popularAddons?: { name: string; price: number }[];
}

export const CURATED_SERVICE_PACKAGES: ServicePackageItem[] = [
  {
    id: "pkg-home-refresh",
    slug: "home-refresh-package",
    title: "Home Refresh Package",
    tag: "Most Popular",
    originalPrice: 2499,
    packagePrice: 1999,
    savings: 500,
    duration: "2.5 - 3 Hours",
    rating: 4.92,
    reviewsCount: 1420,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    description: "Complete revitalization bundle for urban homes. Deep scrubs your bathroom, degreases the kitchen stove & tiles, and high-suction shampoos your sofa cushions.",
    includedServices: [
      { name: "Bathroom Cleaning", desc: "Chemical descaling, tile scrubbing, mirror polish & tap descaling", icon: "Droplets" },
      { name: "Kitchen Cleaning", desc: "Countertop degreasing, chimney exterior wipe & stove burnout clear", icon: "Sparkles" },
      { name: "Sofa Cleaning", desc: "High-power HEPA shampoo extraction for up to 3 seater sofa", icon: "Sofa" },
    ],
    popularAddons: [
      { name: "Balcony Pressure Wash", price: 299 },
      { name: "Fridge Interior Disinfection", price: 349 }
    ]
  },
  {
    id: "pkg-move-in",
    slug: "move-in-package",
    title: "Move-In Package",
    tag: "Essential for Tenants",
    originalPrice: 4699,
    packagePrice: 3499,
    savings: 1200,
    duration: "4 - 5 Hours",
    rating: 4.95,
    reviewsCount: 980,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "Designed for new move-ins and end-of-tenancy handovers. We deep clean all rooms, apply pest prevention barriers, and sanitize core home appliances.",
    includedServices: [
      { name: "Deep Cleaning", desc: "Rotary machine floor buffing, ceiling cobweb removal & window glass tracks", icon: "Sparkles" },
      { name: "Pest Control", desc: "Herbal anti-cockroach gel dots & drain pit anti-insect treatment", icon: "ShieldAlert" },
      { name: "Appliance Cleaning", desc: "Thorough steam wipe and internal dust vacuum for AC & Refrigerator", icon: "Wrench" },
    ],
    popularAddons: [
      { name: "Wardrobe Internal Shelf Wipe", price: 399 },
      { name: "Keyhole & Switchboard Sanitization", price: 199 }
    ]
  },
  {
    id: "pkg-summer-ac",
    slug: "summer-ac-shield",
    title: "Summer AC Double Shield",
    tag: "Beat The Heat",
    originalPrice: 1799,
    packagePrice: 999,
    savings: 800,
    duration: "90 Mins",
    rating: 4.94,
    reviewsCount: 2310,
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    description: "Twin power jet wash with waterproof funnel jackets, condenser rust coating, and gas pressure health check.",
    includedServices: [
      { name: "2x Indoor Jet Clean", desc: "Pressurized foam coil washing to remove micro allergens", icon: "Zap" },
      { name: "Condenser Anti-Rust Shield", desc: "Coil protection spray preventing outdoor heat damage", icon: "Shield" },
      { name: "Gas Pressure Audit", desc: "Full refrigerant psi testing & drain pipe blockage flush", icon: "Activity" }
    ],
    popularAddons: [
      { name: "Stabilizer Voltage Health Test", price: 149 },
      { name: "Anti-Bacterial AC Filter Replacement", price: 499 }
    ]
  },
  {
    id: "pkg-festive-care",
    slug: "festive-complete-makeover",
    title: "Festive Complete Makeover",
    tag: "Full Home VIP",
    originalPrice: 6799,
    packagePrice: 4999,
    savings: 1800,
    duration: "Full Day (6-7 Hrs)",
    rating: 4.98,
    reviewsCount: 650,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    description: "Get your entire home festival-ready with full wall spot painting, intensive deep sanitization, and full electrical socket inspection.",
    includedServices: [
      { name: "Wall Touch-up & Spot Painting", desc: "High-sheen paint blending on marked walls and corners", icon: "Paintbrush" },
      { name: "Intensive 360 Deep Clean", desc: "Single-disc scrub of tiles, carpets & kitchen cabinets", icon: "Sparkles" },
      { name: "Electrical Safety Audit", desc: "Inspection of main MCBs, geysers, switches & earthing", icon: "Zap" }
    ]
  }
];

// Membership Model
export interface MembershipBenefit {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  highlight: string;
}

export const MEMBERSHIP_BENEFITS: MembershipBenefit[] = [
  {
    id: "b1",
    title: "10% Off Every Service",
    subtitle: "Automatic discount calculated at checkout on top of any active coupons.",
    icon: "Percent",
    highlight: "Unlimited Use",
  },
  {
    id: "b2",
    title: "Priority Booking & Dispatch",
    subtitle: "Guaranteed express technician dispatch within 30-45 minutes in all metro cities.",
    icon: "Zap",
    highlight: "Skip The Queue",
  },
  {
    id: "b3",
    title: "Free Doorstep Visits",
    subtitle: "₹0 inspection & diagnosis charge across all 20 service disciplines.",
    icon: "Home",
    highlight: "4 Free Visits/Yr",
  },
  {
    id: "b4",
    title: "Exclusive Member Offers",
    subtitle: "Early access to seasonal festival sales and member-only bundled packages.",
    icon: "Gift",
    highlight: "VIP Specials",
  },
  {
    id: "b5",
    title: "Extended Rework Warranty",
    subtitle: "60-day complete rework warranty on all plumbing, electrical, and appliance jobs.",
    icon: "ShieldCheck",
    highlight: "60 Days Cover",
  },
];

export const MEMBERSHIP_FAQS = [
  {
    q: "How does the 10% discount work?",
    a: "Once enrolled in HOME+, the 10% member discount is automatically applied to your cart subtotal during checkout. You can also stack standard coupon vouchers on top of this!",
  },
  {
    q: "Can other members of my household use my HOME+ pass?",
    a: "Yes! Your HOME+ membership is tied to your primary registered address and phone number, meaning any family member booking services for your residence enjoys full benefits.",
  },
  {
    q: "How do free service visits work?",
    a: "Whenever a technician arrives for preliminary inspection or diagnosis, the ₹199-₹299 doorstep visit fee is waived automatically up to 4 times per membership year.",
  },
  {
    q: "What is the refund policy on HOME+?",
    a: "We offer a 30-day zero-questions-asked money-back guarantee if you haven't redeemed any membership benefits yet.",
  },
];

// Support System Data Models
export type SupportCategory =
  | "Booking help"
  | "Payment issues"
  | "Cancellation"
  | "Refund"
  | "Professional issues"
  | "Service warranty"
  | "Account issues";

export interface SupportCategoryInfo {
  id: SupportCategory;
  name: string;
  icon: string;
  description: string;
  avgResolution: string;
}

export const SUPPORT_CATEGORIES: SupportCategoryInfo[] = [
  { id: "Booking help", name: "Booking Help", icon: "Calendar", description: "Slot rescheduling, service customisation, special instructions", avgResolution: "< 15 mins" },
  { id: "Payment issues", name: "Payment Issues", icon: "CreditCard", description: "Failed transactions, UPI debit issues, duplicate payments", avgResolution: "< 30 mins" },
  { id: "Cancellation", name: "Cancellation", icon: "XCircle", description: "Zero-fee cancellation, technician re-routing, rescheduling", avgResolution: "Instant" },
  { id: "Refund", name: "Refund", icon: "RotateCcw", description: "Instant refund status to source bank or CoopServe Wallet", avgResolution: "< 2 hours" },
  { id: "Professional issues", name: "Professional Issues", icon: "UserX", description: "Late arrival, code of conduct, skill dissatisfaction", avgResolution: "< 10 mins" },
  { id: "Service warranty", name: "Service Warranty", icon: "ShieldCheck", description: "Claim 30-day rework warranty, schedule free revisit", avgResolution: "< 1 hour" },
  { id: "Account issues", name: "Account Issues", icon: "User", description: "Phone update, address management, data privacy", avgResolution: "< 2 hours" },
];

export interface SupportTicketMessage {
  id: string;
  sender: "user" | "agent";
  senderName: string;
  timestamp: string;
  text: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  category: SupportCategory;
  subject: string;
  description: string;
  status: "Open" | "In progress" | "Waiting for customer" | "Resolved";
  priority: "Normal" | "High" | "Urgent";
  createdAt: string;
  updatedAt: string;
  photos: string[];
  messages: SupportTicketMessage[];
}

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: "t-1",
    ticketNumber: "TCK-8921",
    category: "Service warranty",
    subject: "Water dripping slightly from AC indoor unit after jet wash",
    description: "The AC was serviced yesterday by Rahul. Cooling is superb but I noticed a slight drip from the right corner of the indoor casing.",
    status: "In progress",
    priority: "High",
    createdAt: "Today at 09:30 AM",
    updatedAt: "Today at 10:15 AM",
    photos: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80"],
    messages: [
      {
        id: "m-1",
        sender: "user",
        senderName: "Aarav Mehta",
        timestamp: "09:30 AM",
        text: "Hi support, there is a minor water droplet dripping from the indoor drain pipe tray after yesterday's jet cleaning.",
      },
      {
        id: "m-2",
        sender: "agent",
        senderName: "Priya (Senior Support Lead)",
        timestamp: "10:15 AM",
        text: "Hello Aarav! We sincerely apologize for the inconvenience. Your 30-day rework warranty has been automatically triggered. Rahul or our senior HVAC supervisor has been assigned for a free inspection revisit today at 3:00 PM.",
      },
    ],
  },
  {
    id: "t-2",
    ticketNumber: "TCK-7412",
    category: "Refund",
    subject: "Duplicate UPI charge for booking #BK-849201",
    description: "UPI timed out on first attempt and amount was deducted twice.",
    status: "Resolved",
    priority: "Normal",
    createdAt: "Yesterday",
    updatedAt: "Yesterday at 6:45 PM",
    photos: [],
    messages: [
      {
        id: "m-3",
        sender: "user",
        senderName: "Aarav Mehta",
        timestamp: "Yesterday",
        text: "Amount of ₹499 was debited twice from my HDFC UPI.",
      },
      {
        id: "m-4",
        sender: "agent",
        senderName: "Vikas (Billing Team)",
        timestamp: "Yesterday at 6:45 PM",
        text: "Hi Aarav, our payment gateway reconciled the duplicate transaction. The second ₹499 has been refunded back to your bank with ARN #8291048201.",
      },
    ],
  },
];

// Notification Center Models
export interface NotificationData {
  id: string;
  category: "Booking" | "Arrival" | "Payment" | "Offer" | "Review";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export const INITIAL_NOTIFICATIONS: NotificationData[] = [
  {
    id: "notif-1",
    category: "Arrival",
    title: "Technician Arriving Soon",
    message: "Rahul is arriving in 18 minutes. Keep the AC power switch reachable.",
    timestamp: "10 mins ago",
    isRead: false,
    actionLabel: "Track Rahul",
    actionUrl: "/tracking/BK-849201",
  },
  {
    id: "notif-2",
    category: "Booking",
    title: "Booking Confirmed",
    message: "Your AC service is confirmed for Tomorrow, 3:00 PM.",
    timestamp: "2 hours ago",
    isRead: false,
    actionLabel: "View Booking",
    actionUrl: "/account",
  },
  {
    id: "notif-3",
    category: "Payment",
    title: "Cashback Credited",
    message: "You earned ₹150 cashback in your CoopServe Wallet on your last plumbing service.",
    timestamp: "Yesterday",
    isRead: true,
    actionLabel: "View Wallet",
    actionUrl: "/account",
  },
  {
    id: "notif-4",
    category: "Review",
    title: "Rate Your Experience",
    message: "How was your experience with David Chen for Bathroom Deep Cleaning?",
    timestamp: "2 days ago",
    isRead: true,
    actionLabel: "Leave Review",
    actionUrl: "/account",
  },
  {
    id: "notif-5",
    category: "Booking",
    title: "Service Completed",
    message: "Your service is complete. 30-Day warranty is now active.",
    timestamp: "3 days ago",
    isRead: true,
    actionLabel: "View Invoice",
    actionUrl: "/account",
  },
];

// Address Model
export interface SavedAddress {
  id: string;
  type: "Home" | "Work" | "Other";
  flatNo: string;
  street: string;
  locality: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

export const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-1",
    type: "Home",
    flatNo: "Flat 402, Sunshine Heights",
    street: "12th Main Road, 4th Cross",
    locality: "Indiranagar",
    city: "Bengaluru",
    pincode: "560038",
    landmark: "Behind Metro Pillar 84",
    isDefault: true,
  },
  {
    id: "addr-2",
    type: "Work",
    flatNo: "Level 4, WeWork Galaxy",
    street: "43 Residency Road, Shanthala Nagar",
    locality: "CBD",
    city: "Bengaluru",
    pincode: "560025",
    landmark: "Opposite Bishop Cotton School",
    isDefault: false,
  },
  {
    id: "addr-3",
    type: "Other",
    flatNo: "Villa 18, Palm Meadows",
    street: "5th Avenue Boulevard",
    locality: "Whitefield",
    city: "Bengaluru",
    pincode: "560066",
    landmark: "Near Forum Value Mall",
    isDefault: false,
  },
];
