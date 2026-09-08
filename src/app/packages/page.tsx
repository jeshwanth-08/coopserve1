"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Filter,
  Check,
  Clock,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import { CURATED_SERVICE_PACKAGES, ServicePackageItem } from "@/lib/supportAndPackageData";

export default function PackagesPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPackage, setSelectedPackage] = useState<ServicePackageItem | null>(null);

  const filterOptions = [
    { id: "all", label: "All Bundles" },
    { id: "cleaning", label: "Cleaning & Hygiene" },
    { id: "ac", label: "AC & Appliances" },
    { id: "fullhome", label: "Full Home VIP" },
  ];

  const filteredPackages = CURATED_SERVICE_PACKAGES.filter((pkg) => {
    if (selectedFilter === "cleaning") return pkg.slug.includes("refresh") || pkg.slug.includes("move-in");
    if (selectedFilter === "ac") return pkg.slug.includes("ac");
    if (selectedFilter === "fullhome") return pkg.slug.includes("festive") || pkg.slug.includes("move-in");
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 pb-20">
        {/* Hero Header */}
        <section className="bg-gradient-to-b from-brand-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider mb-4">
              <Package className="w-4 h-4" />
              <span>Smart Bundles • Save Up to ?1,800</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Curated Service Packages for Every Milestone
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed">
              Why book multiple visits when you can get it all done in one shot? Enjoy bundled rates, dedicated specialist crews, and complete satisfaction guarantees.
            </p>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
              {filterOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedFilter === f.id
                      ? "bg-brand-500 text-white shadow-lg shadow-brand-500/30"
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                      {pkg.tag}
                    </span>

                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-xs font-bold bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-xl">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{pkg.rating}</span>
                      <span className="text-slate-300">({pkg.reviewsCount} verified reviews)</span>
                      <span className="text-slate-300">• {pkg.duration}</span>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-brand-600 transition-colors">
                        {pkg.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Included Services list */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                      <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
                        Included In This Package:
                      </p>
                      {pkg.includedServices.map((srv, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-xs text-slate-800">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{srv.name}: </span>
                            <span className="text-slate-600">{srv.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Popular Addons */}
                    {pkg.popularAddons && (
                      <div className="space-y-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Recommended Add-ons:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {pkg.popularAddons.map((addon, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                            >
                              <PlusCircle className="w-3.5 h-3.5 text-brand-600" />
                              <span>{addon.name}</span>
                              <span className="font-bold text-brand-600">+?{addon.price}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer price & CTA */}
                <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Save ?{pkg.savings} instantly
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-slate-900">?{pkg.packagePrice}</span>
                      <span className="text-sm text-slate-400 line-through">?{pkg.originalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/book/svc-1?package=${pkg.slug}`)}
                    className="px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 hover:scale-[1.02]"
                  >
                    <span>Book Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee banner */}
          <div className="mt-12 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">30-Day Re-work Satisfaction Guarantee</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  If any bundled service does not meet 100% quality criteria, we dispatch a senior inspector free of charge.
                </p>
              </div>
            </div>

            <Link
              href="/support"
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              Learn About Service Warranty
            </Link>
          </div>
        </section>
      </main>

      <MobileBottomNav onOpenBooking={() => router.push("/book/svc-1")} />
      <Footer />
    </div>
  );
}
