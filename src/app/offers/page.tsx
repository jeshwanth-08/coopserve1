"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, Sparkles, Copy, Check, ArrowRight, Clock, Percent } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import { LIMITED_OFFERS } from "@/lib/homeData";

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => {}}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Exclusive Promotional Coupons</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">CoopServe Deals & Offers</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Apply these coupon codes during checkout to enjoy instant platform cashbacks and discounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LIMITED_OFFERS.map((offer) => (
            <div
              key={offer.code}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">{offer.title}</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {offer.expiry}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{offer.subtitle}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-mono text-xs font-black text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
                  {offer.code}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(offer.code)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                  >
                    {copiedCode === offer.code ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === offer.code ? "Copied" : "Copy"}</span>
                  </button>

                  <Link
                    href="/book/svc-1"
                    className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MobileBottomNav onOpenBooking={() => {}} />
      <Footer />
    </div>
  );
}
