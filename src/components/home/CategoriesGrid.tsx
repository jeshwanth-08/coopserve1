"use client";

import React from "react";
import {
  Sparkles,
  Flame,
  Droplet,
  Zap,
  Scissors,
  Paintbrush,
  ShieldAlert,
  Wrench,
  Armchair,
  Truck,
  Car,
  Home,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES, CategoryItem, ServiceItem, findMatchingServiceForCategory } from "@/lib/homeData";

interface CategoriesGridProps {
  onSelectCategory: (category: CategoryItem, service?: ServiceItem) => void;
  onOpenBooking: (service?: ServiceItem) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5 text-indigo-600" />,
  Flame: <Flame className="w-5 h-5 text-amber-500" />,
  Droplet: <Droplet className="w-5 h-5 text-cyan-600" />,
  Zap: <Zap className="w-5 h-5 text-amber-500" />,
  Scissors: <Scissors className="w-5 h-5 text-rose-500" />,
  Paintbrush: <Paintbrush className="w-5 h-5 text-violet-600" />,
  ShieldAlert: <ShieldAlert className="w-5 h-5 text-emerald-600" />,
  Wrench: <Wrench className="w-5 h-5 text-slate-700" />,
  Armchair: <Armchair className="w-5 h-5 text-orange-600" />,
  Truck: <Truck className="w-5 h-5 text-blue-600" />,
  Car: <Car className="w-5 h-5 text-teal-600" />,
  Home: <Home className="w-5 h-5 text-emerald-700" />,
};

export default function CategoriesGrid({ onSelectCategory, onOpenBooking }: CategoriesGridProps) {
  return (
    <section id="categories" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>12 Core Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything your home needs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Standardized pricing, background-verified professionals, and guaranteed on-time doorstep arrival.
          </p>
        </div>

        {/* 12 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat, idx) => {
            const matchedService = findMatchingServiceForCategory(cat.slug);
            const displayPrice = matchedService ? matchedService.price : cat.startingPrice;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat, matchedService);
                }}
                className="bg-white rounded-3xl border border-slate-200 hover:border-brand-300 hover:shadow-card-hover p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 group card-hover-effect relative overflow-hidden"
              >
                {/* Top Row: Icon and Badge */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-50 transition-all shadow-sm">
                    {ICON_MAP[cat.iconName] || <Sparkles className="w-5 h-5 text-brand-600" />}
                  </div>

                  {cat.badge ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {cat.badge}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      #{String(idx + 1).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>

                  {/* Popular Pills Preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {cat.popularServices.slice(0, 2).map((srv) => (
                      <span
                        key={srv}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                      >
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Price & Explore Arrow */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Starting from
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      ₹{displayPrice}
                    </span>
                  </div>

                  <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-brand-600 text-slate-600 group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

