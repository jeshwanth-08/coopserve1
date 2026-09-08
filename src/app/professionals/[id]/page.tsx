"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Phone,
  Award,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { TOP_PROFESSIONALS } from "@/lib/homeData";

export default function ProfessionalProfilePage() {
  const params = useParams();
  const router = useRouter();
  const proId = (params?.id as string) || "pro-1";

  const pro = TOP_PROFESSIONALS.find((p) => p.id === proId) || TOP_PROFESSIONALS[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to marketplace</span>
        </Link>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <img
              src={pro.avatar}
              alt={pro.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-brand-500 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900">{pro.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Pro
                </span>
              </div>
              <p className="text-sm font-bold text-brand-600">{pro.role}</p>
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5" /> {pro.city} (5km Service Radius)
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
                <span className="flex items-center gap-1 font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {pro.rating}
                </span>
                <span className="text-slate-500">� {pro.jobsCompleted}+ Jobs Completed</span>
                <span className="text-slate-500">� {pro.experienceYears} Years Experience</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/book/svc-1?pro=${pro.id}`)}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
          >
            <span>Book With {pro.name.split(" ")[0]}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pro Specialty & Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-600" />
              <span>Core Expertise & Skill Badges</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{pro.specialty}</p>
            <div className="pt-2 flex flex-wrap gap-2">
              {["Industrial Safety Certified", "Background Checked", "Punctuality Guarantee", "Aadhaar Verified"].map((badge) => (
                <span key={badge} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                  ? {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Specialist's Note to Customers</span>
            </h3>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "{pro.quote}"
            </p>
            <div className="p-3 bg-brand-50 rounded-2xl border border-brand-200 text-xs text-brand-800 font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600 shrink-0" />
              <span>CoopServe 30-Day Re-work Warranty covers all work performed.</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
