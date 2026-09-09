"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  ShieldCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  Clock,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Tag,
  Plus,
  Wrench,
  MapPin,
  AlertCircle,
  Megaphone,
  CreditCard,
  Building,
  Check,
  X,
  Sparkles,
  Percent,
} from "lucide-react";
import {
  AdminBooking,
  AdminBookingStatus,
  AdminCustomer,
  AdminProfessional,
  AdminCoupon,
  ADMIN_METRICS,
  getAdminBookings,
  saveAdminBookings,
  getAdminCoupons,
  saveAdminCoupons,
  INITIAL_ADMIN_CUSTOMERS,
  INITIAL_ADMIN_PROS,
} from "@/lib/adminData";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams ? searchParams.get("tab") || "overview" : "overview";

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [bookings, setJobsBookings] = useState<AdminBooking[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>(INITIAL_ADMIN_CUSTOMERS);
  const [pros, setPros] = useState<AdminProfessional[]>(INITIAL_ADMIN_PROS);
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);

  // Sync tab with URL
  useEffect(() => {
    if (searchParams?.get("tab")) {
      setActiveTab(searchParams.get("tab") as string);
    }
  }, [searchParams]);

  const [pools, setPools] = useState<any[]>([]);
  const [loadingPools, setLoadingPools] = useState(false);

  const fetchPools = async () => {
    try {
      setLoadingPools(true);
      const res = await fetch("/api/society-pools");
      if (res.ok) {
        const data = await res.json();
        setPools(data.pools || []);
      }
    } catch (err) {
      console.error("Failed to load society pools:", err);
    } finally {
      setLoadingPools(false);
    }
  };

  // Load bookings and coupons and society pools
  useEffect(() => {
    setJobsBookings(getAdminBookings());
    setCoupons(getAdminCoupons());
    fetchPools();
  }, []);

  // Booking table search, filter, sort, pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"DATE" | "AMOUNT_DESC" | "AMOUNT_ASC">("DATE");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected Booking for Details Modal
  const [viewBooking, setViewBooking] = useState<AdminBooking | null>(null);

  // Status Change State
  const [statusChangeMessage, setStatusChangeMessage] = useState("");

  // Coupon Creation Modal
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponType, setNewCouponType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
  const [newCouponVal, setNewCouponVal] = useState("");
  const [newCouponMinOrder, setNewCouponMinOrder] = useState("");
  const [newCouponExpiry, setNewCouponExpiry] = useState("2026-12-31");
  const [newCouponLimit, setNewCouponLimit] = useState("500");
  const [newCouponFirstOnly, setNewCouponFirstOnly] = useState(false);

  // User Management Subtab: "CUSTOMERS" | "PROS"
  const [userTab, setUserTab] = useState<"CUSTOMERS" | "PROS">("CUSTOMERS");

  // Filtered Bookings
  const filteredBookings = bookings
    .filter((b) => {
      if (statusFilter !== "ALL" && b.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.id.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.proName.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.locality.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "AMOUNT_DESC") return b.amount - a.amount;
      if (sortBy === "AMOUNT_ASC") return a.amount - b.amount;
      return 0; // default order
    });

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle Booking Status Change
  const handleUpdateBookingStatus = (bookingId: string, newStatus: AdminBookingStatus) => {
    const updated = bookings.map((b) =>
      b.id === bookingId
        ? {
            ...b,
            status: newStatus,
            paymentStatus:
              newStatus === "Refunded"
                ? ("REFUNDED" as const)
                : newStatus === "Completed"
                ? ("SUCCESSFUL" as const)
                : b.paymentStatus,
          }
        : b
    );
    setJobsBookings(updated);
    saveAdminBookings(updated);
    if (viewBooking?.id === bookingId) {
      setViewBooking({ ...viewBooking, status: newStatus });
    }
    setStatusChangeMessage(`Booking #${bookingId} status changed to "${newStatus}"`);
    setTimeout(() => setStatusChangeMessage(""), 3500);
  };

  // Handle Create Coupon
  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponVal) return;

    const newCoupon: AdminCoupon = {
      id: "CPN-" + (coupons.length + 1),
      code: newCouponCode.trim().toUpperCase(),
      description: newCouponDesc.trim() || "Promotional discount voucher",
      discountType: newCouponType,
      discountValue: parseFloat(newCouponVal) || 0,
      minOrderValue: parseFloat(newCouponMinOrder) || 0,
      expiryDate: newCouponExpiry,
      usageLimit: parseInt(newCouponLimit) || 100,
      usedCount: 0,
      isActive: true,
      isFirstBookingOnly: newCouponFirstOnly,
    };

    const updated = [newCoupon, ...coupons];
    setCoupons(updated);
    saveAdminCoupons(updated);
    setShowCreateCouponModal(false);
    setNewCouponCode("");
    setNewCouponVal("");
    setNewCouponDesc("");
  };

  // Toggle Coupon Active
  const handleToggleCoupon = (couponId: string) => {
    const updated = coupons.map((c) =>
      c.id === couponId ? { ...c, isActive: !c.isActive } : c
    );
    setCoupons(updated);
    saveAdminCoupons(updated);
  };

  // Toggle Customer Suspend
  const handleToggleCustomer = (custId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === custId
          ? { ...c, status: c.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : c
      )
    );
  };

  // Verify Pro
  const handleVerifyPro = (proId: string) => {
    setPros((prev) =>
      prev.map((p) =>
        p.id === proId ? { ...p, verificationStatus: "VERIFIED" } : p
      )
    );
  };

  const ADMIN_NAV_TABS = [
    { id: "overview", label: "Overview & Metrics", icon: BarChart3 },
    { id: "bookings", label: "Bookings", badge: bookings.length, icon: Calendar },
    { id: "grouppools", label: "Society Service Pools", badge: pools.length, icon: Building },
    { id: "customers", label: "Users & Customers", icon: Users },
    { id: "professionals", label: "Professionals", badge: pros.length, icon: ShieldCheck },
    { id: "coupons", label: "Coupons & Offers", badge: coupons.length, icon: Tag },
    { id: "services", label: "Services & Catalog", icon: Wrench },
    { id: "payments", label: "Payments & Gateway", icon: CreditCard },
    { id: "refunds", label: "Refunds", icon: RotateCcw },
    { id: "reviews", label: "Reviews Moderation", icon: Star },
    { id: "complaints", label: "Complaints & Disputes", icon: AlertTriangle },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "promotions", label: "Promotions", icon: Megaphone },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Cooperative Control Center
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-200">
              Admin HQ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time platform operations, multi-service bookings, customer accounts, and coupon administration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab("bookings");
              router.push("/admin?tab=bookings");
            }}
            className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Manage All Bookings ({bookings.length})</span>
          </button>
        </div>
      </div>

      {/* 7 Required Admin Core Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* Metric 1: Total customers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Customers
          </span>
          <p className="text-2xl font-black text-slate-900">{ADMIN_METRICS.totalCustomers}</p>
          <span className="text-[10px] text-emerald-600 font-bold block">+34 this week</span>
        </div>

        {/* Metric 2: Active professionals */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Pros
          </span>
          <p className="text-2xl font-black text-slate-900">{ADMIN_METRICS.activeProfessionals}</p>
          <span className="text-[10px] text-emerald-600 font-bold block">100% verified</span>
        </div>

        {/* Metric 3: Bookings today */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Bookings Today
          </span>
          <p className="text-2xl font-black text-brand-600">{ADMIN_METRICS.bookingsToday}</p>
          <span className="text-[10px] text-brand-700 font-bold block">12 in work now</span>
        </div>

        {/* Metric 4: Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Platform Revenue
          </span>
          <p className="text-2xl font-black text-slate-900" suppressHydrationWarning>
            ₹{ADMIN_METRICS.revenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[10px] text-emerald-600 font-bold block">September MTD</span>
        </div>

        {/* Metric 5: Cancellation rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Cancellation Rate
          </span>
          <p className="text-2xl font-black text-slate-900">{ADMIN_METRICS.cancellationRate}%</p>
          <span className="text-[10px] text-emerald-600 font-bold block">Platform low</span>
        </div>

        {/* Metric 6: Average rating */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Average Rating
          </span>
          <p className="text-2xl font-black text-amber-500">{ADMIN_METRICS.averageRating} ★</p>
          <span className="text-[10px] text-slate-500 block">4,280 reviews</span>
        </div>

        {/* Metric 7: Customer satisfaction */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Satisfaction (CSAT)
          </span>
          <p className="text-2xl font-black text-emerald-600">{ADMIN_METRICS.customerSatisfaction}%</p>
          <span className="text-[10px] text-emerald-700 font-bold block">Superb benchmark</span>
        </div>
      </div>

      {/* Status Notification Toast */}
      {statusChangeMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusChangeMessage}</span>
          </div>
          <span className="text-[10px] text-emerald-700 uppercase">Audit Logged</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 shadow-sm overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {ADMIN_NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  router.push(`/admin?tab=${tab.id}`);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand-400" : "text-slate-400"}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? "bg-brand-500 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA */}

      {/* 1. OVERVIEW & METRICS TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Revenue Trend Chart */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Weekly Gross Booking Revenue</h3>
                  <p className="text-xs text-slate-500">Platform volume across all 20 service categories</p>
                </div>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
                  Avg ₹43,900 / Day
                </span>
              </div>

              <div className="flex items-end justify-between gap-3 h-48 pt-8 border-b border-slate-100 pb-3">
                {ADMIN_METRICS.weeklyRevenue.map((bar, i) => {
                  const heightPercent = Math.round((bar.revenue / 65000) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{(bar.revenue / 1000).toFixed(1)}k
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-xl transition-all duration-300 ${
                          i === 5
                            ? "bg-gradient-to-t from-purple-600 to-brand-500 shadow-md shadow-brand-500/25"
                            : "bg-gradient-to-t from-slate-300 to-slate-200 group-hover:from-slate-400 group-hover:to-slate-300"
                        }`}
                      />
                      <span className="text-xs font-bold text-slate-600">{bar.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Market Share Breakdown */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900">Demand by Discipline</h3>
              <div className="space-y-3 pt-2">
                {ADMIN_METRICS.categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-700">{cat.category}</span>
                      <span className="text-slate-500 font-semibold">{cat.share}% ({cat.count})</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full"
                        style={{ width: `${cat.share}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOKINGS MANAGEMENT TAB */}
      {activeTab === "bookings" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Bookings Control Matrix</h2>
                <p className="text-xs text-slate-500">
                  Search, filter, inspect, and update status across all customer bookings.
                </p>
              </div>

              {/* Status Filter Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filter:</span>
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50 outline-none"
                >
                  <option value="ALL">All Statuses ({bookings.length})</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On the way">On the way</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Search Bar & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Booking ID, Customer, Specialist, Service, or Locality..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none"
                >
                  <option value="DATE">Scheduled Date</option>
                  <option value="AMOUNT_DESC">Amount (High to Low)</option>
                  <option value="AMOUNT_ASC">Amount (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Professional Bookings Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Booking ID</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Professional</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Date & Slot</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-slate-900">{b.id}</td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{b.customerPhone}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                          <span>{b.proName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{b.locality}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{b.serviceName}</div>
                        <div className="text-[10px] text-brand-700 font-semibold uppercase">{b.category}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-800">{b.date}</div>
                        <div className="text-[11px] text-slate-500">{b.timeSlot}</div>
                      </td>
                      <td className="p-3.5 font-black text-slate-900 text-sm">
                        ₹{b.amount}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                            b.status === "Completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "On the way"
                              ? "bg-amber-100 text-amber-900 animate-pulse"
                              : b.status === "In progress"
                              ? "bg-blue-100 text-blue-900"
                              : b.status === "Cancelled" || b.status === "Refunded"
                              ? "bg-rose-100 text-rose-900"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewBooking(b)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                            title="View full booking details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Authorized Status Change Dropdown */}
                          <select
                            value={b.status}
                            onChange={(e) =>
                              handleUpdateBookingStatus(b.id, e.target.value as AdminBookingStatus)
                            }
                            className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold bg-white outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Assigned">Assigned</option>
                            <option value="On the way">On the way</option>
                            <option value="In progress">In progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedBookings.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No bookings match your current filter or search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-500">
                Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredBookings.length)} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredBookings.length)} of {filteredBookings.length} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <span className="font-bold text-slate-700 px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-bold"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2.5 SOCIETY SERVICE POOLS TAB */}
      {activeTab === "grouppools" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">Apartment &amp; Society Service Pools</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {pools.length} Active Hubs
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Manage active gated society group service pools, cluster bookings, and dispatch logistics.
                </p>
              </div>

              <button
                onClick={fetchPools}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${loadingPools ? "animate-spin" : ""}`} />
                <span>Refresh Pools</span>
              </button>
            </div>

            {/* Pools Table */}
            {loadingPools && pools.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <div className="w-6 h-6 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                Loading society pools...
              </div>
            ) : pools.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No active society pools configured.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                      <th className="py-3 px-3">Group Code</th>
                      <th className="py-3 px-3">Society &amp; Locality</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Service Window</th>
                      <th className="py-3 px-3 text-center">Residents Joined</th>
                      <th className="py-3 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {pools.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-blue-700">
                          <span className="bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
                            {p.code}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900">{p.societyName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {p.locality}
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800">{p.category}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          <div>{p.serviceWindow}</div>
                          <div className="text-[11px] text-slate-400">{p.date} &bull; {p.timeSlot}</div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full text-xs">
                            <Users className="w-3 h-3 text-slate-500" />
                            {p.memberCount || 2} / {p.maxCapacity || 15}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            p.status === "OPEN"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3 & 4. USER MANAGEMENT (CUSTOMERS & PROFESSIONALS) */}
      {(activeTab === "customers" || activeTab === "professionals") && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">User Directory & Verification</h2>
                <p className="text-xs text-slate-500">
                  Manage registered community customers and background-checked service professionals.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start sm:self-center">
                <button
                  onClick={() => {
                    setUserTab("CUSTOMERS");
                    setActiveTab("customers");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "customers"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Customers ({customers.length})
                </button>
                <button
                  onClick={() => {
                    setUserTab("PROS");
                    setActiveTab("professionals");
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "professionals"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Professionals ({pros.length})
                </button>
              </div>
            </div>

            {activeTab === "customers" && (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black text-[10px]">
                    <tr>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Locality</th>
                      <th className="p-3.5">Registered</th>
                      <th className="p-3.5">Bookings</th>
                      <th className="p-3.5">Total Spent</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                        <td className="p-3.5">
                          <p className="text-slate-800 font-medium">{c.phone}</p>
                          <p className="text-[11px] text-slate-400">{c.email}</p>
                        </td>
                        <td className="p-3.5 text-slate-600">{c.locality}</td>
                        <td className="p-3.5 text-slate-500">{c.registeredDate}</td>
                        <td className="p-3.5 font-bold text-slate-900">{c.bookingCount} orders</td>
                        <td className="p-3.5 font-black text-emerald-600">₹{c.totalSpent}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              c.status === "ACTIVE"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleToggleCustomer(c.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                              c.status === "ACTIVE"
                                ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {c.status === "ACTIVE" ? "Suspend" : "Reactivate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "professionals" && (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black text-[10px]">
                    <tr>
                      <th className="p-3.5">Specialist</th>
                      <th className="p-3.5">Category & Skills</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Rating</th>
                      <th className="p-3.5">Jobs Completed</th>
                      <th className="p-3.5">Verification</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pros.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3.5">
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{p.id}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-brand-700">{p.category}</p>
                          <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                            {p.skills.join(", ")}
                          </p>
                        </td>
                        <td className="p-3.5">
                          <p className="text-slate-800">{p.phone}</p>
                          <p className="text-[11px] text-slate-400">{p.email}</p>
                        </td>
                        <td className="p-3.5 font-bold text-amber-500">
                          ★ {p.rating}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">{p.jobCount}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              p.verificationStatus === "VERIFIED"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {p.verificationStatus}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {p.verificationStatus !== "VERIFIED" ? (
                            <button
                              onClick={() => handleVerifyPro(p.id)}
                              className="px-3 py-1 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                            >
                              Verify Pro
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-600 font-bold">Verified ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. COUPONS & OFFERS MANAGEMENT TAB */}
      {activeTab === "coupons" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Coupons & Promotions Management</h2>
                <p className="text-xs text-slate-500">
                  Create new promo vouchers, set usage thresholds, expiry dates, and review coupon performance.
                </p>
              </div>

              <button
                onClick={() => setShowCreateCouponModal(true)}
                className="px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Coupon Performance Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Redemptions</span>
                <p className="text-2xl font-black text-slate-900">842</p>
                <span className="text-[10px] text-emerald-600 font-semibold">+18% this month</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Discount Granted</span>
                <p className="text-2xl font-black text-brand-600">₹1,24,500</p>
                <span className="text-[10px] text-slate-500">In customer savings</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Attributed Revenue</span>
                <p className="text-2xl font-black text-slate-900">₹6,80,000</p>
                <span className="text-[10px] text-emerald-600 font-semibold">5.4x ROI</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Avg Basket Lift</span>
                <p className="text-2xl font-black text-emerald-600">+28%</p>
                <span className="text-[10px] text-slate-500">Higher order value</span>
              </div>
            </div>

            {/* Coupons Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-black text-[10px]">
                  <tr>
                    <th className="p-3.5">Promo Code</th>
                    <th className="p-3.5">Discount Offer</th>
                    <th className="p-3.5">Min Order</th>
                    <th className="p-3.5">Usage Limit</th>
                    <th className="p-3.5">Used Count</th>
                    <th className="p-3.5">Expiry Date</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="p-3.5">
                        <span className="font-black font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                          {c.code}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-1">{c.description}</p>
                      </td>
                      <td className="p-3.5 font-bold text-emerald-600 text-sm">
                        {c.discountType === "FIXED" ? `₹${c.discountValue} OFF` : `${c.discountValue}% OFF`}
                      </td>
                      <td className="p-3.5 text-slate-700 font-semibold">
                        ₹{c.minOrderValue}
                      </td>
                      <td className="p-3.5 text-slate-700">{c.usageLimit}</td>
                      <td className="p-3.5 font-bold text-slate-900">{c.usedCount}</td>
                      <td className="p-3.5 text-slate-500">{c.expiryDate}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            c.isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {c.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleCoupon(c.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold border transition-colors ${
                            c.isActive
                              ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {c.isActive ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. SERVICES & CATALOG TAB */}
      {activeTab === "services" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Services & Disciplines Catalog</h2>
              <p className="text-xs text-slate-500">
                Configure standardized cooperative base pricing and category mappings.
              </p>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white text-xs">
              {[
                { name: "AC Jet Foam & Deep Service", cat: "AC Technician", base: "₹449", warranty: "30 Days" },
                { name: "Master Electrician Switchboard Wiring", cat: "Electrician", base: "₹349", warranty: "30 Days" },
                { name: "Clogged Drain & Pipe Leak Detection", cat: "Plumber", base: "₹299", warranty: "30 Days" },
                { name: "Complete Bathroom Deep Clean", cat: "House Cleaning", base: "₹499", warranty: "30 Days" },
                { name: "Refrigerator Gas Leak & Coil Repair", cat: "Appliance Repair", base: "₹799", warranty: "60 Days" },
              ].map((s, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-brand-700 uppercase bg-brand-50 px-2 py-0.5 rounded-full">
                      {s.cat}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{s.name}</h3>
                    <p className="text-slate-400">{s.warranty} CoopServe Guarantee</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-slate-900 block">{s.base}</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Standard Labor Rate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. PAYMENTS & REFUNDS TAB */}
      {(activeTab === "payments" || activeTab === "refunds") && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900">Payment Gateway Logs & Refunds</h2>
              <p className="text-xs text-slate-500">
                Track pre-authorizations, payouts, and process instant reverse-credit refunds.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-emerald-800">Total Settled</span>
                <p className="text-xl font-black text-emerald-950">₹2,84,500</p>
                <span className="text-[10px] text-emerald-700 font-semibold">Processed via Razorpay/UPI</span>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-800">Pending Pay After Service</span>
                <p className="text-xl font-black text-amber-950">₹14,200</p>
                <span className="text-[10px] text-amber-700">Cash / UPI on Doorstep</span>
              </div>
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-800">Processed Refunds</span>
                <p className="text-xl font-black text-rose-950">₹1,897</p>
                <span className="text-[10px] text-rose-700">100% full customer refunds</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. REVIEWS, COMPLAINTS, LOCATIONS & PROMOTIONS (FALLBACK) */}
      {(activeTab === "reviews" ||
        activeTab === "complaints" ||
        activeTab === "locations" ||
        activeTab === "promotions") && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 capitalize">{activeTab} Management</h2>
            <p className="text-xs text-slate-500">
              Cooperative dispatch operations for {activeTab}.
            </p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-600">
            Platform monitoring is active for {activeTab}. All SLAs are operating within target benchmarks.
          </div>
        </div>
      )}

      {/* MODAL 1: VIEW BOOKING DETAILS */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                  {viewBooking.category}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  Booking #{viewBooking.id}
                </h3>
              </div>
              <button
                onClick={() => setViewBooking(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Service</span>
                <p className="font-bold text-slate-900 text-sm">{viewBooking.serviceName}</p>
                <p className="text-slate-600">Scheduled: {viewBooking.date}, {viewBooking.timeSlot}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Customer</span>
                  <p className="font-bold text-slate-900">{viewBooking.customerName}</p>
                  <p className="text-slate-500">{viewBooking.customerPhone}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Specialist</span>
                  <p className="font-bold text-slate-900">{viewBooking.proName}</p>
                  <p className="text-slate-500">{viewBooking.locality}</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                  <span className="text-base font-black text-slate-900">₹{viewBooking.amount}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
                  <span className="font-bold text-slate-800">{viewBooking.paymentMethod}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-slate-700">Update Booking Status:</span>
                <select
                  value={viewBooking.status}
                  onChange={(e) =>
                    handleUpdateBookingStatus(viewBooking.id, e.target.value as AdminBookingStatus)
                  }
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On the way">On the way</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewBooking(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE NEW COUPON */}
      {showCreateCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCouponSubmit}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Create New Coupon</h3>
              <button
                type="button"
                onClick={() => setShowCreateCouponModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FESTIVE200"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Benefit</label>
                <input
                  type="text"
                  placeholder="e.g. ₹200 off festival special"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  >
                    <option value="FIXED">Fixed Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150 or 20"
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 399"
                    value={newCouponMinOrder}
                    onChange={(e) => setNewCouponMinOrder(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={newCouponLimit}
                    onChange={(e) => setNewCouponLimit(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={newCouponExpiry}
                  onChange={(e) => setNewCouponExpiry(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="firstOnly"
                  checked={newCouponFirstOnly}
                  onChange={(e) => setNewCouponFirstOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600"
                />
                <label htmlFor="firstOnly" className="text-slate-700 font-semibold cursor-pointer">
                  Valid for First-Time Customers Only
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateCouponModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-md shadow-brand-500/20"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminDashboardContent />
    </Suspense>
  );
}
