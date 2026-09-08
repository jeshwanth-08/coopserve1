"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  RotateCcw,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import Footer from "@/components/home/Footer";
import SearchModal from "@/components/home/SearchModal";
import QuickBookingModal from "@/components/home/QuickBookingModal";
import ServiceCard from "@/components/services/ServiceCard";
import {
  POPULAR_SERVICES,
  CATEGORIES,
  NATURAL_LANGUAGE_INTENTS,
  ServiceItem,
} from "@/lib/homeData";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeServiceForBooking, setActiveServiceForBooking] = useState<ServiceItem | null>(null);

  // Filter States
  const [priceFilter, setPriceFilter] = useState<string>("all"); // "all" | "under500" | "500to1000" | "above1000"
  const [ratingFilter, setRatingFilter] = useState<number>(0); // 0, 4.5, 4.8
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all"); // "all" | "express" | "sameday"
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended"); // "recommended" | "priceLow" | "priceHigh" | "rating" | "fastest"

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchQuery(queryParam);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleOpenBooking = (service?: ServiceItem) => {
    setActiveServiceForBooking(service || POPULAR_SERVICES[0]);
    setIsBookingModalOpen(true);
  };

  const resetFilters = () => {
    setPriceFilter("all");
    setRatingFilter(0);
    setAvailabilityFilter("all");
    setCategoryFilter("all");
    setSortBy("recommended");
  };

  // Filter matching
  const lowerQ = queryParam.toLowerCase().trim();
  let results = POPULAR_SERVICES.filter((s) => {
    // Text search query
    if (lowerQ) {
      const matchText =
        s.name.toLowerCase().includes(lowerQ) ||
        s.category.toLowerCase().includes(lowerQ) ||
        s.description.toLowerCase().includes(lowerQ) ||
        s.includes.some((inc) => inc.toLowerCase().includes(lowerQ));
      if (!matchText) return false;
    }

    // Category filter
    if (categoryFilter !== "all" && s.categorySlug !== categoryFilter) {
      return false;
    }

    // Price filter
    if (priceFilter === "under500" && s.price >= 500) return false;
    if (priceFilter === "500to1000" && (s.price < 500 || s.price > 1000)) return false;
    if (priceFilter === "above1000" && s.price <= 1000) return false;

    // Rating filter
    if (ratingFilter > 0 && s.rating < ratingFilter) return false;

    return true;
  });

  // Sorting
  if (sortBy === "priceLow") {
    results = [...results].sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    results = [...results].sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    results = [...results].sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "fastest") {
    results = [...results].sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0));
  }

  // Active filters count
  const activeFiltersCount =
    (priceFilter !== "all" ? 1 : 0) +
    (ratingFilter > 0 ? 1 : 0) +
    (categoryFilter !== "all" ? 1 : 0) +
    (availabilityFilter !== "all" ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* 1. Navbar */}
      <Navbar
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onSelectLocation={(c, l) => {
          setSelectedCity(c);
          setSelectedLocality(l);
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Search Header Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm mb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-brand-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across 100+ home services..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 shrink-0"
            >
              Search
            </button>
          </form>

          {/* Search Meta & Mobile Filter Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900">
                {queryParam ? (
                  <>
                    Showing results for <span className="text-brand-600">"{queryParam}"</span>
                  </>
                ) : (
                  "Explore All Services"
                )}
              </h1>
              <p className="text-xs text-slate-500">
                Found {results.length} verified services in {selectedLocality}, {selectedCity}
              </p>
            </div>

            {/* Sort & Mobile Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                  <option value="rating">Top Rated (4.8+)</option>
                  <option value="fastest">Fastest Dispatch</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                <Filter className="w-4 h-4 text-brand-600" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-brand-100 text-brand-700 text-[10px] px-1.5 rounded-full font-black">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-[11px] font-bold text-brand-600 hover:underline"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Price Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Price Range
              </label>
              <div className="space-y-1.5 text-xs font-medium text-slate-700">
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under500", label: "Under ₹499" },
                  { id: "500to1000", label: "₹500 — ₹1,000" },
                  { id: "above1000", label: "Above ₹1,000" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={priceFilter === item.id}
                      onChange={() => setPriceFilter(item.id)}
                      className="text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Customer Rating
              </label>
              <div className="space-y-1.5 text-xs font-medium text-slate-700">
                {[
                  { val: 0, label: "All Ratings" },
                  { val: 4.8, label: "★ 4.8 & above (Top Rated)" },
                  { val: 4.5, label: "★ 4.5 & above" },
                ].map((item) => (
                  <label
                    key={item.val}
                    className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50"
                  >
                    <input
                      type="radio"
                      name="minRating"
                      checked={ratingFilter === item.val}
                      onChange={() => setRatingFilter(item.val)}
                      className="text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories Filter */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All 12 Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Grid / States */}
          <div className="lg:col-span-9 space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ServiceCard key={i} isLoading={true} />
                ))}
              </div>
            ) : results.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-3xl">
                  👀
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Nothing useful came up for "{queryParam}"
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Try another search or explore our popular categories like AC repair, deep cleaning, or plumbing.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    Reset Filters
                  </button>
                  <Link
                    href="/#categories"
                    className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Explore Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Results List */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onBook={(s) => handleOpenBooking(s)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filters Bottom Sheet Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Filter Services</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price Filter Mobile */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "all", label: "All" },
                  { id: "under500", label: "Under ₹499" },
                  { id: "500to1000", label: "₹500 - ₹1,000" },
                  { id: "above1000", label: "Above ₹1,000" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPriceFilter(item.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      priceFilter === item.id
                        ? "bg-brand-50 border-brand-600 text-brand-700"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter Mobile */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold text-slate-800 focus:outline-none"
              >
                <option value="all">All 12 Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  resetFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-3 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Nav */}
      <MobileBottomNav onOpenBooking={() => handleOpenBooking()} />

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectService={(s) => handleOpenBooking(s)}
      />

      <QuickBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialService={activeServiceForBooking}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
      />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
