"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  Zap,
  Phone,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  User,
  CreditCard,
  Tag,
  Bell,
  HelpCircle,
  Bookmark,
  PlusCircle,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Trash2,
  Edit2,
  Crown,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import MobileBottomNav from "@/components/home/MobileBottomNav";
import {
  POPULAR_SERVICES,
  TOP_PROFESSIONALS,
  LIMITED_OFFERS,
  CUSTOMER_REVIEWS,
  FAQS,
  INDIAN_CITIES,
} from "@/lib/homeData";
import { INITIAL_NOTIFICATIONS, INITIAL_ADDRESSES, SavedAddress } from "@/lib/supportAndPackageData";
import LocationSelectorModal from "@/components/location/LocationSelectorModal";
import StateFeedback from "@/components/ui/StateFeedback";

type TabType =
  | "overview"
  | "bookings"
  | "upcoming"
  | "past"
  | "saved"
  | "addresses"
  | "payments"
  | "coupons"
  | "reviews"
  | "notifications"
  | "profile"
  | "help";

export default function CustomerAccountDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [bookingSubFilter, setBookingSubFilter] = useState<"ALL" | "ACTIVE" | "COMPLETED" | "CANCELLED">("ALL");
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Time based greeting
  const [greeting, setGreeting] = useState("Good morning 👋");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning 👋");
    else if (hour < 17) setGreeting("Good afternoon 👋");
    else setGreeting("Good evening 👋");
  }, []);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [selectedLocality, setSelectedLocality] = useState("Indiranagar");

  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);

  useEffect(() => {
    const saved = localStorage.getItem("coopserve_saved_addresses");
    if (saved) {
      try {
        setAddresses(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [showLocationModal]);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: "overview", label: "Overview", icon: <Sparkles className="w-4 h-4" /> },
    { id: "bookings", label: "All Bookings", icon: <Calendar className="w-4 h-4" /> },
    { id: "upcoming", label: "Upcoming", icon: <Clock className="w-4 h-4" />, badge: "1 Active" },
    { id: "past", label: "Past Bookings", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "saved", label: "Saved Professionals", icon: <Bookmark className="w-4 h-4" /> },
    { id: "addresses", label: "Addresses", icon: <MapPin className="w-4 h-4" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="w-4 h-4" /> },
    { id: "coupons", label: "Coupons", icon: <Tag className="w-4 h-4" />, badge: "3 New" },
    { id: "reviews", label: "My Reviews", icon: <Star className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" />, badge: "2" },
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "help", label: "Help & Support", icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white pb-16 md:pb-0">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => router.push("/search")}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Customer Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 sticky top-24">
            {/* Customer Profile Mini Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-brand-500/20">
                A
              </div>
              <div className="truncate">
                <h3 className="text-sm font-black text-slate-900 truncate">Aarav Mehta</h3>
                <p className="text-[11px] text-slate-500">aarav.mehta@gmail.com</p>
                <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Coop Plus Member
                </span>
              </div>
            </div>

            {/* Navigation Tabs List */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-brand-600 text-white shadow-sm shadow-brand-500/20"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-brand-50 text-brand-700 border border-brand-200"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Active Tab View Container */}
          <div className="lg:col-span-9 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Greeting Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {greeting}, Aarav!
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Welcome to your personal CoopServe home maintenance portal.
                    </p>
                  </div>

                  <Link
                    href="/book/svc-1"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Book New Service</span>
                  </Link>
                </div>

                {/* Upcoming Booking Card (Required by prompt) */}
                <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-500/30 space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[10px] uppercase font-black tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-full border border-amber-400/30">
                      Upcoming Active Service
                    </span>
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Confirmed
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white">AC Service</h2>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" /> Tomorrow
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-400" /> 3:00 PM
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-white font-bold">
                          Professional: Rahul (★ 4.9)
                        </span>
                      </div>
                    </div>

                    <Link
                      href="/tracking/BK-849201"
                      className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Track professional</span>
                    </Link>
                  </div>
                </div>

                {/* Quick Shortcuts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    onClick={() => router.push("/book/svc-5?prefilled=true&pro=Rahul")}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-brand-300 shadow-sm cursor-pointer card-hover-effect space-y-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Book AC Service again</h3>
                    <p className="text-xs text-slate-500">
                      1-Click rebooking with prefilled address and preferred 4.9★ pro Rahul.
                    </p>
                  </div>


                  <div
                    onClick={() => setActiveTab("addresses")}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-brand-300 shadow-sm cursor-pointer card-hover-effect space-y-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">Manage 3 Addresses</h3>
                    <p className="text-xs text-slate-500">
                      Home, Work & Palm Meadows residences configured.
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab("coupons")}
                    className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-brand-300 shadow-sm cursor-pointer card-hover-effect space-y-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Tag className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">3 Coupons Available</h3>
                    <p className="text-xs text-slate-500">
                      Save up to ₹250 on deep cleaning & AC packs.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ALL / UPCOMING / PAST BOOKINGS TAB */}
            {(activeTab === "bookings" || activeTab === "upcoming" || activeTab === "past") && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      {activeTab === "upcoming"
                        ? "Upcoming Bookings"
                        : activeTab === "past"
                        ? "Past Completed Services"
                        : "All Bookings History"}
                    </h2>
                    <p className="text-xs text-slate-500">Live service tracking, invoices, and repeat bookings</p>
                  </div>

                  {/* Subfilters */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    {(["ALL", "ACTIVE", "COMPLETED", "CANCELLED"] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setBookingSubFilter(filter)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          bookingSubFilter === filter
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {filter === "ALL" && "All (2)"}
                        {filter === "ACTIVE" && "Active (1)"}
                        {filter === "COMPLETED" && "Completed (1)"}
                        {filter === "CANCELLED" && "Cancelled (0)"}
                      </button>
                    ))}
                  </div>
                </div>

                {bookingSubFilter === "CANCELLED" ? (
                  <StateFeedback
                    variant="empty_bookings"
                    title="Nothing booked yet 👀"
                    description="Your home is waiting. Or perhaps your home is behaving… for now 😌"
                    actionText="Let’s fix it"
                    actionHref="/services"
                  />
                ) : (
                  <div className="space-y-3">
                    {/* Booking 1: Upcoming Active */}
                    {(bookingSubFilter === "ALL" || bookingSubFilter === "ACTIVE") &&
                      (activeTab === "bookings" || activeTab === "upcoming") && (
                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover-effect">
                      <div className="flex items-center gap-4">
                        <img
                          src={POPULAR_SERVICES[0].image}
                          alt="AC Service"
                          className="w-14 h-14 rounded-2xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                              AC & Appliances
                            </span>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              Tomorrow, 3:00 PM
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            Master Power Jet AC Service
                          </h4>
                          <p className="text-xs text-slate-500">
                            Assigned Pro: <strong>Rahul (★ 4.9)</strong> • Indiranagar
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href="/tracking/BK-849201"
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Track Pro</span>
                        </Link>
                        <Link
                          href="/booking/BK-849201"
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Booking 2: Past Completed */}
                  {(activeTab === "bookings" || activeTab === "past") && (
                    <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover-effect">
                      <div className="flex items-center gap-4">
                        <img
                          src={POPULAR_SERVICES[1].image}
                          alt="Bathroom Clean"
                          className="w-14 h-14 rounded-2xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Cleaning
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              Completed on 1 Sep
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">
                            Intense Bathroom Deep Cleaning & De-scaling
                          </h4>
                          <p className="text-xs text-slate-500">
                            Pro: <strong>David Chen</strong> • 30-Day Warranty Active
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href="/book/svc-2"
                          className="px-4 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Book Again</span>
                        </Link>
                        <Link
                          href="/booking/BK-849201"
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                        >
                          Invoice
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

            {/* SAVED PROFESSIONALS TAB */}
            {activeTab === "saved" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-black text-slate-900">Saved Favorite Professionals</h2>
                  <p className="text-xs text-slate-500">
                    Quickly re-book specialists you've had 5-star experiences with.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TOP_PROFESSIONALS.slice(0, 3).map((pro) => (
                    <div
                      key={pro.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 card-hover-effect"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-brand-100"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{pro.name}</h4>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              ✓ Verified
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{pro.role}</p>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span>{pro.rating}</span>
                            <span className="text-slate-400 font-medium">({pro.reviewsCount})</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push(`/book/${pro.serviceId || "svc-1"}?pro=${pro.id}`)}
                        className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Book with {pro.name.split(" ")[0]}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === "addresses" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Saved Addresses</h2>
                    <p className="text-xs text-slate-500">
                      Manage your saved residences and office locations.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Manage & Add Addresses</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{addr.type}</h4>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{addr.flatNo}, {addr.street}</p>
                          <p className="text-[11px] text-slate-400">{addr.locality}, {addr.city} - {addr.pincode}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowLocationModal(true)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-black text-slate-900">Payments & Invoices</h2>
                  <p className="text-xs text-slate-500">
                    Saved payment methods and transaction receipts.
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                        UPI
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Google Pay / PhonePe (UPI)</p>
                        <p className="text-[10px] text-slate-400">aarav.mehta@okaxis</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === "coupons" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-black text-slate-900">Available Promo Coupons</h2>
                  <p className="text-xs text-slate-500">
                    Apply these exclusive voucher codes during checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {LIMITED_OFFERS.map((coupon) => (
                    <div
                      key={coupon.code}
                      className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-slate-900">{coupon.title}</span>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          {coupon.expiry}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{coupon.subtitle}</p>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                          {coupon.code}
                        </span>
                        <button
                          onClick={() => handleCopyCoupon(coupon.code)}
                          className="px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1"
                        >
                          {copiedCoupon === coupon.code ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCoupon === coupon.code ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === "reviews" && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">My Ratings & Reviews</h2>
                    <p className="text-xs text-slate-500">
                      Feedback and ratings shared for completed home services.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    2 Verified Reviews
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Intense Bathroom Deep Cleaning</span>
                        <span className="text-[10px] text-slate-400">• Completed 1 Sep</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "David arrived exactly on time with industrial scrubbing equipment. Removed hard water lime stains that had been there for 2 years. Very polite and clean work!"
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Professional: <strong>David Chen (4.9★)</strong></span>
                      <span className="text-emerald-700 font-semibold">✓ Verified Customer Review</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Master Power Jet AC Service</span>
                        <span className="text-[10px] text-slate-400">• Completed 14 Jul</span>
                      </div>
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "Rahul did a thorough jet wash using the waterproof wall funnel jacket. Zero mess on bedroom walls and the cooling is like a brand new AC now."
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Professional: <strong>Rahul (4.9★)</strong></span>
                      <span className="text-emerald-700 font-semibold">✓ Verified Customer Review</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (

              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">Notifications</h2>
                    <p className="text-xs text-slate-500">
                      Real-time status alerts and service updates.
                    </p>
                  </div>
                  <Link
                    href="/notifications"
                    className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                  >
                    <span>Full Notification Center</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        n.isRead ? "bg-white border-slate-200" : "bg-brand-50/50 border-brand-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                          <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      </div>

                      {n.actionUrl && (
                        <Link
                          href={n.actionUrl}
                          className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs shrink-0 hover:bg-brand-100 transition-colors"
                        >
                          {n.actionLabel || "View"}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-black text-slate-900">My Profile</h2>
                  <p className="text-xs text-slate-500">
                    Personal information and contact preferences.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Full Name</label>
                      <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
                        Aarav Mehta
                      </p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Email Address</label>
                      <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
                        aarav.mehta@gmail.com
                      </p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Phone Number</label>
                      <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
                        +91 98765 43210
                      </p>
                    </div>

                    <div>
                      <label className="font-bold text-slate-400 block mb-1">Current Locality</label>
                      <p className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900">
                        Indiranagar, Bengaluru
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* HELP & SUPPORT TAB */}
            {activeTab === "help" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-lg font-black text-slate-900">24/7 Help & Customer Support</h2>
                  <p className="text-xs text-slate-500">
                    We're here to make sure your home is completely taken care of.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <Phone className="w-6 h-6 text-brand-600" />
                    <h4 className="text-sm font-bold text-slate-900">Priority Helpline</h4>
                    <p className="text-xs text-slate-500">Direct hotline for live bookings & emergency dispatch.</p>
                    <a href="tel:18004192667" className="inline-block pt-2 font-black text-brand-600 text-sm">
                      1800-419-COOP (2667)
                    </a>
                  </div>

                  <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <MessageSquare className="w-6 h-6 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900">WhatsApp Assistant</h4>
                    <p className="text-xs text-slate-500">Get updates and modify slots directly on WhatsApp.</p>
                    <a href="https://wa.me/919876543210" className="inline-block pt-2 font-black text-emerald-600 text-sm">
                      Chat on WhatsApp →
                    </a>
                  </div>

                  <div className="sm:col-span-2 p-6 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-3xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-base font-black text-white">Full Support Center & Ticket Management</h4>
                      <p className="text-xs text-brand-100 mt-1">
                        View active dispute tickets, upload photo evidence, or claim your 30-day rework warranty.
                      </p>
                    </div>
                    <Link
                      href="/support"
                      className="px-5 py-2.5 bg-white text-brand-700 hover:bg-brand-50 rounded-xl text-xs font-black shadow-md shrink-0 flex items-center gap-1.5 self-start sm:self-auto"
                    >
                      <span>Open Support Center</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Location & Address Manager Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        selectedCity={selectedCity}
        selectedLocality={selectedLocality}
        onSelectLocation={(city, locality) => {
          setSelectedCity(city);
          setSelectedLocality(locality);
        }}
      />

      <MobileBottomNav onOpenBooking={() => router.push("/book/svc-1")} />
      <Footer />
    </div>
  );
}
