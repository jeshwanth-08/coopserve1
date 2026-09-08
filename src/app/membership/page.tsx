"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Star,
  Percent,
  Gift,
  Home,
  ArrowRight,
  Sparkles,
  ChevronDown,
  X,
  Check,
  Clock,
  HeartHandshake,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import { MEMBERSHIP_BENEFITS, MEMBERSHIP_FAQS } from "@/lib/supportAndPackageData";

export default function MembershipPage() {
  const router = useRouter();
  const [isMemberActive, setIsMemberActive] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinStatus, setJoinStatus] = useState<"idle" | "processing" | "success">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Read saved membership status from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("coopserve_membership_active");
    if (saved === "true") {
      setIsMemberActive(true);
    }
  }, []);

  const handleJoinMembership = () => {
    setJoinStatus("processing");
    setTimeout(() => {
      localStorage.setItem("coopserve_membership_active", "true");
      setIsMemberActive(true);
      setJoinStatus("success");
    }, 1200);
  };

  const handleCancelMembership = () => {
    localStorage.removeItem("coopserve_membership_active");
    setIsMemberActive(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-400 selection:text-slate-900">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 pb-24">
        {/* Premium Dark Hero */}
        <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Ambient glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-6">
              <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>CoopServe HOME+ VIP Club</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              One Membership. <span className="text-amber-400">Zero Visiting Fees</span>. Endless Comfort.
            </h1>

            <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed">
              Experience the highest echelon of home maintenance. Enjoy flat 10% discounts on every service, priority 30-minute emergency dispatch, and 4 free diagnosis visits each year.
            </p>

            {/* Current Membership Status Banner */}
            <div className="mt-8 max-w-xl mx-auto p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                  isMemberActive ? "bg-amber-400 text-slate-950" : "bg-white/10 text-slate-400"
                }`}>
                  <Crown className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">Your Current Status</p>
                  <p className="text-sm font-black text-white flex items-center gap-1.5">
                    {isMemberActive ? (
                      <>
                        <span className="text-amber-400">HOME+ Active VIP Member</span>
                        <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                          Valid till Sep 2027
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-300">Standard Free Member</span>
                    )}
                  </p>
                </div>
              </div>

              {isMemberActive ? (
                <button
                  onClick={handleCancelMembership}
                  className="px-3 py-1.5 text-xs text-rose-300 hover:text-white hover:bg-rose-900/40 rounded-xl transition-colors font-semibold"
                >
                  Manage Pass
                </button>
              ) : (
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-400/30 transition-transform active:scale-95"
                >
                  Join HOME+
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Pricing Card & Key Benefits Overlap */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 5 Highlighted Benefits */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md">
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-600" />
                  <span>Exclusive HOME+ Member Privileges</span>
                </h3>

                <div className="space-y-4">
                  {MEMBERSHIP_BENEFITS.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-brand-300 transition-colors flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 font-bold">
                        <CheckCircle2 className="w-5 h-5 text-brand-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900">{benefit.title}</h4>
                          <span className="text-[10px] font-black uppercase text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                            {benefit.highlight}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{benefit.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Plan Card */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-400/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[11px] font-black px-4 py-1 rounded-bl-2xl uppercase tracking-wider">
                  Limited Launch Rate
                </div>

                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Crown className="w-4 h-4 fill-amber-400" />
                    <span>Annual VIP Pass</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    HOME+ All-Access
                  </h3>

                  <div className="pt-2 flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white">?999</span>
                    <span className="text-base text-slate-400">/year</span>
                    <span className="text-xs text-amber-400 line-through">?2,499</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Just ?83/month. Pays for itself in your first 2 household bookings!
                  </p>

                  <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs text-slate-200">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>10% flat discount applied automatically</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>4 free inspection & diagnosis visits (?796 value)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Priority emergency dispatch under 30 minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>60-day rework satisfaction warranty</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>30-day 100% money-back guarantee</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (isMemberActive) {
                        alert("You are already enjoying HOME+ benefits!");
                      } else {
                        setShowJoinModal(true);
                      }
                    }}
                    className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isMemberActive
                        ? "bg-emerald-500 text-white cursor-default"
                        : "bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-400/25 active:scale-95"
                    }`}
                  >
                    {isMemberActive ? (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        <span>Active HOME+ Member</span>
                      </>
                    ) : (
                      <>
                        <span>Join HOME+ for ?999/year</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-[11px] text-slate-400">
                    Secure 256-bit SSL encrypted checkout. Cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Membership FAQs */}
          <div className="mt-16 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h3 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h3>
              <p className="text-xs text-slate-500 mt-1">
                Everything you need to know about your HOME+ VIP subscription.
              </p>
            </div>

            <div className="divide-y divide-slate-100 max-w-3xl mx-auto">
              {MEMBERSHIP_FAQS.map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-brand-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed animate-in fade-in duration-150">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Join HOME+ Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative space-y-6">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {joinStatus === "success" ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Crown className="w-8 h-8 fill-emerald-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Welcome to HOME+!</h3>
                <p className="text-xs text-slate-600">
                  Your 1-year VIP pass is now active on your account. 10% discounts and free visiting fees will be automatically applied to your next booking.
                </p>
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs font-bold text-amber-800">
                  Pass ID: HP-2026-8942 • Valid till Sep 2027
                </div>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs"
                >
                  Start Booking With Benefits
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Crown className="w-5 h-5 fill-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Activate HOME+ Pass</h3>
                    <p className="text-xs text-slate-500">12 Months Subscription</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>1-Year HOME+ VIP Membership</span>
                    <span className="font-bold text-slate-900">?999</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Applicable GST (18%)</span>
                    <span className="font-bold text-slate-900">Included</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-slate-900 text-sm">
                    <span>Total Payable</span>
                    <span className="text-brand-600">?999</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Select Payment Method</label>
                  <div className="p-3 rounded-xl border border-brand-500 bg-brand-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-bold text-slate-900">UPI (Google Pay / PhonePe / Paytm)</span>
                    </div>
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">Fast</span>
                  </div>
                </div>

                <button
                  disabled={joinStatus === "processing"}
                  onClick={handleJoinMembership}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2"
                >
                  {joinStatus === "processing" ? (
                    <span>Activating Your VIP Pass...</span>
                  ) : (
                    <>
                      <span>Pay ?999 & Join HOME+</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <MobileBottomNav onOpenBooking={() => router.push("/book/svc-1")} />
      <Footer />
    </div>
  );
}
