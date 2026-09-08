"use client";

import React, { useState } from "react";
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight } from "lucide-react";
import { LIMITED_OFFERS } from "@/lib/homeData";

interface LimitedTimeOffersProps {
  onOpenBooking: () => void;
}

export default function LimitedTimeOffers({ onOpenBooking }: LimitedTimeOffersProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="offers" className="py-12 sm:py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow blurs */}
      <div className="absolute -top-24 left-1/4 w-96 h-96 bg-brand-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-bold border border-amber-400/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Limited-Time Deals</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Save more on every home booking
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Apply coupon codes during checkout for instant discounts and cashback rewards
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5" />
            <span>Offers refresh in 08h : 42m : 15s</span>
          </div>
        </div>

        {/* Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LIMITED_OFFERS.map((offer) => (
            <div
              key={offer.code}
              className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/80 hover:border-brand-400 p-6 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${offer.tagColor}`}>
                    {offer.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{offer.expiry}</span>
                </div>

                <h3 className="text-2xl font-black text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {offer.subtitle}
                </p>
                <p className="text-[11px] text-slate-400">
                  Minimum booking value: <strong className="text-slate-200">{offer.minBooking}</strong>
                </p>
              </div>

              {/* Coupon Box */}
              <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-2 rounded-xl border border-dashed border-slate-600 font-mono text-xs font-bold text-amber-300">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>{offer.code}</span>
                </div>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    copiedCode === offer.code
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-white/10 hover:bg-white text-white hover:text-slate-900"
                  }`}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
