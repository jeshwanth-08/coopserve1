"use client";

import React from "react";
import {
  Star,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Flame,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceItem } from "@/lib/homeData";

interface PopularServicesProps {
  onOpenBooking: (service: ServiceItem) => void;
}

export default function PopularServices({ onOpenBooking }: PopularServicesProps) {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span>Most Booked This Week</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Guaranteed top-rated professionals, fixed upfront rates, and zero hidden visit fees
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-brand-600">
            <span>Scroll for more services</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {POPULAR_SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-300 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden group card-hover-effect"
            >
              {/* Image Container with Badge */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
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
                  <span className="text-slate-300 text-[10px]">({service.reviewsCount.toLocaleString()})</span>
                </div>
              </div>

              {/* Service Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 block mb-1">
                    {service.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">
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

                {/* Price & CTA */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Standard Rate
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-slate-900">₹{service.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{service.originalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(service)}
                    className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white text-xs font-bold transition-all shadow-sm group-hover:bg-brand-600 group-hover:text-white flex items-center gap-1"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
