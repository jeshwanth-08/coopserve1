import { POPULAR_SERVICES, ServiceItem, TOP_PROFESSIONALS, ProProfile } from "./homeData";

export interface BookingPayload {
  serviceId: string;
  serviceName: string;
  category: string;
  price: number;
  date: string;
  timeSlot: string;
  isEmergency: boolean;
  address: string;
  locality: string;
  city: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  attachments?: string[];
  preferredProId?: string;
  couponCode?: string;
  discountAmount?: number;
  societyName?: string;
  groupCode?: string;
  poolId?: string;
}

export interface BookingRecord {
  id: string;
  service: ServiceItem;
  date: string;
  timeSlot: string;
  status: "CONFIRMED" | "ASSIGNED" | "ON_THE_WAY" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  address: string;
  locality: string;
  city: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  attachments?: string[];
  assignedPro: ProProfile;
  societyName?: string;
  groupCode?: string;
  poolId?: string;
  priceBreakdown: {
    basePrice: number;
    taxes: number;
    discount: number;
    total: number;
  };
  otp: string;
  estimatedArrival: string;
  createdAt: string;
}

export async function createBooking(payload: BookingPayload): Promise<{ success: boolean; bookingId: string; record: BookingRecord }> {
  const service = POPULAR_SERVICES.find(s => s.id === payload.serviceId) || POPULAR_SERVICES[0];
  const assignedPro = payload.preferredProId 
    ? (TOP_PROFESSIONALS.find(p => p.id === payload.preferredProId) || TOP_PROFESSIONALS[0])
    : TOP_PROFESSIONALS[0];

  const bookingId = "BK-" + Math.floor(100000 + Math.random() * 900000);
  const otp = String(Math.floor(1000 + Math.random() * 9000));
  
  const taxes = Math.round(service.price * 0.18);
  const discount = payload.discountAmount || 0;
  const total = service.price + taxes - discount;

  const record: BookingRecord = {
    id: bookingId,
    service,
    date: payload.date,
    timeSlot: payload.timeSlot,
    status: payload.isEmergency ? "ASSIGNED" : "CONFIRMED",
    address: payload.address,
    locality: payload.locality,
    city: payload.city,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    notes: payload.notes,
    attachments: payload.attachments || [],
    assignedPro,
    societyName: payload.societyName,
    groupCode: payload.groupCode,
    poolId: payload.poolId,
    priceBreakdown: {
      basePrice: service.price,
      taxes,
      discount,
      total,
    },
    otp,
    estimatedArrival: payload.isEmergency ? "35 mins" : `${payload.date}, ${payload.timeSlot}`,
    createdAt: new Date().toISOString(),
  };

  // Store in LocalStorage for client persistence
  if (typeof window !== "undefined") {
    try {
      const existing = JSON.parse(localStorage.getItem("coop_bookings") || "[]");
      existing.unshift(record);
      localStorage.setItem("coop_bookings", JSON.stringify(existing));
    } catch {}
  }

  // Also sync with server backend API
  try {
    await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: service.category,
        description: `${service.name} (Booking ID: ${bookingId}) - ${payload.notes || "Standard request"}`,
        visibility: "PERSONAL",
        locality: payload.locality,
        address: `${payload.address}, ${payload.locality}, ${payload.city}`,
        isEmergency: payload.isEmergency,
        preferredDateTime: new Date().toISOString(),
        selectedProviderId: payload.preferredProId,
        societyName: payload.societyName,
        groupCode: payload.groupCode,
        poolId: payload.poolId,
      }),
    });
  } catch (err) {
    console.warn("Backend sync notice:", err);
  }

  return { success: true, bookingId, record };
}

export function getBookingById(id: string): BookingRecord | null {
  if (typeof window !== "undefined") {
    try {
      const existing: BookingRecord[] = JSON.parse(localStorage.getItem("coop_bookings") || "[]");
      const found = existing.find(b => b.id === id);
      if (found) return found;
    } catch {}
  }

  // Mock fallback record for direct link visits matching prompt specification
  const acService = POPULAR_SERVICES.find(s => s.slug === "ac-technician" || s.id === "svc-5") || POPULAR_SERVICES[0];
  const rahulPro = TOP_PROFESSIONALS.find(p => p.name === "Rahul") || TOP_PROFESSIONALS[0];

  return {
    id: id || "BK-849201",
    service: acService,
    date: "Tomorrow",
    timeSlot: "3:00 PM",
    status: "ON_THE_WAY",
    address: "Flat 402, Sunshine Heights, 12th Main Road",
    locality: "Indiranagar",
    city: "Bengaluru",
    customerName: "Aarav Mehta",
    customerPhone: "+91 98765 43210",
    notes: "AC making vibration sound and blowing room temperature air.",
    attachments: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    ],
    assignedPro: rahulPro,
    priceBreakdown: {
      basePrice: 449,
      taxes: 90,
      discount: 0,
      total: 539,
    },
    otp: "4829",
    estimatedArrival: "Tomorrow, 3:00 PM",
    createdAt: new Date().toISOString(),
  };
}

