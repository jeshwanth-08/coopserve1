"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  ArrowLeft,
  ArrowRight,
  FileText,
  Download,
  RotateCcw,
  X,
  CreditCard,
  User,
  HelpCircle,
  Camera,
  Paperclip,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { getBookingById, BookingRecord } from "@/lib/bookingService";
import { POPULAR_SERVICES } from "@/lib/homeData";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = (params?.id as string) || "BK-849201";

  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Reschedule state
  const [newDate, setNewDate] = useState("Tomorrow");
  const [newSlot, setNewSlot] = useState("02:30 PM");
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false);

  // Cancel state
  const [cancelReason, setCancelReason] = useState("Plans changed");
  const [isCancelled, setIsCancelled] = useState(false);

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

  const handleConfirmReschedule = () => {
    setBooking((prev) =>
      prev ? { ...prev, date: newDate, timeSlot: newSlot } : null
    );
    setRescheduleSuccess(true);
    setTimeout(() => {
      setRescheduleSuccess(false);
      setShowRescheduleModal(false);
    }, 1500);
  };

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setBooking((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
    setShowCancelModal(false);
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

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-12 w-full space-y-6">
        {/* Breadcrumb & Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/account" className="hover:text-brand-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>My Account</span>
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Booking #{booking.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/tracking/${booking.id}`}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Live GPS Tracking</span>
            </Link>
          </div>
        </div>

        {/* Cancellation Notice if Cancelled */}
        {isCancelled && (
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Booking #{booking.id} has been cancelled</span>
            </div>
            <p className="text-xs text-rose-700">
              Cancellation fee: ₹0 • Full refund of ₹{booking.priceBreakdown.total} processed to your original payment method.
            </p>
          </div>
        )}

        {/* Main Booking Summary Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 gap-4">
            <div className="flex items-center gap-4">
              <img
                src={booking.service.image}
                alt={booking.service.name}
                className="w-16 h-16 rounded-2xl object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    {booking.service.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isCancelled
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isCancelled ? "Cancelled" : booking.status}
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {booking.service.name}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Scheduled: <strong>{booking.date}, {booking.timeSlot}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
              <span className="text-2xl font-black text-slate-900">
                ₹{booking.priceBreakdown.total}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block">
                Pay After Service
              </span>
            </div>
          </div>

          {/* 3-Column Info Grid: Schedule, Address, Specialist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* 1. Schedule Info */}
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>Date & Slot</span>
              </span>
              <p className="font-bold text-slate-900 text-sm">{booking.date}</p>
              <p className="text-slate-600">{booking.timeSlot}</p>
              <p className="text-emerald-600 font-semibold">Arriving on time</p>
            </div>

            {/* 2. Service Address */}
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>Address</span>
              </span>
              <p className="font-bold text-slate-900">{booking.customerName}</p>
              <p className="text-slate-600 truncate">{booking.address}</p>
              <p className="text-slate-500">{booking.customerPhone}</p>
            </div>

            {/* 3. Assigned Specialist */}
            <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-brand-600" />
                <span>Specialist</span>
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={booking.assignedPro.avatar}
                  alt={booking.assignedPro.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold text-slate-900">{booking.assignedPro.name}</p>
                  <p className="text-[10px] text-amber-600 flex items-center">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{booking.assignedPro.rating}</span>
                  </p>
                </div>
              </div>
              <p className="text-emerald-700 font-semibold text-[11px]">✓ Background Verified</p>
            </div>
          </div>

          {/* Customer Issue Notes & Attachments */}
          {(booking.notes || (booking.attachments && booking.attachments.length > 0)) && (
            <div className="border-t border-slate-100 pt-6 space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-brand-600" />
                  <span>Problem Description & Photo Attachments</span>
                </span>
                <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Shared with {booking.assignedPro.name}
                </span>
              </h3>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 text-xs">
                {booking.notes && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Customer Problem Note
                    </span>
                    <p className="text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-medium">
                      "{booking.notes}"
                    </p>
                  </div>
                )}

                {booking.attachments && booking.attachments.length > 0 && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-slate-400" />
                      <span>Uploaded Reference Photos ({booking.attachments.length})</span>
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {booking.attachments.map((imgUrl, idx) => (
                        <a
                          key={idx}
                          href={imgUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative block w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-slate-200 hover:border-brand-500 shadow-sm transition-all"
                        >
                          <img
                            src={imgUrl}
                            alt={`Booking attachment ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold backdrop-blur-sm">
                            View ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Smart Pricing Itemized Breakdown */}
          <div className="border-t border-slate-100 pt-6 space-y-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center justify-between">
              <span>Itemized Price Breakdown</span>
              <span className="text-xs font-normal text-slate-500">Invoice #INV-{booking.id.replace("BK-", "")}</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Standard Service Charge</span>
                <span className="font-bold text-slate-900">₹{booking.priceBreakdown.basePrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Consumables, Masking & PPE</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Government Taxes (GST 18%)</span>
                <span className="font-bold text-slate-900">₹{booking.priceBreakdown.taxes}</span>
              </div>
              {booking.priceBreakdown.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Coupon Discount</span>
                  <span>-₹{booking.priceBreakdown.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 border-t border-slate-200 pt-2">
                <span>Total Payable</span>
                <span className="text-brand-600">₹{booking.priceBreakdown.total}</span>
              </div>
            </div>
          </div>

          {/* 30-Day Warranty Digital Certificate */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-emerald-900">
                  CoopServe 30-Day Service Warranty Active
                </h4>
                <p className="text-[11px] text-emerald-700">
                  Includes ₹10,000 damage protection guarantee and free senior technician rework.
                </p>
              </div>
            </div>
            <button
              onClick={() => alert("Downloading digital warranty certificate PDF...")}
              className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold shadow-sm hover:bg-emerald-50 flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </button>
          </div>

          {/* Action Buttons: Reschedule, Cancel, Help */}
          {!isCancelled && (
            <div className="border-t border-slate-100 pt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                >
                  Reschedule Slot
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors"
                >
                  Cancel Booking
                </button>
              </div>

              <a
                href="tel:18004192667"
                className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>24/7 Support Hotline</span>
              </a>
            </div>
          )}
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
                  New slot: {newDate}, {newSlot}. We have notified {booking.assignedPro.name}.
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
                    Select New Date
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
                    Select New 2-Hour Slot
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    {["10:00 AM", "02:30 PM", "04:30 PM", "06:30 PM"].map((t) => (
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
                  Confirm New Slot
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
              <h3 className="text-base font-black text-slate-900">Cancel Service Booking</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Cancellation Fee:</span>
                  <span className="font-bold text-emerald-600">₹0 (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Refund Amount:</span>
                  <span className="font-bold text-slate-900">₹{booking.priceBreakdown.total}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="Plans changed">Plans changed / Not available</option>
                  <option value="Booked by mistake">Booked by mistake</option>
                  <option value="Found alternative">Found alternative solution</option>
                  <option value="Price concern">Price / timing issue</option>
                </select>
              </div>

              <button
                onClick={handleConfirmCancel}
                className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-500/25"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
