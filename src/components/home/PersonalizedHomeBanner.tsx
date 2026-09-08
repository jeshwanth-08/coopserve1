"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  RotateCcw,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  Star,
  MapPin,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceItem } from "@/lib/homeData";

interface PersonalizedHomeBannerProps {
  userName?: string;
  onOpenBookingWithService: (service: ServiceItem) => void;
}

export default function PersonalizedHomeBanner({
  userName = "Aarav",
  onOpenBookingWithService,
}: PersonalizedHomeBannerProps) {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good morning 👋");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning 👋");
    else if (hour < 17) setGreeting("Good afternoon 👋");
    else setGreeting("Good evening 👋");
  }, []);

  const lastService = POPULAR_SERVICES[0]; // AC Jet Service

  const handleBookAgain = (service: ServiceItem) => {
    router.push(`/book/${service.id}`);
  };

  return (
    <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white border-b border-brand-500/20 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Personalized Greeting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/10 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Member Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {greeting}, {userName}! <span className="font-normal text-slate-300">Need something fixed today?</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/account"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>My Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2-Card Personalized Section: "Book Again" + "Your Last Service" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* 1. Book Again 1-Click Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-400 transition-all group">
            <div className="flex items-center gap-3.5">
              <img
                src={lastService.image}
                alt={lastService.name}
                className="w-14 h-14 rounded-2xl object-cover border border-white/20 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  Book Again
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Book AC Service again
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Prefilled with your Indiranagar address & 4.9★ pro preference.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBookAgain(lastService)}
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-xs font-black shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>1-Click Rebook</span>
            </button>
          </div>

          {/* 2. Your Last Service Status & Warranty Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/15 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Your Last Service
              </span>
              <h4 className="text-sm font-bold text-white">
                Intense Bathroom Deep Cleaning
              </h4>
              <p className="text-[11px] text-slate-300">
                Completed on 1 Sep • <strong>30-Day Warranty Active</strong>
              </p>
            </div>

            <Link
              href="/booking/BK-849201"
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition-all shrink-0"
            >
              View Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
