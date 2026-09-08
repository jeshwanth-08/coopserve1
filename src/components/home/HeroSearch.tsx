"use client";

import React from "react";
import {
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle,
  Zap,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { ServiceItem } from "@/lib/homeData";

interface HeroSearchProps {
  selectedCity: string;
  selectedLocality: string;
  onOpenSearch: () => void;
  onOpenBooking: (service?: ServiceItem) => void;
  onSelectCategory: (slug: string) => void;
}

const HERO_SHORTCUTS = [
  {
    name: "AC Jet Service",
    price: "₹499",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80",
    badge: "Trending",
  },
  {
    name: "Bathroom Deep Clean",
    price: "₹449",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=80",
    badge: "Most Booked",
  },
  {
    name: "Plumber Tap Repair",
    price: "₹199",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=200&q=80",
    badge: "45-Min",
  },
  {
    name: "Electrician Fan Fix",
    price: "₹149",
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Salon Hydra Facial",
    price: "₹899",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=200&q=80",
    badge: "Top Rated",
  },
  {
    name: "Pest Herbal Gel",
    price: "₹749",
    image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=200&q=80",
  },
];

const QUICK_PROMPT_CHIPS = [
  "AC not cooling",
  "Kitchen sink leak",
  "Full 2BHK cleaning",
  "Switchboard sparking",
  "Cockroach in kitchen",
  "TV wall mount",
];

export default function HeroSearch({
  selectedCity,
  selectedLocality,
  onOpenSearch,
  onOpenBooking,
  onSelectCategory,
}: HeroSearchProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 pt-6 sm:pt-10 pb-12 sm:pb-16 border-b border-slate-200/70">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-1/6 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Copy, Search, Shortcuts */}
          <div className="lg:col-span-7 space-y-6">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 shadow-sm text-xs font-semibold text-brand-700">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Professionals in {selectedLocality}, {selectedCity}</span>
              <span className="bg-brand-100 text-brand-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                4.89 ★
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Your home. <br />
                <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
                  Taken care of.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 font-normal max-w-xl leading-relaxed">
                Book trusted professionals for everything your home needs — from a quick repair to a complete makeover.
              </p>
            </div>

            {/* Large Interactive Search Bar */}
            <div className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200 max-w-xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div
                  onClick={onOpenSearch}
                  className="flex-1 flex items-center gap-3 px-3 py-2 cursor-pointer rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Search className="w-5 h-5 text-brand-600 shrink-0" />
                  <div className="text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      What do you need help with?
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-700 truncate block">
                      Try "AC jet clean", "Plumber", "Deep cleaning"...
                    </span>
                  </div>
                </div>

                <button
                  onClick={onOpenSearch}
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* "What do you need help with?" Quick Tags */}
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Suggest:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPT_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={onOpenSearch}
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/90 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 text-slate-600 transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Service Shortcuts */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Popular Service Shortcuts
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-xl">
                {HERO_SHORTCUTS.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => onOpenBooking()}
                    className="p-2 rounded-2xl bg-white hover:bg-brand-50/50 border border-slate-200/80 hover:border-brand-300 shadow-sm cursor-pointer transition-all flex items-center gap-2.5 group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-xl object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-semibold">From {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Visual Composition with Authentic Indian Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 aspect-[4/5] sm:aspect-[4/4.5]">
                <img
                  src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1000&q=85"
                  alt="CoopServe Professional Service"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Overlay bottom caption */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                        Top Rated Specialist
                      </span>
                      <p className="text-sm font-bold">HVAC & Master Electricians</p>
                      <p className="text-xs text-slate-200">100% Background-checked & Police Verified</p>
                    </div>
                    <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Live Badge 1: 4.88 Rating */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-black text-slate-900">4.89 / 5</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">Top 1%</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium">Over 1,50,000+ Reviews</p>
                </div>
              </div>

              {/* Floating Live Badge 2: 45-Min Arrival */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float" style={{ animationDelay: "2s" }}>
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">⚡ 45-Min Arrival</p>
                  <p className="text-[10px] text-slate-500">Live GPS tracking & OTP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
