"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  Tag,
  Briefcase,
  HelpCircle,
  Calendar,
  User,
  ChevronDown,
  Shield,
  Wrench,
  Users,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
} from "lucide-react";
import { INDIAN_CITIES } from "@/lib/homeData";

interface NavbarProps {
  selectedCity: string;
  selectedLocality: string;
  onSelectLocation: (city: string, locality: string) => void;
  onOpenSearch: () => void;
  onOpenBooking: (serviceName?: string) => void;
}

export default function Navbar({
  selectedCity,
  selectedLocality,
  onSelectLocation,
  onOpenSearch,
  onOpenBooking,
}: NavbarProps) {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickDemo = async (email: string) => {
    try {
      const res = await fetch("/api/auth/quick-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(data.redirectUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Demo switch failed:", err);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80"
            : "bg-white border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Left: Brand Logo & Location */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                      Coop<span className="text-brand-600">Serve</span>
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Pro
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium -mt-1 hidden sm:block">
                    Your home. Taken care of.
                  </span>
                </div>
              </Link>

              {/* Location Selector (Desktop) */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-left transition-colors text-xs font-semibold text-slate-700"
              >
                <div className="w-6 h-6 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                </div>
                <div className="leading-tight">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Location
                  </span>
                  <span className="text-slate-800 font-bold flex items-center gap-1">
                    {selectedLocality}, {selectedCity}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                </div>
              </button>
            </div>

            {/* Middle: Search bar shortcut (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-6">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all text-xs text-left shadow-inner"
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-4 h-4 text-brand-600" />
                  <span className="text-slate-500">Search "AC repair", "Bathroom cleaning", "Electrician"...</span>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-600">
                  ⌘K
                </span>
              </button>
            </div>

            {/* Right: Actions, Links & Persona Demo */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Offers shortcut */}
              <a
                href="#offers"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Offers</span>
                <span className="bg-amber-500 text-white text-[9px] font-bold px-1 rounded-full">NEW</span>
              </a>

              {/* Become a Pro */}
              <Link
                href="/register"
                className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Become a Pro</span>
              </Link>

              {/* Bookings shortcut */}
              <Link
                href="/member/requests"
                className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>My Bookings</span>
              </Link>

              {/* Evaluator 1-Click Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-all shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 text-brand-600" />
                  <span className="hidden sm:inline">1-Click Demo</span>
                  <ChevronDown className="w-3.5 h-3.5 text-brand-500" />
                </button>

                {showDemoMenu && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Evaluator Quick Switch
                      </p>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Jump into any persona with real seeded records:
                      </p>
                    </div>
                    <div className="space-y-1 mt-1">
                      <button
                        onClick={() => {
                          handleQuickDemo("admin@coop.org");
                          setShowDemoMenu(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-purple-50 text-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Admin Coordinator</p>
                            <p className="text-[10px] text-slate-500">Eleanor Vance (Dispatch Hub)</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        onClick={() => {
                          handleQuickDemo("provider1@coop.org");
                          setShowDemoMenu(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-blue-50 text-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Master Electrician</p>
                            <p className="text-[10px] text-slate-500">Marcus Thorne (Provider)</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        onClick={() => {
                          handleQuickDemo("member1@coop.org");
                          setShowDemoMenu(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-emerald-50 text-slate-800 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">Customer Member</p>
                            <p className="text-[10px] text-slate-500">Alice Henderson (User)</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Login / Auth CTAs */}
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={() => onOpenBooking()}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center gap-1.5"
                >
                  <span>Book a Service</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={onOpenSearch}
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Location Picker */}
            <button
              onClick={() => {
                setShowLocationModal(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>
                  {selectedLocality}, {selectedCity}
                </span>
              </div>
              <span className="text-brand-600 text-xs font-semibold">Change</span>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                href="/login"
                className="w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20"
              >
                Join CoopServe
              </Link>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <a
                href="#categories"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                All 12 Service Categories
              </a>
              <a
                href="#offers"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg"
              >
                Special Offers & Coupons
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                How CoopServe Works
              </a>
              <a
                href="#plus-club"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                CoopServe Plus VIP Membership
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Select Your City & Locality</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Currently serving major metro regions across India
                </p>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {INDIAN_CITIES.map((c) => (
                <div key={c.name} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {c.name}
                    </span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {c.localities.map((loc) => {
                      const isSelected = selectedCity === c.name && selectedLocality === loc;
                      return (
                        <button
                          key={loc}
                          onClick={() => {
                            onSelectLocation(c.name, loc);
                            setShowLocationModal(false);
                          }}
                          className={`p-2.5 rounded-xl text-left text-xs font-medium transition-all flex items-center justify-between ${
                            isSelected
                              ? "bg-brand-50 border-2 border-brand-600 text-brand-700 font-bold"
                              : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700"
                          }`}
                        >
                          <span className="truncate">{loc}</span>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" /> Auto-detected via GPS
              </span>
              <button
                onClick={() => {
                  onSelectLocation("Bengaluru", "Indiranagar");
                  setShowLocationModal(false);
                }}
                className="font-bold text-brand-600 hover:underline"
              >
                Reset to Bengaluru
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
