"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  User,
  Phone,
  UploadCloud,
  FileImage,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Star,
  Check,
  Tag,
  AlertCircle,
  HelpCircle,
  Zap,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import {
  POPULAR_SERVICES,
  TOP_PROFESSIONALS,
  INDIAN_CITIES,
  ServiceItem,
} from "@/lib/homeData";
import { createBooking } from "@/lib/bookingService";

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = (params?.serviceId as string) || "serv-1";

  const [service, setService] = useState<ServiceItem>(
    POPULAR_SERVICES.find((s) => s.id === serviceId) || POPULAR_SERVICES[0]
  );

  // Stepper: 1: Service, 2: Date & Time, 3: Address, 4: Details & Media, 5: Professional, 6: Checkout
  const [currentStep, setCurrentStep] = useState<number>(2); // Default to Step 2 since service was clicked

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>("Today");
  const [selectedSlot, setSelectedSlot] = useState<string>("10:30 AM");
  const [isEmergency, setIsEmergency] = useState(false);

  // Address State
  const [addressType, setAddressType] = useState<"Home" | "Work" | "Other">("Home");
  const [addressLine, setAddressLine] = useState("Flat 402, Sunshine Heights, 12th Main");
  const [locality, setLocality] = useState("Indiranagar");
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [customerName, setCustomerName] = useState("Aarav Mehta");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");

  // Additional Details & Media State
  const [issueNotes, setIssueNotes] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80",
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Professional Preference State
  const [proPreferenceMode, setProPreferenceMode] = useState<"auto" | "manual">("auto");
  const [selectedProId, setSelectedProId] = useState<string>(TOP_PROFESSIONALS[0].id);

  // Promo Code State
  const [couponCode, setCouponCode] = useState("COOPFIRST");
  const [couponApplied, setCouponApplied] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(50);
  const [couponError, setCouponError] = useState("");

  // Submission State
  const [bookingState, setBookingState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const DATES = [
    { label: "Today", sub: "Fastest Slot", day: "Tue" },
    { label: "Tomorrow", sub: "Available", day: "Wed" },
    { label: "Thu, 10 Sep", sub: "Available", day: "Thu" },
    { label: "Fri, 11 Sep", sub: "Available", day: "Fri" },
    { label: "Sat, 12 Sep", sub: "Weekend", day: "Sat" },
  ];

  const TIME_SLOTS = [
    { time: "9:00 AM", status: "Available", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { time: "10:30 AM", status: "Almost full", color: "text-amber-800 bg-amber-50 border-amber-200" },
    { time: "12:00 PM", status: "Available", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { time: "2:30 PM", status: "Available", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { time: "4:00 PM", status: "Unavailable", color: "text-slate-400 bg-slate-100 border-slate-200" },
    { time: "6:00 PM", status: "Almost full", color: "text-amber-800 bg-amber-50 border-amber-200" },
  ];

  const SAVED_ADDRESSES = {
    Home: "Flat 402, Sunshine Heights, 12th Main, Indiranagar",
    Work: "Level 4, WeWork Galaxy, Residency Road",
    Other: "House 18, 5th Cross, Palm Meadows",
  };

  const handleApplyCoupon = () => {
    setCouponError("");
    if (couponCode.toUpperCase() === "COOPFIRST") {
      setDiscountAmount(150);
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "COOLSUMMER") {
      setDiscountAmount(Math.round(service.price * 0.2));
      setCouponApplied(true);
    } else if (couponCode.toUpperCase() === "DEEP250") {
      setDiscountAmount(250);
      setCouponApplied(true);
    } else {
      setCouponError("Invalid or expired promo code.");
      setCouponApplied(false);
      setDiscountAmount(0);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setUploadedPhotos((prev) => [
          ...prev,
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
        ]);
        setIsUploading(false);
      }, 700);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = async () => {
    setBookingState("loading");
    setErrorMessage("");
    try {
      const res = await createBooking({
        serviceId: service.id,
        serviceName: service.name,
        category: service.category,
        price: service.price,
        date: selectedDate,
        timeSlot: selectedSlot,
        isEmergency,
        address: addressLine,
        locality,
        city: selectedCity,
        customerName,
        customerPhone,
        notes: issueNotes,
        attachments: uploadedPhotos,
        preferredProId: proPreferenceMode === "manual" ? selectedProId : undefined,
        couponCode: couponApplied ? couponCode : undefined,
        discountAmount,
      });

      if (res.success) {
        setBookingState("success");
        setTimeout(() => {
          router.push(`/tracking/${res.bookingId}`);
        }, 1200);
      }
    } catch (err: any) {
      setBookingState("error");
      setErrorMessage(err?.message || "Booking submission failed. Please retry.");
    }
  };

  // Price calculations
  const basePrice = service.price;
  const taxes = Math.round(basePrice * 0.18);
  const totalAmount = Math.max(0, basePrice + taxes - (couponApplied ? discountAmount : 0));

  const STEPS = [
    { num: 1, label: "Service" },
    { num: 2, label: "Date & Time" },
    { num: 3, label: "Location" },
    { num: 4, label: "Details & Photos" },
    { num: 5, label: "Professional" },
    { num: 6, label: "Checkout" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">
              Coop<span className="text-brand-600">Serve</span>
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">100% Safe & Guaranteed Booking</span>
          </div>
        </div>
      </header>

      {/* Main Booking Stepper Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Progress Bar & Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 pb-2">
            {STEPS.map((s) => {
              const isCurrent = currentStep === s.num;
              const isDone = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isCurrent
                      ? "bg-brand-600 text-white shadow-md shadow-brand-500/25"
                      : isDone
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-white text-slate-400 border border-slate-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? "bg-white text-brand-600"
                        : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {isDone ? "✓" : s.num}
                  </span>
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step Form Content */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            {/* STEP 1: Service Confirmation & Switcher */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">Confirm Your Service</h2>
                    <p className="text-xs text-slate-500">
                      You can change your selected service below without losing booking progress.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-brand-700">
                        {service.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{service.name}</h3>
                      <p className="text-xs text-slate-500">{service.duration} • 30-Day Warranty</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-slate-900">₹{service.price}</span>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Or choose another popular service:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {POPULAR_SERVICES.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setService(s)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          service.id === s.id
                            ? "border-brand-600 bg-brand-50 shadow-sm font-bold"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div className="truncate">
                          <p className="text-xs font-bold truncate">{s.name}</p>
                          <p className="text-[10px] text-slate-400">₹{s.price} • {s.duration}</p>
                        </div>
                        {service.id === s.id && (
                          <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5"
                  >
                    <span>Continue to Date & Time</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Date & Time Slot Selection */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">Select Date & Time Slot</h2>
                  <p className="text-xs text-slate-500">
                    Choose when you want the certified specialist to arrive at your doorstep.
                  </p>
                </div>

                {/* Emergency Dispatch Option */}
                <div
                  onClick={() => setIsEmergency(!isEmergency)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isEmergency
                      ? "bg-red-50 border-red-300 text-red-900"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                        isEmergency ? "bg-red-600 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">
                        ⚡ Urgent Emergency Dispatch (Arrives within 45 Mins)
                      </span>
                      <span className="text-xs text-slate-500">
                        Priority dispatch for water leaks, power trips & lockouts
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isEmergency}
                    onChange={() => {}}
                    className="rounded text-red-600 h-5 w-5"
                  />
                </div>

                {/* Date Selection */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    1. Choose Date
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {DATES.map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => setSelectedDate(d.label)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedDate === d.label
                            ? "bg-brand-50 border-brand-600 text-brand-700 font-bold shadow-sm"
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                          {d.day}
                        </span>
                        <span className="text-xs font-black block mt-0.5">{d.label}</span>
                        <span className="text-[10px] text-slate-500 block mt-1">{d.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Slot Selection */}
                {!isEmergency && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      2. Choose 2-Hour Time Slot
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedSlot === slot.time;
                        const isUnavailable = slot.status === "Unavailable";
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={isUnavailable}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              isUnavailable
                                ? "opacity-50 cursor-not-allowed bg-slate-100 border-slate-200"
                                : isSelected
                                ? "bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20"
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-black block">
                              {slot.time}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
                                isSelected ? "bg-white/20 text-white" : slot.color
                              }`}
                            >
                              {slot.status}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5"
                  >
                    <span>Continue to Location</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Location & Address */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">Service Location & Address</h2>
                  <p className="text-xs text-slate-500">
                    Select a saved address or enter your flat/society details.
                  </p>
                </div>

                {/* Saved Address Tabs */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Saved Addresses
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Home", "Work", "Other"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setAddressType(type);
                          setAddressLine(SAVED_ADDRESSES[type]);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          addressType === type
                            ? "bg-brand-50 border-brand-600 text-brand-700 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-xs font-bold block">{type}</span>
                        <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                          {SAVED_ADDRESSES[type]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address Form */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Door / Flat & Apartment Name
                    </label>
                    <input
                      type="text"
                      value={addressLine}
                      onChange={(e) => setAddressLine(e.target.value)}
                      placeholder="e.g. Flat 402, Sunshine Heights"
                      className="w-full p-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Locality / Neighborhood
                      </label>
                      <input
                        type="text"
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        placeholder="e.g. Indiranagar"
                        className="w-full p-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        City
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500"
                      >
                        {INDIAN_CITIES.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                        Phone Number (For OTP & Updates)
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full p-3 text-xs sm:text-sm font-semibold bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5"
                  >
                    <span>Continue to Details & Photos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Additional Details & Media Upload */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">Tell Us More (Optional)</h2>
                  <p className="text-xs text-slate-500">
                    Upload photos of the issue so your professional can bring the exact spare parts and come prepared.
                  </p>
                </div>

                {/* Text Description */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Describe the issue or any special instructions
                  </label>
                  <textarea
                    rows={3}
                    value={issueNotes}
                    onChange={(e) => setIssueNotes(e.target.value)}
                    placeholder="e.g. AC compressor making a rattling sound after 15 mins. Please bring a high step ladder."
                    className="w-full p-3 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                {/* Photo & Video Upload Box */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Upload Issue Photos / Short Video
                  </label>

                  <div className="border-2 border-dashed border-slate-200 hover:border-brand-400 bg-slate-50 rounded-2xl p-6 text-center transition-colors">
                    <UploadCloud className="w-8 h-8 text-brand-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Drag & drop photos or click to browse
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Supports JPG, PNG, MP4 up to 25MB
                    </p>
                    <label className="mt-3 inline-block px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs cursor-pointer hover:bg-brand-700 shadow-sm">
                      {isUploading ? "Uploading..." : "Select Photos"}
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Upload Previews */}
                  {uploadedPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-2">
                      {uploadedPhotos.map((url, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(i)}
                            className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 shadow"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5"
                  >
                    <span>Continue to Professional</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Professional Preference */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">Professional Preference</h2>
                  <p className="text-xs text-slate-500">
                    Let our automated dispatcher allocate the nearest 5-star pro, or pick a specialist.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setProPreferenceMode("auto")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      proPreferenceMode === "auto"
                        ? "bg-brand-50 border-brand-600 text-brand-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <span>Assign the best available (Fastest)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Automated high-speed matching with our top rated 4.9★ pro in {locality}.
                    </p>
                  </div>

                  <div
                    onClick={() => setProPreferenceMode("manual")}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      proPreferenceMode === "manual"
                        ? "bg-brand-50 border-brand-600 text-brand-900 shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                      <User className="w-4 h-4 text-brand-600" />
                      <span>Choose a specific professional</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Browse verified specialist profiles, ratings, and experience.
                    </p>
                  </div>
                </div>

                {/* Specific Pro Cards if manual chosen */}
                {proPreferenceMode === "manual" && (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Available Specialists in {locality}:
                    </p>
                    <div className="space-y-2.5">
                      {TOP_PROFESSIONALS.map((pro) => (
                        <div
                          key={pro.id}
                          onClick={() => setSelectedProId(pro.id)}
                          className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                            selectedProId === pro.id
                              ? "bg-brand-50/80 border-brand-600 shadow-sm"
                              : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={pro.avatar}
                              alt={pro.name}
                              className="w-11 h-11 rounded-xl object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-slate-900">{pro.name}</h4>
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                  Verified
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500">{pro.role}</p>
                              <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-600 mt-0.5">
                                <span className="flex items-center text-amber-600">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {pro.rating}
                                </span>
                                <span>• {pro.experienceYears} Yrs Exp</span>
                                <span>• {pro.jobsCompleted}+ Jobs</span>
                              </div>
                            </div>
                          </div>

                          <input
                            type="radio"
                            name="proSelection"
                            checked={selectedProId === pro.id}
                            onChange={() => setSelectedProId(pro.id)}
                            className="text-brand-600 h-4 w-4"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    onClick={() => setCurrentStep(6)}
                    className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center gap-1.5"
                  >
                    <span>Continue to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Price Summary & Final Checkout */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-xl font-black text-slate-900">Price Summary & Confirmation</h2>
                  <p className="text-xs text-slate-500">
                    Transparent, fixed upfront pricing. No hidden doorstep surprises.
                  </p>
                </div>

                {/* Selected Order Summary Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-bold text-slate-900">{service.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Slot:</span>
                    <span className="font-bold text-slate-900">
                      {isEmergency ? "⚡ 45-Min Emergency ASAP" : `${selectedDate}, ${selectedSlot}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Address:</span>
                    <span className="font-bold text-slate-900 truncate max-w-[240px]">
                      {addressLine}, {locality}
                    </span>
                  </div>
                </div>

                {/* Promo Code Box */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Apply Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. COOPFIRST"
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      Apply
                    </button>
                  </div>
                  {couponApplied && (
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Coupon '{couponCode}' applied! Saved ₹{discountAmount}.
                    </p>
                  )}
                  {couponError && <p className="text-[11px] text-rose-600 font-bold">{couponError}</p>}
                </div>

                {/* Smart Pricing Itemized Breakdown */}
                <div className="space-y-2.5 pt-2 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Service Rate</span>
                    <span className="font-bold text-slate-900">₹{basePrice}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Consumables & PPE Safety Gear</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST (18% Government Tax)</span>
                    <span className="font-bold text-slate-900">₹{taxes}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Coupon Discount</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-base sm:text-lg font-black text-slate-900">
                    <span>Total Amount (Pay After Service)</span>
                    <span className="text-brand-600">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Smart Pricing Transparency Guarantee */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Smart Pricing Transparency:</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Final price may vary after in-person inspection only if unexpected major spare parts (e.g. compressor capacitor, copper piping) are required. Technicians provide authentic MRP bills before installing any parts.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(5)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleFinalSubmit}
                    disabled={bookingState === "loading"}
                    className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
                  >
                    {bookingState === "loading" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Confirming with Specialist...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm booking</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Sticky Summary Sidebar */}
          <div className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-600">
                    {service.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{service.name}</h4>
                  <span className="text-xs font-black text-slate-900">₹{service.price}</span>
                </div>
              </div>

              {/* Progress Summary checklist */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Selected Slot:</span>
                  <span className="font-bold text-slate-800">
                    {isEmergency ? "⚡ 45-Min ASAP" : `${selectedDate}, ${selectedSlot}`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Locality:</span>
                  <span className="font-bold text-slate-800">{locality}, {selectedCity}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Assigned Specialist:</span>
                  <span className="font-bold text-slate-800">
                    {proPreferenceMode === "manual" ? "Specific Pro Chosen" : "Fastest Available 4.9★"}
                  </span>
                </div>
              </div>

              {/* Price summary block */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-800">₹{basePrice}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>GST & Taxes</span>
                  <span className="font-bold text-slate-800">₹{taxes}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-900 border-t border-slate-100 pt-2">
                  <span>Total Amount</span>
                  <span className="text-brand-600">₹{totalAmount}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-[11px] text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero advance payment needed. Pay after inspection.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
