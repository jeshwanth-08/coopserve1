"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2, MessageSquare, ArrowRight } from "lucide-react";
import { CUSTOMER_REVIEWS } from "@/lib/homeData";

export default function CustomerReviews() {
  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Customer Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Loved by 2,50,000+ Indian homes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Read authentic feedback from genuine service requests completed across India
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-black text-slate-900">4.89 / 5 Average Rating</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/90 hover:border-brand-300 p-5 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group card-hover-effect"
            >
              <div>
                {/* User Header */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-100"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{rev.name}</h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {rev.locality}, {rev.city}
                    </p>
                  </div>
                </div>

                {/* Rating & Service Tag */}
                <div className="flex items-center justify-between mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">
                    {rev.service}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Verified Stamp */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Booking
                </span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
