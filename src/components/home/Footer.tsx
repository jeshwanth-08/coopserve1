"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  Download,
  Smartphone,
} from "lucide-react";
import { INDIAN_CITIES, CATEGORIES } from "@/lib/homeData";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Top brand & contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-slate-800/80 pb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block bg-white rounded-2xl px-4 py-2.5 shadow-md group transition-transform hover:scale-105" title="CoopServe - Collaborative Service & Community">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="CoopServe - Collaborative Service & Community"
                className="h-10 w-auto object-contain"
              />
            </Link>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              India's premier home services cooperative connecting households with background-verified, certified professionals with standardized fixed upfront pricing and 30-day rework warranty.
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <a href="tel:18004192667" className="flex items-center gap-1.5 hover:text-white">
                <Phone className="w-3.5 h-3.5 text-brand-400" /> 1800-419-COOP
              </a>
              <a href="mailto:help@coopserve.in" className="flex items-center gap-1.5 hover:text-white">
                <Mail className="w-3.5 h-3.5 text-brand-400" /> help@coopserve.in
              </a>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Twitter
              </a>
              <span>�</span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
              <span>�</span>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                LinkedIn
              </a>
              <span>�</span>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
            </div>
          </div>

          {/* Company & About Us */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/support" className="hover:text-white transition-colors block font-semibold text-slate-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  Careers (We&apos;re Hiring)
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-white transition-colors block">
                  Service Packages
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-white transition-colors block">
                  HOME+ Membership
                </Link>
              </li>
            </ul>

            {/* Download Option Near About Us */}
            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                Get Mobile App
              </span>
              <a
                href="/CoopServe.apk"
                download="CoopServe.apk"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-[11px] transition-all group"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>Download .APK</span>
              </a>
              <div>
                <Link
                  href="/download/app"
                  className="text-[10px] text-slate-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                >
                  <Smartphone className="w-3 h-3 text-slate-500" />
                  <span>Scan QR / PWA Guide →</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Services & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  Raise Support Ticket
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="hover:text-white transition-colors block">
                  Notification Center
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  30-Day Service Warranty
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Professionals & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Professionals & Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/register?role=PROVIDER" className="hover:text-white transition-colors block">
                  Become a Professional
                </Link>
              </li>
              <li>
                <Link href="/login?returnUrl=/provider" className="hover:text-white transition-colors block">
                  Professional Login
                </Link>
              </li>
              <li>
                <Link href="/login?returnUrl=/admin" className="hover:text-white transition-colors block">
                  Coordinator Admin Desk
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-white transition-colors block">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* App Download Section */}
        <div className="py-8 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Download CoopServe Mobile App</h4>
              <p className="text-slate-400 text-xs">Available on iOS App Store and Google Play Store</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Downloading CoopServe for Android...")}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>Google Play</span>
            </button>
            <button
              onClick={() => alert("Downloading CoopServe for iOS...")}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-brand-400" />
              <span>App Store</span>
            </button>
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
                <strong>{c.name}:</strong> {c.localities.join(" � ")}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment badges */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <div className="flex items-center gap-2">
            <span>� 2026 CoopServe Technologies Pvt. Ltd. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure Checkout
            </span>
            <span>�</span>
            <span>UPI � RuPay � Visa � Mastercard � NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
