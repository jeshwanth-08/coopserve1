"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Star,
  ShieldCheck,
  Zap,
  ArrowRight,
  User,
  Phone,
  AlertCircle,
  Award,
  Search,
  RefreshCw,
  Check,
  LogIn,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceItem, ProProfile } from "@/lib/homeData";

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: ServiceItem | null;
  initialPro?: ProProfile | null;
  selectedCity: string;
  selectedLocality: string;
}

const SERVICE_CATEGORY_TABS = [
  { id: "ALL", label: "All Services" },
  { id: "Electrical", label: "⚡ Electrical" },
  { id: "Plumbing", label: "🔧 Plumbing" },
  { id: "HVAC & AC", label: "❄️ AC & Appliances" },
  { id: "Cleaning", label: "✨ Cleaning" },
  { id: "Gardening", label: "🌿 Gardening" },
  { id: "Cooking", label: "🍳 Cooking" },
  { id: "Carpentry", label: "🔨 Carpentry" },
  { id: "Painting", label: "🎨 Painting" },
  { id: "Pest Control", label: "🛡️ Pest Control" },
  { id: "Beauty", label: "💇 Beauty & Salon" },
];

export default function QuickBookingModal({
  isOpen,
  onClose,
  initialService,
  initialPro,
  selectedCity,
  selectedLocality,
}: QuickBookingModalProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem>(
    initialService || POPULAR_SERVICES[0]
  );
  const [isSelectingService, setIsSelectingService] = useState<boolean>(!initialService);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedPro, setSelectedPro] = useState<ProProfile | null>(initialPro || null);
  const [dateOption, setDateOption] = useState<"today" | "tomorrow" | "dayAfter">("today");
  const [timeSlot, setTimeSlot] = useState<string>("10:00 AM - 12:00 PM");
  const [isEmergency, setIsEmergency] = useState(false);
  const [address, setAddress] = useState("Flat 402, Sunshine Heights");
  const [locality, setLocality] = useState(selectedLocality || "Indiranagar");
  const [customerName, setCustomerName] = useState("Aarav Mehta");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (data?.user) {
          setCurrentUser(data.user);
          if (data.user.name) setCustomerName(data.user.name);
          if (data.user.phone) setCustomerPhone(data.user.phone);
          if (data.user.address) setAddress(data.user.address);
          if (data.user.locality) setLocality(data.user.locality);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [isOpen]);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      setIsSelectingService(false);
    } else {
      setIsSelectingService(true);
    }
  }, [initialService, isOpen]);

  useEffect(() => {
    setSelectedPro(initialPro || null);
  }, [initialPro]);

  useEffect(() => {
    if (selectedLocality) {
      setLocality(selectedLocality);
    }
  }, [selectedLocality]);

  if (!isOpen) return null;

  // Filter available services
  const filteredServices = POPULAR_SERVICES.filter((service) => {
    const matchesTab =
      selectedCategoryTab === "ALL" ||
      service.category.toLowerCase().includes(selectedCategoryTab.toLowerCase()) ||
      service.categorySlug.toLowerCase().includes(selectedCategoryTab.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const handleSelectServiceFromList = (service: ServiceItem) => {
    setSelectedService(service);
    setIsSelectingService(false);
  };

  const handleConfirmBooking = async () => {
    // Unauthenticated booking is invalid: direct to sign in page
    if (!currentUser) {
      const proParam = selectedPro ? `?pro=${encodeURIComponent(selectedPro.name)}` : "";
      const targetUrl = `/book/${selectedService.id}${proParam}`;
      onClose();
      router.push(`/login?returnUrl=${encodeURIComponent(targetUrl)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedId = "BK-" + Math.floor(100000 + Math.random() * 900000);
      setBookingId(generatedId);

      try {
        await fetch("/api/requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: selectedPro ? selectedPro.role : selectedService.category,
            description: `${selectedPro ? `${selectedPro.name} (${selectedPro.role})` : selectedService.name} - ${notes || "Standard booking"} (Slot: ${dateOption}, ${timeSlot})`,
            visibility: "PERSONAL",
            locality: locality,
            address: address,
            isEmergency: isEmergency,
            preferredDateTime: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.warn("Backend request error:", err);
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setIsConfirmed(true);
      }, 800);
    } catch {
      setIsSubmitting(false);
      setIsConfirmed(true);
    }
  };

  const handleReset = () => {
    setIsConfirmed(false);
    setSelectedPro(null);
    onClose();
  };

  const TIME_SLOTS = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "01:00 PM - 03:00 PM",
    "04:00 PM - 06:00 PM",
    "07:00 PM - 09:00 PM",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isConfirmed ? "Booking Confirmed!" : "Book Trusted Home Professional"}
              </h3>
              <p className="text-xs text-slate-500">
                {isConfirmed
                  ? "A verified specialist is on standby"
                  : "Fixed price • 30-Day warranty • 100% genuine"}
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {isConfirmed ? (
            /* Confirmation State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  Booking ID: {bookingId}
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-3">
                  You&apos;re all set! Service is scheduled.
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  We have assigned your booking to a 5-star verified specialist in{" "}
                  <strong>{locality}, {selectedCity}</strong>. You&apos;ll receive SMS &amp; WhatsApp updates.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                {selectedPro && (
                  <>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Specialist:</span>
                      <span className="font-bold text-slate-800 text-right">{selectedPro.name}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Designation:</span>
                      <span className="font-bold text-brand-700 text-right max-w-[260px] leading-tight">
                        {selectedPro.role}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-800">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Slot:</span>
                  <span className="font-bold text-slate-800">
                    {dateOption === "today"
                      ? "Today"
                      : dateOption === "tomorrow"
                      ? "Tomorrow"
                      : "Day After"}
                    , {timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Address:</span>
                  <span className="font-bold text-slate-800">
                    {address}, {locality}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-slate-700">Total (Pay After Service):</span>
                  <span className="font-extrabold text-brand-600">₹{selectedService.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all"
                >
                  Done &amp; View Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <div className="space-y-4">
              {/* Guest / Unauthenticated Notice Banner */}
              {!currentUser && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-amber-900 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Sign-in Required to Complete Booking</p>
                    <p className="text-[11px] text-amber-800 leading-normal">
                      You are currently browsing as guest. Please sign in to verify your contact number and reserve verified professionals.
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Specialist Profile & Designation Card */}
              {selectedPro && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50 via-indigo-50/50 to-brand-50/40 border border-brand-200 shadow-sm space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-700 bg-white px-2.5 py-0.5 rounded-full border border-brand-200 flex items-center gap-1">
                      <Award className="w-3 h-3 text-brand-600" />
                      Selected Specialist
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Professional
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={selectedPro.avatar}
                        alt={selectedPro.name}
                        className="w-13 h-13 rounded-2xl object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-slate-900 truncate">
                          {selectedPro.name}
                        </h4>
                        <span className="flex items-center gap-0.5 text-xs font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 shrink-0">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {selectedPro.rating}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-brand-700 leading-tight mt-0.5">
                        {selectedPro.role}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {selectedPro.city} • {selectedPro.experienceYears} Years Exp • {selectedPro.jobsCompleted}+ Jobs Completed
                      </p>
                    </div>
                  </div>

                  {selectedPro.specialty && (
                    <div className="text-[11px] text-slate-600 bg-white/90 p-2 rounded-xl border border-brand-100 leading-relaxed">
                      <span className="font-bold text-slate-700">Specialty: </span>
                      {selectedPro.specialty}
                    </div>
                  )}
                </div>
              )}

              {/* Service Selection Interface: Various Options */}
              {isSelectingService ? (
                /* EXPANDED SERVICE SELECTOR */
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Choose a Service Option
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Select from 20 standard verified home services
                      </p>
                    </div>
                    {selectedService && (
                      <button
                        type="button"
                        onClick={() => setIsSelectingService(false)}
                        className="text-[11px] font-bold text-brand-600 hover:text-brand-700 underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search (e.g. Plumber, AC Jet, Deep Clean, Painting...)"
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                    {SERVICE_CATEGORY_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSelectedCategoryTab(tab.id)}
                        className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all ${
                          selectedCategoryTab === tab.id
                            ? "bg-brand-600 text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Service Items Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {filteredServices.map((svc) => {
                      const isSelected = selectedService?.id === svc.id;
                      return (
                        <div
                          key={svc.id}
                          onClick={() => handleSelectServiceFromList(svc)}
                          className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? "bg-brand-50/80 border-brand-500 shadow-xs"
                              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={svc.image}
                              alt={svc.name}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-100"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 truncate">
                                {svc.name}
                              </p>
                              <span className="text-[10px] text-slate-400 block truncate">
                                {svc.category} • {svc.duration}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-slate-900 block">
                              ₹{svc.price}
                            </span>
                            {isSelected && (
                              <span className="inline-flex items-center text-[10px] font-bold text-brand-600">
                                <Check className="w-3 h-3 mr-0.5" /> Selected
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {filteredServices.length === 0 && (
                      <div className="col-span-2 text-center py-6 text-slate-400 text-xs">
                        No service matching &ldquo;{searchQuery}&rdquo;. Try another term.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* COMPACT SELECTED SERVICE CARD WITH SWITCH BUTTON */
                <div className="p-3.5 rounded-2xl bg-brand-50/50 border border-brand-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedService.image}
                      alt={selectedService.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block truncate">
                        {selectedService.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                        {selectedService.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                        Duration: {selectedService.duration} • 30-Day Guarantee
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <div>
                      <span className="text-sm sm:text-base font-black text-slate-900 block">
                        ₹{selectedService.price}
                      </span>
                      <span className="text-[10px] text-slate-400 line-through block">
                        ₹{selectedService.originalPrice}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsSelectingService(true)}
                      className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white border border-brand-200 text-brand-700 hover:bg-brand-50 flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Change Service</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Emergency ASAP Dispatch Toggle */}
              <div
                onClick={() => setIsEmergency(!isEmergency)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isEmergency
                    ? "bg-red-50 border-red-300 text-red-900"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isEmergency ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">
                      ⚡ Need Urgent Emergency Dispatch (Arrives in 45 Mins)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      High priority routing for water leaks, power trips &amp; lockouts
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={() => {}}
                  className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                />
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-600" />
                  <span>Choose Service Date</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "today", label: "Today", sub: "Fastest Slot" },
                    { id: "tomorrow", label: "Tomorrow", sub: "All Slots Open" },
                    { id: "dayAfter", label: "Day After", sub: "Flexible" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDateOption(d.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        dateOption === d.id
                          ? "bg-brand-50 border-brand-600 text-brand-700 font-bold shadow-sm"
                          : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <span className="text-xs font-bold block">{d.label}</span>
                      <span className="text-[10px] text-slate-500">{d.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot Selection */}
              {!isEmergency && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    <span>Select 2-Hour Slot</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`p-2 rounded-xl border text-center text-xs transition-all ${
                          timeSlot === slot
                            ? "bg-brand-50 border-brand-600 text-brand-700 font-bold"
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Address & Locality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-brand-600" />
                    <span>Door / Flat &amp; Building</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white"
                    placeholder="e.g. Flat 301, Tower B"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                    Locality / Society
                  </label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white"
                    placeholder="e.g. Indiranagar, Bengaluru"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
                    <User className="w-3 h-3 text-brand-600" />
                    <span>Your Name</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-brand-600" />
                    <span>Phone (For OTP &amp; Updates)</span>
                  </label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Trust & Safe Guarantee */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="leading-tight">
                  <strong>₹0 Visit Fee &amp; Pay After Service.</strong> Covered by ₹10,000 CoopServe damage protection &amp; 30-day warranty.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isConfirmed && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 block">Total Amount</span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-slate-900">₹{selectedService.price}</span>
                <span className="text-xs text-slate-400">incl. all taxes</span>
              </div>
            </div>

            {!currentUser ? (
              /* Unauthenticated user: direct to sign in page */
              <button
                onClick={() => {
                  const proParam = selectedPro ? `?pro=${encodeURIComponent(selectedPro.name)}` : "";
                  const targetUrl = `/book/${selectedService.id}${proParam}`;
                  onClose();
                  router.push(`/login?returnUrl=${encodeURIComponent(targetUrl)}`);
                }}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Book Service</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              /* Authenticated user: confirm booking */
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Reserving Specialist...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
