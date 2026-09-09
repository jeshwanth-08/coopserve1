"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Star,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Tag,
  Search,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import { CATEGORIES, POPULAR_SERVICES } from "@/lib/homeData";

export default function ServicesDirectoryPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onSelectLocation={(c, l) => {
          setSelectedCity(c);
          setSelectedLocality(l);
        }}
        onOpenSearch={() => router.push("/search")}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 pb-20">
        {/* SEO H1 Hero Header */}
        <section className="bg-slate-900 text-white pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Standard Upfront Pricing � 100% Background Verified</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Professional Home Maintenance Services in India
            </h1>
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Book doorstep AC technicians, deep cleaning specialists, master electricians, plumbers, and carpenters with 30-day rework guarantees.
            </p>
          </div>
        </section>

        {/* Categories Directory */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    {cat.badge && (
                      <span className="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                        {cat.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                        Starting from
                      </p>
                      <p className="text-xl font-black">₹{cat.startingPrice}</p>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                      {cat.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">{cat.tagline}</p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Top Booked Services:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.popularServices.map((srv, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md"
                          >
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    ? 30-Day Warranty
                  </span>
                  <Link
                    href={`/services/${cat.slug}`}
                    className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1"
                  >
                    <span>View Services</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Content Section for Search Ranking */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900">
              Why Indian Households Trust CoopServe for Doorstep Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">100% Background Verified Pros</h3>
                <p>
                  Every electrician, plumber, and technician undergoes Aadhaar biometric checks, police verification, and a 40-point hands-on skill assessment.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">Fixed Rate Cards</h3>
                <p>
                  Zero haggling or surprise extra charges on arrival. Every service includes standardized labour and transparent rate cards for spare parts.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900">30-Day Rework Warranty</h3>
                <p>
                  If something is not right, we dispatch our senior quality audit specialist to resolve the issue with zero additional visiting fee.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MobileBottomNav onOpenBooking={() => router.push("/book/svc-1")} />
      <Footer />
    </div>
  );
}
