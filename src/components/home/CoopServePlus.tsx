"use client";

import React from "react";
import { Crown, CheckCircle2, Zap, Shield, Sparkles, ArrowRight } from "lucide-react";

interface CoopServePlusProps {
  onOpenBooking: () => void;
}

export default function CoopServePlus({ onOpenBooking }: CoopServePlusProps) {
  const perks = [
    {
      title: "₹0 Visiting & Inspection Charges",
      desc: "Zero doorstep diagnosis fees across all 12 categories, forever.",
    },
    {
      title: "Flat 10% OFF Every Service",
      desc: "Automatically deducted at checkout on top of existing promo coupons.",
    },
    {
      title: "Priority 30-Minute Dispatch",
      desc: "Skip peak-hour queues with dedicated emergency slot routing.",
    },
    {
      title: "Extended 45-Day Rework Warranty",
      desc: "Complete peace of mind with senior technician re-inspections.",
    },
  ];

  return (
    <section id="plus-club" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-950 text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-brand-500/30">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>CoopServe Plus VIP Membership</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Save an average of <span className="text-amber-400">₹4,500/year</span> on home maintenance
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Join over 45,000+ Indian households who enjoy zero visiting fees, flat discounts on every booking, and priority emergency dispatch.
              </p>

              {/* Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {perks.map((perk, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{perk.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-0.5">{perk.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Pass Card */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                      Annual Pass
                    </span>
                    <h3 className="text-xl font-black text-slate-900">12 Months VIP Access</h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Crown className="w-5 h-5 fill-amber-500 text-amber-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900">₹499</span>
                    <span className="text-sm text-slate-400 line-through">₹1,499</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      66% OFF
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Pays for itself in just 1 AC service or 2 deep cleaning visits.
                  </p>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Activate CoopServe Plus</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-brand-600" />
                  <span>Cancel anytime • 100% Money-back guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
