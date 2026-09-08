"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2, Award, ArrowRight } from "lucide-react";
import { TOP_PROFESSIONALS } from "@/lib/homeData";

interface BestRatedProsProps {
  onOpenBooking: () => void;
}

export default function BestRatedPros({ onOpenBooking }: BestRatedProsProps) {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
              <Award className="w-3.5 h-3.5 text-brand-600" />
              <span>Top 1% Tier Specialists</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Best-rated professionals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every partner is 3-step background-verified, trade certified, and equipped with genuine spare parts.
            </p>
          </div>

          <button
            onClick={onOpenBooking}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Request Top Specialist</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Pros Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOP_PROFESSIONALS.map((pro) => (
            <div
              key={pro.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-300 p-5 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group card-hover-effect"
            >
              <div>
                {/* Pro Avatar & Rating */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-100 group-hover:scale-105 transition-transform"
                    />
                    {pro.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-sm">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {pro.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">{pro.city}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-black text-slate-900">{pro.rating}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        ({pro.reviewsCount})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Role & Specialty */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 block text-center truncate">
                    {pro.role}
                  </span>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    "{pro.quote}"
                  </p>
                </div>
              </div>

              {/* Stats Bar & Action */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {pro.jobsCompleted}+
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Jobs Done</span>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded-lg">
                    <span className="text-xs font-extrabold text-slate-900 block">
                      {pro.experienceYears} Yrs
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Experience</span>
                  </div>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-brand-600 text-slate-700 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1 group-hover:bg-brand-600 group-hover:text-white"
                >
                  <span>Book with {pro.name.split(" ")[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
