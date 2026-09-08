"use client";

import React, { useState } from "react";
import { Smartphone, Send, Check, QrCode, Sparkles, Star } from "lucide-react";

export default function DownloadAppBanner() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkSent, setLinkSent] = useState(false);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length >= 10) {
      setLinkSent(true);
      setTimeout(() => setLinkSent(false), 4000);
      setPhoneNumber("");
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-indigo-950 via-slate-900 to-brand-950 text-white relative overflow-hidden">
      {/* Background glow blurs */}
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left info & input */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-400/20 border border-brand-400/30 text-brand-300 text-xs font-bold">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Available for iOS & Android</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Get the CoopServe App for seamless booking
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Track your service pro on live GPS, manage instant emergency dispatches, and unlock app-exclusive coupons and cashback.
            </p>

            {/* Ratings counter */}
            <div className="flex items-center gap-6 pt-1">
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-base font-black text-white">4.8★</span>
                </div>
                <p className="text-[11px] text-slate-400">App Store Rating</p>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div>
                <span className="text-base font-black text-white">1 Million+</span>
                <p className="text-[11px] text-slate-400">Downloads across India</p>
              </div>
            </div>

            {/* SMS Link Input Form */}
            <div className="pt-2 max-w-md">
              <form onSubmit={handleSendLink} className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-brand-400 focus:bg-white/15"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-500/30 transition-all flex items-center gap-1.5 shrink-0"
                >
                  {linkSent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Sent!</span>
                    </>
                  ) : (
                    <>
                      <span>Get Link</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
              {linkSent && (
                <p className="text-xs text-emerald-400 mt-2 font-medium">
                  ✓ Download link sent via SMS with promo code APP50!
                </p>
              )}
            </div>
          </div>

          {/* Right Phone Mockup & QR */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Phone Display */}
            <div className="w-56 h-[380px] bg-slate-900 rounded-[40px] border-4 border-slate-700 shadow-2xl p-3 relative overflow-hidden flex flex-col justify-between">
              {/* Camera Notch */}
              <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* App Screen Content Preview */}
              <div className="bg-slate-950 rounded-2xl p-3 flex-1 flex flex-col justify-between border border-slate-800 text-left">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-brand-400">CoopServe</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold">
                      GPS Live
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800 text-[10px]">
                    <p className="font-bold text-white">Technician on the way</p>
                    <p className="text-slate-400 text-[9px]">Arriving in 14 mins • Marcus T.</p>
                  </div>
                </div>

                <div className="bg-brand-600 p-2.5 rounded-xl text-center text-[10px] font-bold text-white">
                  ⚡ 1-Click Urgent Dispatch
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
            </div>

            {/* QR Code Box */}
            <div className="bg-white text-slate-900 p-5 rounded-3xl text-center shadow-xl border border-white space-y-2 shrink-0">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl p-2 mx-auto flex items-center justify-center border border-slate-200">
                <QrCode className="w-20 h-20 text-slate-900" />
              </div>
              <p className="text-[11px] font-black text-slate-900">Scan to Install</p>
              <p className="text-[9px] text-slate-500">iOS & Android</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
