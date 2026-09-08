"use client";

import React, { useState } from "react";
import {
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceItem } from "@/lib/homeData";

interface PopularNearYouProps {
  selectedCity: string;
  selectedLocality: string;
  onOpenBooking: (service: ServiceItem) => void;
}

export default function PopularNearYou({
  selectedCity,
  selectedLocality,
  onOpenBooking,
}: PopularNearYouProps) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filterTabs = [
    { id: "all", label: "All Nearby" },
    { id: "cleaning", label: "Cleaning" },
    { id: "ac", label: "AC & Cooling" },
    { id: "electric", label: "Electrical" },
    { id: "plumb", label: "Plumbing" },
  ];

  const filtered = POPULAR_SERVICES.filter((s) => {
    if (activeFilter === "cleaning") return s.categorySlug === "house-cleaning" || s.slug === "house-cleaning";
    if (activeFilter === "ac") return s.categorySlug === "ac-technician" || s.slug === "ac-technician";
    if (activeFilter === "electric") return s.categorySlug === "electrician" || s.slug === "electrician";
    if (activeFilter === "plumb") return s.categorySlug === "plumber" || s.slug === "plumber";
    return true;
  });


  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Personalized for {selectedLocality}, {selectedCity}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular near you
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Top booked services with pros currently available in {selectedLocality} for same-day dispatch
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm self-start md:self-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200 hover:border-brand-300 p-4 sm:p-5 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between group card-hover-effect"
            >
              <div className="flex gap-3.5">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="flex items-center gap-0.5 text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {service.rating}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                      <Zap className="w-2.5 h-2.5" /> 45 min
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">
                    {service.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {service.duration}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Fixed Price
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-slate-900">₹{service.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{service.originalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking(service)}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
