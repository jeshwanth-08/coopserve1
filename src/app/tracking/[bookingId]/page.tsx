"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Star,
  Zap,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Navigation,
  Check,
  RotateCcw,
  CreditCard,
  FileText,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { getBookingById, BookingRecord } from "@/lib/bookingService";
import PayAfterServiceModal from "@/components/payment/PayAfterServiceModal";
import InvoiceModal from "@/components/payment/InvoiceModal";
import { CoopInvoice } from "@/lib/paymentService";

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = (params?.bookingId as string) || "BK-849201";

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(3); // 0 to 5
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Reschedule state
  const [newDate, setNewDate] = useState("Tomorrow");
  const [newSlot, setNewSlot] = useState("03:00 PM");
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Cancel state
  const [cancelReason, setCancelReason] = useState("Plans changed");
  const [isCancelled, setIsCancelled] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Digital Payment & Invoice state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<CoopInvoice | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const handlePaymentSuccess = (invoice: CoopInvoice) => {
    setActiveInvoice(invoice);
    setIsPaid(true);
    setIsPayModalOpen(false);
    setIsInvoiceModalOpen(true);
  };

  useEffect(() => {
    const loaded = getBookingById(bookingId);
    setBooking(loaded);
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Exact timeline specified in prompt:
  const LIVE_TIMELINE = [
    { title: "Booking confirmed", subtitle: "Order placed & verified in network", state: "done" },
    { title: "Professional assigned", subtitle: `${booking.assignedPro.name} assigned to your location`, state: "done" },
    { title: "Professional accepted", subtitle: "Specialist accepted & prepped spare parts", state: "done" },
    { title: "Professional on the way", subtitle: `En route • Estimated arrival: ${booking.estimatedArrival}`, state: "active" },
    { title: "Service started", subtitle: "In-person diagnosis & work commencement", state: "pending" },
    { title: "Service completed", subtitle: "Final inspection & 30-day warranty activated", state: "pending" },
  ];

  const handleConfirmReschedule = () => {
    setBooking((prev) => (prev ? { ...prev, date: newDate, timeSlot: newSlot } : null));
    setRescheduleSuccess(true);
    setTimeout(() => {
      setRescheduleSuccess(false);
      setShowRescheduleModal(false);
    }, 1200);
  };

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setBooking((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
    setShowCancelModal(false);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewModal(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity={booking.city}
        selectedLocality={booking.locality}
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => {}}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Top Header Banner */}
        {!isCancelled ? (
          <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-brand-500/30 relative overflow-hidden">
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center font-bold text-amber-400 border border-white/10 shadow-inner shrink-0">
                <Navigation className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-500/30 text-brand-200 border border-brand-400/40 px-2.5 py-0.5 rounded-full">
                    {booking.id}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Tracking
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black mt-1 text-white">
                  Professional is on the way!
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  Arriving at <strong>{booking.address}</strong> in approx <strong>{booking.estimatedArrival}</strong>
                </p>
              </div>
            </div>

            {/* OTP Badge & Fast Contact */}
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-amber-300 block tracking-wider">
                  Arrival Security OTP
                </span>
                <span className="text-2xl font-black font-mono tracking-widest text-white">
                  {booking.otp}
                </span>
                <span className="text-[9px] text-slate-300 block">Share only when pro arrives</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Service #{booking.id} has been cancelled</span>
            </div>
            <p className="text-xs text-rose-700">
              Cancellation fee: ₹0 • 100% refund of ₹{booking.priceBreakdown.total} credited back to your account.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Back to Home
            </Link>
          </div>
        )}

        {/* Society Group Pool Banner */}
        {booking.groupCode && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 border border-blue-400/30 rounded-3xl p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/60 border border-blue-400/40 text-blue-200 flex items-center justify-center font-bold text-lg shrink-0">
                🏢
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-white">
                    {booking.societyName || "Society Group Pool"}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/30 border border-blue-400/40 font-mono font-bold text-[11px] text-blue-200">
                    {booking.groupCode}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                    Zero Doorstep Fee
                  </span>
                </div>
                <p className="text-xs text-blue-200/90 mt-0.5">
                  Coordinated neighborhood pool • Specialist is handling grouped visits in your society for maximum efficiency.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Map + Timeline + Pro Card */}
          <div className="lg:col-span-8 space-y-6">
            {/* Polished Interactive Map-Style Area */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-xl relative overflow-hidden text-white">
              {/* Grid Background pattern simulation */}
              <div
                className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"
              />

              {/* Map UI Elements */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>Live GPS Radar: Indiranagar 100ft Rd ➔ {booking.locality}</span>
                  </div>
                  <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                    ETA: ~18 mins
                  </span>
                </div>

                {/* Visual Route Path Representation */}
                <div className="h-44 sm:h-52 rounded-2xl bg-slate-950/80 border border-slate-800 relative flex items-center justify-between px-8 sm:px-16 overflow-hidden">
                  {/* Road Curve simulation line */}
                  <div className="absolute left-12 right-12 top-1/2 h-1 bg-dashed border-t-2 border-dashed border-indigo-500/60 -translate-y-1/2" />

                  {/* Pro Vehicle Marker */}
                  <div className="relative z-10 flex flex-col items-center animate-pulse">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/50 border-2 border-white">
                      <Navigation className="w-6 h-6 rotate-45" />
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700">
                      {booking.assignedPro.name}
                    </span>
                  </div>

                  {/* Destination Home Marker */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 border-2 border-white">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-white mt-1.5 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700">
                      Your Home
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center">
                  Technician is traveling equipped with safety mask, sanitizer, and standardized equipment kit.
                </p>
              </div>
            </div>

            {/* Live-Style Booking Tracking Timeline */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900">Service Status Timeline</h3>
                <span className="text-xs font-bold text-slate-400">Step {currentStepIndex + 1} of 6</span>
              </div>

              {/* Exact Timeline requested */}
              <div className="space-y-5 relative">
                <div className="absolute left-3.5 top-2 bottom-5 w-0.5 bg-slate-200" />

                {LIVE_TIMELINE.map((item, idx) => {
                  const isPast = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <div key={idx} className="flex items-start gap-4 relative z-10">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                          isPast
                            ? "bg-emerald-600 text-white shadow-sm"
                            : isCurrent
                            ? "bg-brand-600 text-white ring-4 ring-brand-100 animate-pulse"
                            : "bg-white text-slate-300 border-2 border-slate-200"
                        }`}
                      >
                        {isPast ? "✓" : isCurrent ? "●" : "○"}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-xs sm:text-sm font-bold ${
                              isCurrent
                                ? "text-brand-600 font-black"
                                : isPast
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {item.title}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
                              In Progress
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Simulator Slider */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-slate-400 font-medium">Simulation Controls:</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setCurrentStepIndex(s)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        currentStepIndex === s
                          ? "bg-brand-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Stage {s + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Specialist Profile Details & Actions */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Professional
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Police Verified
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={booking.assignedPro.avatar}
                    alt={booking.assignedPro.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-100"
                  />
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-900">
                      {booking.assignedPro.name}
                    </h4>
                    <p className="text-xs text-slate-500">{booking.assignedPro.role}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mt-1">
                      <span className="flex items-center text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {booking.assignedPro.rating}
                      </span>
                      <span>• {booking.assignedPro.experienceYears} Yrs Exp</span>
                      <span>• {booking.assignedPro.jobsCompleted}+ Completed</span>
                    </div>
                  </div>
                </div>

                {/* 4 Core Actions: Call, Chat, Reschedule, Cancel */}
                <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
                  <a
                    href="tel:+919876543210"
                    className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <button
                    onClick={() => alert(`Opening chat with ${booking.assignedPro.name}...`)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                  <button
                    onClick={() => setShowRescheduleModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Pay After Service Card (Stage 6) */}
            {currentStepIndex === 5 && (
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-brand-500/10 border-2 border-emerald-300 text-slate-900 space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-600/30">
                      ₹
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-black text-slate-900">
                          {isPaid ? "Payment Complete & Disbursed" : "Pay After Service Completion"}
                        </h4>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          isPaid ? "bg-emerald-100 text-emerald-800" : "bg-brand-100 text-brand-800"
                        }`}>
                          {isPaid ? "Paid ✓" : "Pay Now"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {isPaid
                          ? "Official tax invoice generated. Worker share credited instantly via DBT."
                          : "Job inspected & verified. Pay securely via UPI, Cards, Net Banking, or Cash."}
                      </p>
                    </div>
                  </div>

                  {isPaid ? (
                    <button
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 self-start sm:self-auto shrink-0"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View &amp; Download Invoice</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsPayModalOpen(true)}
                      className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-brand-500/30 self-start sm:self-auto shrink-0 active:scale-95"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{booking.priceBreakdown.total} Online</span>
                    </button>
                  )}
                </div>

                {/* Fair Cooperative Split Highlight */}
                <div className="p-3 bg-white/90 rounded-2xl border border-emerald-200 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold text-emerald-950">Cooperative Split:</span>
                    <span className="text-slate-600">
                      ₹{Math.round(booking.priceBreakdown.total * 0.9)} to {booking.assignedPro.name} (90%) &bull; ₹{Math.round(booking.priceBreakdown.total * 0.1)} to Co-op Welfare Fund (10%)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Zero Surcharge &bull; 100% Transparent
                  </span>
                </div>
              </div>
            )}

            {/* Review Box if Stage 6 (Completed) */}
            {currentStepIndex === 5 && !reviewSubmitted && (
              <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-slate-900 space-y-3">
                <div className="flex items-center gap-2 font-black text-amber-900">
                  <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span>Job Completed! How was your experience?</span>
                </div>
                <p className="text-xs text-slate-600">
                  Rate your specialist {booking.assignedPro.name} to complete the service cycle and activate your 30-day warranty card.
                </p>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
                >
                  Leave 5-Star Review
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-black text-slate-900">Order Overview</h3>
                <Link
                  href={`/booking/${booking.id}`}
                  className="text-xs font-bold text-brand-600 hover:underline"
                >
                  Full Details →
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={booking.service.image}
                  alt={booking.service.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-600">
                    {booking.service.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {booking.service.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">{booking.service.duration}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Slot:</span>
                  <span className="font-bold text-slate-800">{booking.date}, {booking.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-bold text-slate-800 text-right truncate max-w-[170px]">
                    {booking.address}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-3 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Service:</span>
                  <span>₹{booking.priceBreakdown.basePrice}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes (18%):</span>
                  <span>₹{booking.priceBreakdown.taxes}</span>
                </div>
                {booking.priceBreakdown.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount:</span>
                    <span>-₹{booking.priceBreakdown.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-2">
                  <span>Total Payable:</span>
                  <span className="text-brand-600">₹{booking.priceBreakdown.total}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>30-Day CoopServe Rework Warranty</span>
              </span>
              <p className="text-[11px] text-slate-600">
                100% satisfaction guarantee. In case of recurrence, senior technician visits free of charge.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Reschedule Appointment</h3>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {rescheduleSuccess ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Rescheduled Successfully!</h4>
                <p className="text-xs text-slate-500">
                  New slot: {newDate}, {newSlot}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
                  <span className="text-slate-500">Current Slot:</span>
                  <p className="font-bold text-slate-900">{booking.date}, {booking.timeSlot}</p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Available Dates
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    {["Tomorrow", "Thu, 10 Sep", "Fri, 11 Sep"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setNewDate(d)}
                        className={`p-2 rounded-xl border ${
                          newDate === d
                            ? "bg-brand-50 border-brand-600 text-brand-700 font-bold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    {["09:00 AM", "11:30 AM", "03:00 PM", "05:30 PM"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewSlot(t)}
                        className={`p-2 rounded-xl border ${
                          newSlot === t
                            ? "bg-brand-50 border-brand-600 text-brand-700 font-bold"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleConfirmReschedule}
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
                >
                  Confirm Reschedule
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Cancel Booking</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cancellation Policy:</span>
                  <span className="font-bold text-emerald-600">Free (Up to 2 hrs before)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Cancellation fee:</span>
                  <span className="font-bold text-emerald-600">₹0</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5">
                  <span className="text-slate-700 font-bold">Refund:</span>
                  <span className="font-black text-slate-900">₹{booking.priceBreakdown.total}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Reason for cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="Plans changed">Plans changed / Not at home</option>
                  <option value="Booked by mistake">Booked by mistake</option>
                  <option value="Issue resolved">Issue resolved already</option>
                  <option value="Scheduling conflict">Scheduling conflict</option>
                </select>
              </div>

              <button
                onClick={handleConfirmCancel}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25"
              >
                Cancel booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Review {booking.assignedPro.name}</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="text-center py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Thank you for rating!</h4>
                <p className="text-xs text-slate-500">Your review is live on CoopServe.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="text-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Tap to rate
                  </label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= reviewRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Your comments
                  </label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="e.g. Master electrician arrived on time, was very polite and solved the issue quickly."
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25"
                >
                  Submit 5-Star Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Pay After Service Modal */}
      <PayAfterServiceModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        orderId={booking.id}
        serviceName={booking.service.name}
        workerName={booking.assignedPro.name}
        workerTrade={booking.assignedPro.role}
        amount={booking.priceBreakdown.total}
        customerName="Rahul Sharma"
        address={booking.address}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Downloadable PDF / Printable Invoice Modal */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoice={activeInvoice}
      />

      <Footer />
    </div>
  );
}
