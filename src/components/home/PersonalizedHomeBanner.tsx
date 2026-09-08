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
  ClipboardList,
  PlusCircle,
  Wrench,
  Shield,
  BarChart3,
  Hammer,
  UserCheck,
  User,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceItem } from "@/lib/homeData";

export interface AuthUser {
  id?: string;
  name: string;
  email: string;
  role: "ADMIN" | "PROVIDER" | "MEMBER" | string;
  locality?: string;
}

interface PersonalizedHomeBannerProps {
  user: AuthUser | null;
  onOpenBookingWithService: (service: ServiceItem) => void;
}

export default function PersonalizedHomeBanner({
  user,
  onOpenBookingWithService,
}: PersonalizedHomeBannerProps) {
  const router = useRouter();
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // If user is not logged in (Guest), do NOT show personalized dashboard banner!
  if (!user) {
    return null;
  }

  const firstName = user.name ? user.name.split(" ")[0] : "Member";

  // -------------------------------------------------------------
  // 1. ADMIN ACCESS BANNER
  // -------------------------------------------------------------
  if (user.role === "ADMIN") {
    return (
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white border-b border-purple-500/20 py-4 sm:py-5 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold border border-purple-400/30 mb-1.5">
                <Shield className="w-3 h-3 text-purple-300" />
                <span>Admin Coordinator Access • Central Dispatch</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {greeting}, {firstName}! <span className="font-medium text-slate-300">Central platform control</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Manage dispatch queue, verify service professionals, and monitor cooperative metrics.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admin"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/30"
              >
                <span>Central Dispatch Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Admin Schema Action Capabilities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
            <Link
              href="/admin/requests"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <ClipboardList className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-purple-300">Admin</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">View All Requests</p>
              <p className="text-[10px] text-slate-300">Filter & monitor feed</p>
            </Link>

            <Link
              href="/admin/requests"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-emerald-300">Dispatch</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">Assign Service Provider</p>
              <p className="text-[10px] text-slate-300">Match verified pros</p>
            </Link>

            <Link
              href="/admin/requests"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <RotateCcw className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-amber-300">Override</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">Update Status</p>
              <p className="text-[10px] text-slate-300">Override lifecycle states</p>
            </Link>

            <Link
              href="/admin/providers"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <ShieldCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-blue-300">Roster</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">Manage Providers</p>
              <p className="text-[10px] text-slate-300">Verify & review skills</p>
            </Link>

            <Link
              href="/admin?tab=overview"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <BarChart3 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-rose-300">KPIs</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">Dashboard Analytics</p>
              <p className="text-[10px] text-slate-300">Platform performance</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. SERVICE PROVIDER ACCESS BANNER
  // -------------------------------------------------------------
  if (user.role === "PROVIDER") {
    return (
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 text-white border-b border-teal-500/20 py-4 sm:py-5 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[11px] font-bold border border-teal-400/30 mb-1.5">
                <Wrench className="w-3 h-3 text-teal-300" />
                <span>Service Provider Access • On Duty</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {greeting}, {firstName}! <span className="font-medium text-slate-300">Ready for service jobs?</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Check incoming dispatch requests, accept jobs, update your arrival progress, and view verified customer ratings.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/provider"
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-teal-600/30"
              >
                <span>Provider Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Provider Schema Action Capabilities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
            <Link
              href="/provider/requests"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <ClipboardList className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-teal-300">Queue</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">View Assigned Requests</p>
              <p className="text-[10px] text-slate-300">Review jobs from dispatch</p>
            </Link>

            <Link
              href="/provider/requests"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <CheckCircle2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-blue-300">Action</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">Accept Request</p>
              <p className="text-[10px] text-slate-300">Confirm availability</p>
            </Link>

            <Link
              href="/provider/requests"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <Clock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-amber-300">Status</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">Update Progress</p>
              <p className="text-[10px] text-slate-300">On the way & in progress</p>
            </Link>

            <Link
              href="/provider/requests"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <Hammer className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-emerald-300">Complete</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">Mark Resolved</p>
              <p className="text-[10px] text-slate-300">Submit work completion</p>
            </Link>

            <Link
              href="/provider/ratings"
              className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold text-amber-300">Feedback</span>
              </div>
              <p className="text-xs font-bold text-white mt-2">View Ratings</p>
              <p className="text-[10px] text-slate-300">Customer stars & reviews</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. MEMBER ACCESS BANNER
  // -------------------------------------------------------------
  const acService =
    POPULAR_SERVICES.find((s) => s.slug === "ac-technician" || s.id === "svc-5") ||
    POPULAR_SERVICES[0];

  const handleBookAgain = (service: ServiceItem) => {
    router.push(`/book/${service.id}?prefilled=true&pro=Rahul&address=${encodeURIComponent(user.locality || "Indiranagar")}`);
  };

  return (
    <div className="bg-gradient-to-r from-brand-950 via-indigo-950 to-slate-950 text-white border-b border-brand-500/20 py-4 sm:py-5 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Member Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[11px] font-bold border border-white/10 mb-1.5">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Member Portal • {user.locality || "Bengaluru Resident"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {greeting}, {firstName}! <span className="font-medium text-slate-300">Need household service?</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Create and track verified service requests with guaranteed pricing and cooperative warranty.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/member"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-brand-600/30"
            >
              <span>Member Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Member Schema Action Capabilities Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <Link
            href="/member/requests/new"
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
              <PlusCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Create Service Request</p>
              <p className="text-[10px] text-slate-300">New household repair</p>
            </div>
          </Link>

          <Link
            href="/member/requests"
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">View My Requests</p>
              <p className="text-[10px] text-slate-300">Active & history list</p>
            </div>
          </Link>

          <Link
            href="/member/requests"
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Track Status</p>
              <p className="text-[10px] text-slate-300">Live dispatch timeline</p>
            </div>
          </Link>

          <Link
            href="/member/requests"
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/10 transition-all flex items-center gap-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Rate Service</p>
              <p className="text-[10px] text-slate-300">Feedback & reviews</p>
            </div>
          </Link>
        </div>

        {/* 2-Card Personalized Section: "Book Again" + "Your Last Service" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* 1. Book Again 1-Click Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-400 transition-all group">
            <div className="flex items-center gap-3">
              <img
                src={acService.image}
                alt={acService.name}
                className="w-12 h-12 rounded-xl object-cover border border-white/20 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase font-black text-amber-300 tracking-wider">
                  Book Again
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                  Book AC Service again
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  1-click prefilled with {user.locality || "Indiranagar"} address & Rahul (★ 4.9).
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBookAgain(acService)}
              className="px-3.5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-xs font-black shadow-md shadow-brand-500/30 transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Book AC Service again</span>
            </button>
          </div>

          {/* 2. Your Last Service Status & Warranty Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-white/15 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Your Last Service
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Intense Bathroom Deep Cleaning
              </h4>
              <p className="text-[11px] text-slate-300">
                Completed on 1 Sep • <strong className="text-emerald-300">30-Day Warranty Active</strong>
              </p>
            </div>

            <Link
              href="/booking/BK-849201"
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white text-white hover:text-slate-900 text-xs font-bold transition-all shrink-0"
            >
              View Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
