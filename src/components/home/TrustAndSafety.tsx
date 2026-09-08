"use client";

import React from "react";
import { ShieldCheck, Lock, Award, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function TrustAndSafety() {
  const pillars = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-brand-600" />,
      title: "100% Police & Skill Verified Pros",
      desc: "Every technician undergoes rigorous government identity background checks, criminal record verification, and in-person trade skill evaluation.",
    },
    {
      icon: <Lock className="w-8 h-8 text-amber-500" />,
      title: "Fixed Upfront Standardized Pricing",
      desc: "Zero doorstep surprises. Every service comes with a transparent rate card, genuine MRP spare part invoices, and no hidden visit fees.",
    },
    {
      icon: <Award className="w-8 h-8 text-emerald-600" />,
      title: "30-Day Free Rework Warranty",
      desc: "If any repair or service doesn't meet expectations, we send a senior specialist to inspect and rework it completely free of charge.",
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-indigo-600" />,
      title: "₹10,000 Damage Protection Cover",
      desc: "Your home is insured during every service visit. We stand behind our quality with a comprehensive damage protection policy.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>The CoopServe Promise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Trust & safety at every step
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            We hold ourselves to higher standards so you never have to worry about who is entering your home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:bg-white hover:border-brand-200 hover:shadow-card-hover transition-all duration-300 group card-hover-effect"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guaranteed Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
