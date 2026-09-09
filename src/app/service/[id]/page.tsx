"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Clock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  MapPin,
  Sparkles,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Zap,
  Check,
  Award,
  ThumbsUp,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import Footer from "@/components/home/Footer";
import SearchModal from "@/components/home/SearchModal";
import QuickBookingModal from "@/components/home/QuickBookingModal";
import ServiceCard from "@/components/services/ServiceCard";
import {
  POPULAR_SERVICES,
  CUSTOMER_REVIEWS,
  TOP_PROFESSIONALS,
  ServiceItem,
  findMatchingServiceForCategory,
} from "@/lib/homeData";

interface ServiceDetailPageProps {
  params: { id: string };
}

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = (params?.id as string) || "svc-1";

  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [beforeAfterTab, setBeforeAfterTab] = useState<"after" | "before">("after");

  const service =
    POPULAR_SERVICES.find(
      (s) =>
        s.id === serviceId ||
        s.slug === serviceId ||
        s.categorySlug === serviceId ||
        s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === serviceId.toLowerCase() ||
        s.name.toLowerCase() === serviceId.toLowerCase()
    ) ||
    findMatchingServiceForCategory(serviceId) ||
    POPULAR_SERVICES[0];


  const similarServices = POPULAR_SERVICES.filter(
    (s) => s.id !== service.id && s.categorySlug === service.categorySlug
  );
  const displaySimilar =
    similarServices.length > 0
      ? similarServices
      : POPULAR_SERVICES.filter((s) => s.id !== service.id).slice(0, 3);

  const matchedReviews = CUSTOMER_REVIEWS.filter(
    (r) => r.categorySlug === service.categorySlug
  );
  const reviewsToDisplay = matchedReviews.length > 0 ? matchedReviews : CUSTOMER_REVIEWS.slice(0, 3);

  const handleStartBooking = () => {
    router.push(`/book/${service.id}`);
  };

  const beforeAfterImages = {
    before: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
    after: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
  };

  const serviceFaqs = [
    {
      q: `What is covered in the standard ${service.name}?`,
      a: `Our certified specialist performs a 10-point health inspection, thorough ultrasonic or jet cleaning, component testing, and provides a 30-day rework warranty.`,
    },
    {
      q: "Are replacement parts included in this price?",
      a: "Standard consumable gaskets, Teflon sealing tape, and basic screws are included. If brand new replacement hardware (e.g., capacitors, PCB, compressor valve) is required, technicians provide authentic MRP manufacturer invoices.",
    },
    {
      q: "How soon can a technician arrive at my doorstep?",
      a: "We offer both instant 45-min emergency dispatch in Indiranagar, Bengaluru and flexible 2-hour scheduled slots.",
    },
  ];

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
        onOpenBooking={() => setIsBookingOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-12 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
          <Link href="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/services/${service.categorySlug}`}
            className="hover:text-brand-600 transition-colors"
          >
            {service.category}
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-bold truncate">{service.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Detailed Service Overview */}
          <div className="lg:col-span-8 space-y-10">
            {/* Large Service Hero Image */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-200">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {service.badge && (
                <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-brand-700 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {service.badge}
                </span>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-black text-sm">{service.rating}</span>
                  <span className="text-slate-300">
                    ({service.reviewsCount ? service.reviewsCount.toLocaleString() : "14.2k"} reviews)
                  </span>
                </div>
                <span className="bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl shadow">
                  ✓ Verified Pro Available
                </span>
              </div>
            </div>

            {/* Title & Stats */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full inline-block">
                {service.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {service.name}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {service.description}
              </p>

              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Duration</span>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" /> {service.duration}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Warranty</span>
                  <span className="text-sm font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 30-Day Cover
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">In {selectedLocality}</span>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-brand-600" /> 18 Pros Nearby
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Fastest Slot</span>
                  <span className="text-sm font-black text-amber-700 flex items-center gap-1 mt-0.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> In 45 Mins
                  </span>
                </div>
              </div>
            </div>

            {/* What's Included vs Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Included */}
              <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm border-b border-emerald-100 pb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>What's Included</span>
                </div>
                <ul className="space-y-2.5">
                  {service.includes.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded */}
              <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm border-b border-rose-100 pb-3">
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span>What's Excluded</span>
                </div>
                <ul className="space-y-2.5">
                  {(service.excludes || [
                    "Cost of new major replacement components (billed via MRP)",
                    "Structural civil masonry alterations",
                    "Damage caused by unauthorized third-party tampering"
                  ]).map((exc, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Before & After Visual Interactive Showcase */}
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Real Service Before & After Result
                  </h3>
                  <p className="text-xs text-slate-500">
                    See the dramatic transformation delivered by our certified equipment
                  </p>
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm text-xs font-bold">
                  <button
                    onClick={() => setBeforeAfterTab("before")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      beforeAfterTab === "before"
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Before Service
                  </button>
                  <button
                    onClick={() => setBeforeAfterTab("after")}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      beforeAfterTab === "after"
                        ? "bg-emerald-600 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    After CoopServe
                  </button>
                </div>
              </div>

              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-md">
                <img
                  src={beforeAfterTab === "after" ? service.image : beforeAfterImages.before}
                  alt="Service transformation result"
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <span className={`absolute bottom-4 left-4 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-lg ${
                  beforeAfterTab === "after" ? "bg-emerald-600" : "bg-slate-900/80"
                }`}>
                  {beforeAfterTab === "after" ? "✨ After CoopServe Treatment" : "⚠️ Before Service Visit"}
                </span>
              </div>
            </div>

            {/* Verified Customer Reviews */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Customer Reviews ({reviewsToDisplay.length})
                </h3>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <ThumbsUp className="w-3.5 h-3.5" /> 98% Positive Feedback
                </span>
              </div>

              <div className="space-y-3">
                {reviewsToDisplay.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.avatar}
                          alt={rev.name}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                          <p className="text-[10px] text-slate-500">
                            {rev.locality}, {rev.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Frequently Asked Questions
              </h3>
              <div className="space-y-2.5">
                {serviceFaqs.map((faq, idx) => {
                  const isOpen = activeFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                    >
                      <button
                        onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4"
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
                        <div className="p-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Similar Services */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                Similar & Complementary Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {displaySimilar.map((item) => (
                  <ServiceCard
                    key={item.id}
                    service={item}
                    onBook={(s) => router.push(`/book/${s.id}`)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Sticky Desktop Booking Panel */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Transparent Standard Rate
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-slate-900">₹{service.price}</span>
                  <span className="text-sm text-slate-400 line-through">₹{service.originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Save ₹{service.originalPrice - service.price}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Inclusive of all taxes • Pay after service completion
                </p>
              </div>

              {/* Service inclusions bullet summary */}
              <div className="space-y-2 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Package Highlights:
                </span>
                {service.includes.slice(0, 3).map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{inc}</span>
                  </div>
                ))}
              </div>

              {/* Locality ETA badge */}
              <div className="p-3 bg-brand-50/70 border border-brand-200 rounded-2xl text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-900">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>{selectedLocality}, {selectedCity}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  ⚡ 5 specialists ready for dispatch. Next available slot today.
                </p>
              </div>

              <button
                onClick={handleStartBooking}
                className="w-full py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-black text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Book Slot</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center text-[11px] text-slate-400 space-y-1">
                <p>✓ 100% Free cancellation up to 2 hours before</p>
                <p>✓ ₹10,000 damage protection guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Total Price</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-black text-slate-900">₹{service.price}</span>
            <span className="text-xs text-slate-400 line-through">₹{service.originalPrice}</span>
          </div>
        </div>

        <button
          onClick={handleStartBooking}
          className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center gap-1.5"
        >
          <span>Book now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectService={(s) => router.push(`/service/${s.id}`)}
      />

      <QuickBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={service}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
      />
    </div>
  );
}
