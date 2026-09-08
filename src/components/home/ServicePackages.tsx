"use client";

import React from "react";
import { Package, Star, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { SERVICE_PACKAGES } from "@/lib/homeData";

interface ServicePackagesProps {
  onOpenBooking: () => void;
}

export default function ServicePackages({ onOpenBooking }: ServicePackagesProps) {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
            <Package className="w-3.5 h-3.5 text-brand-600" />
            <span>Curated Value Bundles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Service packages designed for maximum savings
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Combine multiple essential home maintenance tasks in a single visit and save up to ₹1,200.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SERVICE_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-300 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group card-hover-effect"
            >
              <div>
                {/* Image & Header */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {pkg.tag}
                  </span>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-bold bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{pkg.rating}</span>
                    <span className="text-slate-300">• {pkg.duration}</span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-5 sm:p-6 space-y-4">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                    {pkg.title}
                  </h3>

                  <div className="space-y-2.5 border-t border-slate-100 pt-3">
                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      Package Includes:
                    </p>
                    {pkg.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mb-1">
                    Save ₹{pkg.savings}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-slate-900">₹{pkg.offerPrice}</span>
                    <span className="text-xs text-slate-400 line-through">₹{pkg.originalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Book Bundle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
