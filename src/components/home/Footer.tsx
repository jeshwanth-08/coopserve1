"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Phone, Mail, ShieldCheck, Heart } from "lucide-react";
import { INDIAN_CITIES, CATEGORIES } from "@/lib/homeData";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top brand & contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-slate-800/80 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  Coop<span className="text-brand-400">Serve</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium -mt-1">
                  Your home. Taken care of.
                </span>
              </div>
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              India's premier home services network connecting households with background-verified, certified professionals with standardized fixed upfront pricing and 30-day rework warranty.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-brand-400" /> 1800-419-COOP
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> help@coopserve.in
              </span>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Core Services
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#categories"
                    className="hover:text-white transition-colors block truncate"
                  >
                    {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Specialized
            </h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <a
                    href="#categories"
                    className="hover:text-white transition-colors block truncate"
                  >
                    {cat.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* For Partners & Evaluators */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Platform & Pro
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Join as Partner Specialist
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Partner Portal Login
                </Link>
              </li>
              <li>
                <a href="#plus-club" className="hover:text-white transition-colors">
                  CoopServe Plus Pass
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-white transition-colors">
                  Offers & Coupons
                </a>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Admin Dispatch Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Operating Cities Directory */}
        <div className="py-8 border-b border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-400" /> Serving Metropolitan India
          </h4>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-400">
            {INDIAN_CITIES.map((c) => (
              <span key={c.name} className="hover:text-slate-200 cursor-pointer">
                <strong>{c.name}:</strong> {c.localities.join(" • ")}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 CoopServe Technologies Pvt. Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure Checkout
            </span>
            <span>•</span>
            <span>UPI • RuPay • Visa • Mastercard • NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
