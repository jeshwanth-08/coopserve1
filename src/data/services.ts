// src/data/services.ts
import { ALL_20_SERVICES } from './allServicesData';

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // starting price in INR
  duration: string; // e.g., "45–60 mins"
  rating: number; // out of 5
  bookings: number; // total bookings count
  imageUrl?: string; // high-quality hero image
  category: string; // category identifier
}

// Map the 20 core services
export const services: Service[] = ALL_20_SERVICES.map((s) => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  description: s.description,
  price: s.price,
  duration: s.duration,
  rating: s.rating,
  bookings: s.bookingsCount,
  imageUrl: s.imageUrl,
  category: s.categorySlug,
}));
