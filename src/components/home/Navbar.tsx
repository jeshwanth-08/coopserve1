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
  Crown,
  Package,
  LogOut,
  Bell,
  Camera,
  Download,
  HeartHandshake,
} from "lucide-react";
import { INDIAN_CITIES } from "@/lib/homeData";
import LocationSelectorModal from "@/components/location/LocationSelectorModal";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useLanguage } from "@/lib/i18nContext";

interface NavbarProps {
  selectedCity: string;
  selectedLocality: string;
  onSelectLocation: (city: string, locality: string) => void;
  onOpenSearch: () => void;
  onOpenBooking: (serviceName?: string) => void;
  currentUser?: any | null;
  onSignOut?: () => void;
}

export default function Navbar({
  selectedCity,
  selectedLocality,
  onSelectLocation,
  onOpenSearch,
  onOpenBooking,
  currentUser,
  onSignOut,
}: NavbarProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<any | null>(currentUser || null);

  useEffect(() => {
    if (currentUser !== undefined) {
      setSessionUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser === undefined) {
      fetch("/api/auth/me")
        .then((res) => (res.ok ? res.json() : { user: null }))
        .then((d) => {
          if (d?.user) setSessionUser(d.user);
        })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setSessionUser(null);
      if (onSignOut) onSignOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  const handleQuickDemo = async (email: string) => {
    try {
      const res = await fetch("/api/auth/quick-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (data.success) {
        setSessionUser(data.user);
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
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between min-h-[4rem] h-auto py-1.5 gap-2 sm:gap-3 lg:gap-4">
            {/* Left: Brand Logo & Navigation Bar Links (aligned from the left starting from the logo) */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5 flex-1 min-w-0">
              <Link href="/" className="flex items-center gap-2 group shrink-0 py-1" title="CoopServe - Collaborative Service & Community">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="CoopServe - Collaborative Service & Community"
                  className="h-9 sm:h-10 xl:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>

              {/* Location Selector */}
              <div className="hidden md:flex items-center shrink-0">
                <button
                  onClick={() => setShowLocationModal(true)}
                  type="button"
                  className="flex items-center gap-1.5 h-9 px-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-all text-xs font-semibold text-slate-700 shrink-0 shadow-sm"
                >
                  <div className="w-5 h-5 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    <MapPin className="w-3 h-3 text-brand-600" />
                  </div>
                  <div className="leading-tight">
                    <span className="text-slate-800 font-bold flex items-center gap-1 text-xs">
                      <span className="truncate max-w-[90px] md:max-w-[110px] xl:max-w-[140px] inline-block">
                        {selectedLocality}, {selectedCity}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                    </span>
                  </div>
                </button>
              </div>

              {/* Primary Navigation Links starting from left */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0 ml-1">
                {/* Bundled Packages */}
                <Link
                  href="/packages"
                  className="flex items-center gap-1 xl:gap-1.5 h-9 px-2 xl:px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <Package className="w-3.5 h-3.5 text-brand-600" />
                  <span>{t("nav.packages", "Packages")}</span>
                </Link>

                {/* 🛡️ Worker Welfare & e-Shram Portal */}
                <Link
                  href="/provider/welfare"
                  className="flex items-center gap-1 xl:gap-1.5 h-9 px-2 xl:px-3 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/80 transition-colors shrink-0"
                  title="Worker Welfare Fund & e-Shram Integration"
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t("nav.welfare", "Welfare & e-Shram")}</span>
                </Link>

                {/* VIP Membership */}
                <Link
                  href="/membership"
                  className="flex items-center gap-1 xl:gap-1.5 h-9 px-2 xl:px-3 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200/70 transition-colors shrink-0"
                  title="VIP Membership"
                >
                  <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>VIP</span>
                </Link>

                {/* 24/7 Support Hub */}
                <Link
                  href="/support"
                  className="flex items-center gap-1 xl:gap-1.5 h-9 px-2 xl:px-3 rounded-xl text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-50 transition-colors shrink-0"
                  title="Help & Support Hub"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t("nav.support", "Support")}</span>
                </Link>
              </nav>
            </div>

            {/* Right: Actions, Switcher & Persona Demo */}
            <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0">
              {/* Multilingual Language Switcher */}
              <div className="hidden sm:block shrink-0">
                <LanguageSwitcher variant="navbar" />
              </div>

              {/* Notifications Bell */}
              <Link
                href="/notifications"
                className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-brand-600 hover:bg-slate-100 transition-colors relative shrink-0"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
              </Link>

              {/* Evaluator 1-Click Switcher Dropdown */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowDemoMenu(!showDemoMenu)}
                  className="flex items-center gap-1.5 h-9 px-2.5 xl:h-10 xl:px-3.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold transition-all shadow-sm"
                >
                  <Users className="w-3.5 h-3.5 text-brand-600" />
                  <span className="hidden xl:inline">1-Click Demo</span>
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

                      <button
                        onClick={() => {
                          handleSignOut();
                          setShowDemoMenu(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 flex items-center justify-between group transition-colors border-t border-slate-100 mt-1"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                            <LogOut className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700">Public Guest Mode</p>
                            <p className="text-[10px] text-slate-400">Log out & view as guest</p>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Exit</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Login / Auth CTAs or Role Portal Button (Visible on lg+ so tablets and phones use the dedicated drawer menu) */}
              <div className="hidden lg:flex items-center gap-1.5 shrink-0">
                {sessionUser ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenBooking()}
                      type="button"
                      className="h-9 px-3 xl:h-10 xl:px-3.5 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border border-brand-200 transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                      <span>Book a Service</span>
                    </button>

                    <Link
                      href={
                        sessionUser.role === "ADMIN"
                          ? "/admin"
                          : sessionUser.role === "PROVIDER"
                          ? "/provider"
                          : "/member"
                      }
                      className={`h-9 px-3 xl:h-10 xl:px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
                        sessionUser.role === "ADMIN"
                          ? "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20"
                          : sessionUser.role === "PROVIDER"
                          ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20"
                          : "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20"
                      }`}
                    >
                      <span>
                        {sessionUser.role === "ADMIN"
                          ? "Admin"
                          : sessionUser.role === "PROVIDER"
                          ? "Provider"
                          : "Member"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden xl:inline" />
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="h-9 px-2 xl:h-10 xl:px-2.5 text-xs font-semibold text-slate-500 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors shrink-0"
                      title="Log Out (Switch to Guest)"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center h-9 px-2.5 xl:h-10 xl:px-3.5 text-xs font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors shrink-0"
                    >
                      Sign In
                    </Link>
                    <button
                      onClick={() => {
                        router.push("/login?returnUrl=/services");
                      }}
                      type="button"
                      className="h-9 px-3 xl:h-10 xl:px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 active:bg-brand-800 rounded-xl shadow-md shadow-brand-500/25 hover:shadow-brand-500/40 transition-all flex items-center gap-1.5 shrink-0 active:scale-[0.98] whitespace-nowrap"
                    >
                      <span className="whitespace-nowrap">Book a Service</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
                    </button>
                  </>
                )}
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
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-4rem)] overflow-y-auto">
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

            {/* Mobile Language Switcher */}
            <LanguageSwitcher variant="mobile" />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href="/login"
                className="w-full py-2.5 text-center text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                {t("nav.login", "Sign In")}
              </Link>
              <Link
                href="/register"
                className="w-full py-2.5 text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm shadow-brand-500/20"
              >
                {t("nav.register", "Join CoopServe")}
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/provider/welfare"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                <span>Welfare & e-Shram</span>
              </Link>
              <Link
                href="/download/app"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span>Download .APK</span>
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
              <Link
                href="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-brand-700 hover:bg-brand-50 rounded-lg"
              >
                <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
                <span>{t("nav.support", "24/7 Help & Support Center")}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Location Selector & Saved Addresses Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onSelectLocation={onSelectLocation}
      />
    </>
  );
}
