// src/data/categories.ts
import { ALL_20_SERVICES, MasterService } from './allServicesData';
import { CATEGORIES, CategoryDetail } from '@/lib/homeData';

export interface Category {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  popularServices: string[];
  pricingInfo: string;
  rating: number;
  bookings: number;
  duration: string;
  whatsIncluded: string[];
  whatsNotIncluded: string[];
  faqs: { q: string; a: string }[];
  reviews: { user: string; rating: number; comment: string }[];
}

export const categories: Category[] = CATEGORIES.map((c: CategoryDetail) => {
  const matchingServices = ALL_20_SERVICES.filter((s: MasterService) => s.categorySlug === c.slug);
  return {
    slug: c.slug,
    title: c.title,
    description: c.description,
    heroImage: c.coverBanner,
    popularServices: matchingServices.slice(0, 4).map((s: MasterService) => s.id),
    pricingInfo: `Starting from ₹${c.startingPrice}`,
    rating: 4.9,
    bookings: matchingServices.reduce((acc: number, curr: MasterService) => acc + curr.bookingsCount, 0),
    duration: "30–90 mins",
    whatsIncluded: c.whatsIncluded,
    whatsNotIncluded: c.whatsNotIncluded,
    faqs: c.faqs,
    reviews: [
      { user: "Aarav", rating: 5, comment: "Exceptional quality and on-time service!" },
      { user: "Priya", rating: 5, comment: "Very professional, clean, and transparent pricing." },
      { user: "Rohan", rating: 5, comment: "Booked in minutes, highly recommended." },
    ],
  };
});

