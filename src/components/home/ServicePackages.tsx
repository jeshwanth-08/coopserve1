"use client";

import React from "react";
import Link from "next/link";
import { Package, Star, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { CURATED_SERVICE_PACKAGES } from "@/lib/supportAndPackageData";

interface ServicePackagesProps {
  onOpenBooking: () => void;
}

export default function ServicePackages({ onOpenBooking }: ServicePackagesProps) {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
              <Package className="w-3.5 h-3.5 text-brand-600" />
              <span>Curated Bundled Service Packages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Service packages designed for maximum savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-2xl">
              Combine essential home maintenance tasks into a single visit. Enjoy pre-discounted combo rates, verified specialist crews, and complete satisfaction guarantees.
            </p>
          </div>

          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <span>View all packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_SERVICE_PACKAGES.slice(0, 3).map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Image & Header */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    {pkg.tag}
                  </span>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs font-bold bg-slate-900/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{pkg.rating}</span>
                    <span className="text-slate-300">({pkg.reviewsCount})</span>
                    <span className="text-slate-300">• {pkg.duration}</span>
                  </div>
                </div>

                {/* Body details */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="space-y-2.5 border-t border-slate-100 pt-3">
                    <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                      Included Services:
                    </p>
                    {pkg.includedServices.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-900">{item.name}: </span>
                          <span className="text-slate-600">{item.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block mb-1">
                    Save ?{pkg.savings}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900">?{pkg.packagePrice}</span>
                    <span className="text-xs text-slate-400 line-through">?{pkg.originalPrice}</span>
                  </div>
                </div>

                <Link
                  href={`/book/svc-1?package=${pkg.slug}`}
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Book Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
