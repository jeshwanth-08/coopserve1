/**
 * CoopServe Supabase-Ready Schema & Reusable TypeScript Interfaces
 * Corresponds to standard relational tables in PostgreSQL / Supabase
 */

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";

export interface User {
  id: string; // uuid
  email: string;
  phone: string;
  name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Professional {
  id: string; // uuid -> references users.id
  user_id: string;
  category_id: string;
  skills: string[];
  rating: number; // numeric(3, 2)
  reviews_count: number;
  jobs_completed: number;
  experience_years: number;
  is_verified: boolean;
  is_available: boolean;
  hourly_rate?: number;
  bio?: string;
  service_radius_km: number;
  created_at: string;
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  hero_headline: string;
  description: string;
  starting_price: number;
  icon_name: string;
  image_url: string;
  is_active: boolean;
  seo_title: string;
  seo_meta_desc: string;
  created_at: string;
}

export interface Service {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number;
  duration: string;
  rating: number;
  reviews_count: number;
  bookings_count: number;
  description: string;
  includes: string[];
  excludes: string[];
  image_url: string;
  is_active: boolean;
  seo_title: string;
  seo_meta_desc: string;
  created_at: string;
}

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "ON_THE_WAY"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export interface Booking {
  id: string; // uuid
  booking_code: string; // e.g. BK-849201
  customer_id: string;
  professional_id?: string;
  service_id: string;
  address_id: string;
  scheduled_date: string;
  scheduled_slot: string;
  status: BookingStatus;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  coupon_id?: string;
  is_emergency: boolean;
  customer_notes?: string;
  evidence_photos?: string[];
  otp_code: string; // for service start verification
  created_at: string;
  updated_at: string;
}

export interface BookingItem {
  id: string;
  booking_id: string;
  service_id: string;
  item_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface Review {
  id: string;
  booking_id: string;
  service_id: string;
  professional_id: string;
  customer_id: string;
  customer_name: string;
  rating: number; // 1 to 5
  comment: string;
  photos?: string[];
  is_verified: boolean;
  created_at: string;
}

export type PaymentMethod =
  | "UPI"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "NET_BANKING"
  | "WALLET"
  | "CASH_AFTER_SERVICE";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  booking_id: string;
  customer_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  gateway_ref_id?: string;
  receipt_number: string;
  paid_at?: string;
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: "Home" | "Work" | "Other";
  flat_no: string;
  street: string;
  locality: string;
  city: string;
  pincode: string;
  landmark?: string;
  is_default: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: "PERCENT" | "FIXED";
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  valid_until: string;
  is_active: boolean;
  usage_count: number;
  max_usage?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  category: "Booking" | "Arrival" | "Payment" | "Offer" | "Review";
  title: string;
  message: string;
  action_label?: string;
  action_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  ticket_code: string;
  user_id: string;
  category: string;
  subject: string;
  description: string;
  status: "Open" | "In progress" | "Waiting for customer" | "Resolved";
  priority: "Normal" | "High" | "Urgent";
  evidence_photos?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProviderAvailability {
  id: string;
  professional_id: string;
  day_of_week: number; // 0-6
  start_time: string; // "09:00"
  end_time: string; // "18:00"
  is_working: boolean;
}

export interface ProviderEarnings {
  id: string;
  professional_id: string;
  booking_id: string;
  payout_amount: number;
  commission_deducted: number;
  status: "PAID" | "PENDING_SETTLEMENT";
  settled_at?: string;
}
