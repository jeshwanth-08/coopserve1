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

  // Mock fallback record for direct link visits
  return {
    id: id || "BK-849201",
    service: POPULAR_SERVICES[0],
    date: "Today",
    timeSlot: "10:30 AM - 12:00 PM",
    status: "ON_THE_WAY",
    address: "Flat 402, Sunshine Heights, 12th Main Road",
    locality: "Indiranagar",
    city: "Bengaluru",
    customerName: "Aarav Mehta",
    customerPhone: "+91 98765 43210",
    assignedPro: TOP_PROFESSIONALS[0],
    priceBreakdown: {
      basePrice: 499,
      taxes: 90,
      discount: 50,
      total: 539,
    },
    otp: "4829",
    estimatedArrival: "22 mins",
    createdAt: new Date().toISOString(),
  };
}
