"use client";

import React from "react";
import { Sparkles, Calendar, Coffee, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose a service",
      description: "Explore 100+ standardized home services with fixed transparent pricing, honest descriptions, and zero hidden visit fees.",
      icon: <Sparkles className="w-6 h-6 text-brand-600" />,
      features: ["Fixed upfront pricing", "Genuine OEM spares", "Verified rating reviews"],
      badgeColor: "bg-brand-50 text-brand-700 border-brand-200"
    },
    {
      num: "02",
      title: "Pick a time",
      description: "Select an instant 45–60 min emergency slot or pick any convenient 2-hour scheduled window that fits your day.",
      icon: <Calendar className="w-6 h-6 text-amber-600" />,
      features: ["Instant 45-min dispatch", "Flexible 2-hour slots", "Free rescheduling"],
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
    },
    {
      num: "03",
      title: "Relax — we handle the rest",
      description: "A top-rated, police-verified specialist arrives at your doorstep equipped with industry-grade tools and safety gear.",
      icon: <Coffee className="w-6 h-6 text-emerald-600" />,
      features: ["30-Day rework warranty", "₹10,000 damage cover", "Pay after service"],
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200"
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>Frictionless Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How CoopServe works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            From tap leaks to complete home deep cleans, book reliable assistance in three effortless steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting line across desktop */}
          <div className="hidden md:block absolute top-1/3 left-16 right-16 h-0.5 bg-gradient-to-r from-brand-200 via-amber-200 to-emerald-200 -z-0" />

          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-3xl border border-slate-200/80 hover:border-brand-300 p-6 sm:p-7 shadow-sm hover:shadow-card-hover transition-all duration-300 relative z-10 flex flex-col justify-between group card-hover-effect"
            >
              <div>
                {/* Step header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-brand-600 transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Feature checkpoints */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                {step.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
