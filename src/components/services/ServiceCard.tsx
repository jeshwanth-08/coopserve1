"use client";

import React, { useState } from "react";
import {
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ServiceItem } from "@/lib/homeData";

interface ServiceCardProps {
  service?: ServiceItem;
  isLoading?: boolean;
  isDisabled?: boolean;
  onBook?: (service: ServiceItem) => void;
  layout?: "grid" | "horizontal";
}

export default function ServiceCard({
  service,
  isLoading = false,
  isDisabled = false,
  onBook,
  layout = "grid",
}: ServiceCardProps) {
  const [justBooked, setJustBooked] = useState(false);

  // Loading Skeleton State
  if (isLoading || !service) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-4">
        <div className="aspect-[16/10] bg-slate-200 rounded-2xl w-full" />
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-5 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-200 rounded w-full" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 bg-slate-200 rounded w-20" />
          <div className="h-8 bg-slate-200 rounded-xl w-24" />
        </div>
      </div>
    );
  }

  const handleBookClick = () => {
    if (isDisabled) return;
    setJustBooked(true);
    if (onBook) onBook(service);
    setTimeout(() => setJustBooked(false), 2000);
  };

  const isHorizontal = layout === "horizontal";

  return (
    <div
      className={`bg-white rounded-3xl border transition-all duration-300 group overflow-hidden ${
        isDisabled
          ? "opacity-60 border-slate-200 cursor-not-allowed bg-slate-50/50"
          : "border-slate-200/90 hover:border-brand-300 shadow-sm hover:shadow-card-hover card-hover-effect"
      } ${isHorizontal ? "flex flex-col sm:flex-row" : "flex flex-col justify-between"}`}
    >
      {/* Image Container with Badge */}
      <div
        className={`relative overflow-hidden bg-slate-100 shrink-0 ${
          isHorizontal ? "w-full sm:w-56 aspect-[16/10] sm:aspect-auto" : "aspect-[16/10]"
        }`}
      >
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />

        {service.badge && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-brand-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm border border-brand-100 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            {service.badge}
          </span>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-bold bg-slate-900/60 backdrop-blur-md px-2 py-0.5 rounded-lg">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{service.rating}</span>
          <span className="text-slate-300 text-[10px]">
            ({service.reviewsCount ? service.reviewsCount.toLocaleString() : "4.8k"})
          </span>
        </div>
      </div>

      {/* Service Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block">
              {service.category}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
              <Users className="w-3 h-3 text-slate-400" />
              {service.bookingsCount
                ? `${(service.bookingsCount / 1000).toFixed(0)}k+ bookings`
                : "12k+ bookings"}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">
            {service.name}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {service.description}
          </p>

          <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {service.duration}
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 30-Day Warranty
            </span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Starting price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-slate-900">₹{service.price}</span>
              <span className="text-xs text-slate-400 line-through">₹{service.originalPrice}</span>
            </div>
          </div>

          <button
            onClick={handleBookClick}
            disabled={isDisabled}
            className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm ${
              justBooked
                ? "bg-emerald-600 text-white shadow-emerald-500/20 scale-95"
                : isDisabled
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-brand-500/25 hover:shadow-brand-500/40"
            }`}
          >
            {justBooked ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Slot Selected</span>
              </>
            ) : isDisabled ? (
              <span>Unavailable</span>
            ) : (
              <>
                <span>Book now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
