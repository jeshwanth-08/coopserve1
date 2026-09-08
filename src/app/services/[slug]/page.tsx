"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import {
  Sparkles,
  Star,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ArrowRight,
  MapPin,
  HelpCircle,
  Tag,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import Footer from "@/components/home/Footer";
import SearchModal from "@/components/home/SearchModal";
import QuickBookingModal from "@/components/home/QuickBookingModal";
import ServiceCard from "@/components/services/ServiceCard";
import {
  CATEGORIES,
  POPULAR_SERVICES,
  CUSTOMER_REVIEWS,
  findCategoryBySlug,
  findMatchingServiceForCategory,
  ServiceItem,
} from "@/lib/homeData";


export default function CategoryDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const initialCategory = findCategoryBySlug(slug);

  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeServiceForBooking, setActiveServiceForBooking] = useState<ServiceItem | null>(null);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // Check if slug matches a single specific service directly or a category
  const directService = POPULAR_SERVICES.find(
    (s) => s.id === slug || s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(slug.toLowerCase())
  );

  const matchedCategory = initialCategory || (directService ? findCategoryBySlug(directService.categorySlug) : undefined);

  if (!matchedCategory && !directService) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar
          selectedCity={selectedCity}
          selectedLocality={selectedLocality}
          onSelectLocation={(c, l) => {
            setSelectedCity(c);
            setSelectedLocality(l);
          }}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBooking={() => setIsBookingOpen(true)}
        />
        <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
            👀
          </div>
          <h1 className="text-2xl font-black text-slate-900">Service Not Found</h1>
          <p className="text-xs text-slate-500">
            We couldn't find a service or category matching "{slug}". Explore our full range of 12 core disciplines below.
          </p>
          <Link
            href="/#categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore All Categories</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeCategory = matchedCategory || CATEGORIES[0];
  const category = activeCategory;
  const featuredService =
    directService ||
    findMatchingServiceForCategory(slug) ||
    findMatchingServiceForCategory(activeCategory.slug) ||
    POPULAR_SERVICES.find(
      (s) =>
        s.categorySlug === activeCategory.slug ||
        s.slug === activeCategory.slug ||
        activeCategory.aliases.includes(s.slug) ||
        activeCategory.aliases.includes(s.categorySlug) ||
        s.category.toLowerCase().includes(activeCategory.title.toLowerCase())
    ) ||
    POPULAR_SERVICES[0];

  // Filter services belonging to this category or fallback
  const categoryServices = POPULAR_SERVICES.filter(
    (s) =>
      s.categorySlug === activeCategory.slug ||
      s.slug === activeCategory.slug ||
      activeCategory.aliases.includes(s.slug) ||
      activeCategory.aliases.includes(s.categorySlug) ||
      s.category.toLowerCase().includes(activeCategory.title.toLowerCase())
  );


  const otherServices = POPULAR_SERVICES.filter(
    (s) => s.categorySlug !== activeCategory.slug
  ).slice(0, 4);

  const categoryReviews = CUSTOMER_REVIEWS.filter(
    (r) => r.categorySlug === activeCategory.slug
  );
  const displayReviews = categoryReviews.length > 0 ? categoryReviews : CUSTOMER_REVIEWS.slice(0, 3);

  const handleOpenBooking = (service?: ServiceItem) => {
    setActiveServiceForBooking(service || featuredService || categoryServices[0] || POPULAR_SERVICES[0]);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col selection:bg-brand-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onSelectLocation={(c, l) => {
          setSelectedCity(c);
          setSelectedLocality(l);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
      />

      <main className="flex-1">
        {/* 2. Premium Category Hero */}
        <div className="relative bg-slate-950 text-white overflow-hidden py-12 sm:py-20 border-b border-slate-800">
          <div className="absolute inset-0 opacity-25">
            <img
              src={category.coverBanner}
              alt={category.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/#categories" className="hover:text-white transition-colors">
                Services
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-bold">{category.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{category.tagline}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {category.heroHeadline}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {category.description}
                </p>

                {/* Badges & Trust markers */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-white">4.89 / 5</span>
                    <span className="text-slate-400">(25k+ bookings)</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm text-emerald-400 font-semibold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>30-Day Free Rework Warranty</span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm text-amber-300 font-semibold">
                    <Clock className="w-4 h-4" />
                    <span>45-Min Emergency Arrival</span>
                  </div>
                </div>
              </div>

              {/* Quick Hero Action Box */}
              <div className="lg:col-span-4 bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-white space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                    Instant Booking
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">
                      From ₹{category.startingPrice}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold">Zero Visit Fee</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Currently available in <strong>{selectedLocality}, {selectedCity}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleOpenBooking()}
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Book {category.title} Specialist</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Services Grid */}
        <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Available {category.title} Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select any standardized service with genuine spare parts and fixed transparent pricing
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(categoryServices.length > 0 ? categoryServices : POPULAR_SERVICES.slice(0, 3)).map(
              (service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={(s) => handleOpenBooking(s)}
                />
              )
            )}
          </div>
        </div>

        {/* 4. What's Included vs What's Not Included */}
        <div className="py-12 bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Clear & Transparent Scope
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Know exactly what is covered before our technician arrives at your door.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Included */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm sm:text-base border-b border-emerald-100 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>What's Included in {category.title}</span>
                </div>
                <ul className="space-y-3">
                  {category.whatsIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Included */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm sm:text-base border-b border-rose-100 pb-3">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span>What's Not Included</span>
                </div>
                <ul className="space-y-3">
                  {category.whatsNotIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Process Steps */}
        <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Our 4-Step Standardized Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered for cleanliness, zero collateral mess, and enduring durability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.processSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-2 card-hover-effect"
              >
                <span className="text-2xl font-black text-brand-600 font-mono block">
                  0{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. FAQs for Category */}
        <div className="py-12 bg-slate-50 border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {category.title} FAQs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Common questions regarding procedures, rates, and safety.
              </p>
            </div>

            <div className="space-y-3">
              {category.faqs.map((faq, idx) => {
                const isOpen = faqOpenIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                  >
                    <button
                      onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180 text-brand-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 7. Related Services */}
        <div className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Frequently Booked Together
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Customers who booked {category.title} also loved these services
              </p>
            </div>
            <Link
              href="/#categories"
              className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={(s) => handleOpenBooking(s)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Booking CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Starting from</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">₹{featuredService.price}</span>
            <span className="text-[10px] text-emerald-600 font-bold">Zero Visit Fee</span>
          </div>
        </div>
        <button
          onClick={() => handleOpenBooking(featuredService)}
          className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5"
        >
          <span>Book Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectService={(s) => handleOpenBooking(s)}
      />

      <QuickBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={activeServiceForBooking}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
      />
    </div>
  );
}
