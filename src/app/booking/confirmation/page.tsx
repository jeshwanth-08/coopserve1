"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Download,
  Share2,
  LayoutDashboard,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "BK-849201";
  const serviceName = searchParams.get("service") || "Power Jet AC Service";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => {}}
      />

      <main className="flex-1 pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Your Service is Scheduled!
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Order Reference ID: <strong className="font-mono text-slate-900">{bookingId}</strong>
            </p>
          </div>

          {/* Details Card */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500 font-bold">Service:</span>
              <span className="font-black text-slate-900">{serviceName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500 font-bold">Scheduled Slot:</span>
              <span className="font-black text-slate-900">Tomorrow, 03:00 PM</span>
            </div>
            <div className="flex justify-between border-b border-slate-200/70 pb-2.5">
              <span className="text-slate-500 font-bold">Specialist:</span>
              <span className="font-black text-slate-900">Rahul Kumar (? 4.9)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Service Guarantee:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 30-Day Free Rework Cover
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href={`/tracking/${bookingId}`}
              className="py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all"
            >
              <span>Live GPS Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/booking/${bookingId}`}
              className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Manage Booking</span>
            </Link>
            <Link
              href="/member"
              className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-emerald-200/60"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
