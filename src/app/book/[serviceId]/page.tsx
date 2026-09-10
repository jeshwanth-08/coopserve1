"use client";

import React, { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  CreditCard,
  Wallet,
  Landmark,
  QrCode,
  FileCheck2,
  X,
  Compass,
  Package,
  LayoutDashboard,
} from "lucide-react";
import ServiceLocationMap from "@/components/maps/ServiceLocationMap";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import {
  POPULAR_SERVICES,
  TOP_PROFESSIONALS,
  INDIAN_CITIES,
  ServiceItem,
  getMatchingServiceForPro,
  findMatchingServiceForCategory,
} from "@/lib/homeData";
import { createBooking } from "@/lib/bookingService";
import { validateCoupon } from "@/lib/adminData";
import {
  PAYMENT_METHODS,
  PaymentMethodType,
  PaymentReceipt,
  processRealisticPayment,
} from "@/lib/paymentService";
import SocietyGroupPoolSection from "@/components/booking/SocietyGroupPoolSection";
import { SocietyPoolItem } from "@/lib/societyPoolService";
import { CURATED_SERVICE_PACKAGES } from "@/lib/supportAndPackageData";

function BookingPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = (params?.serviceId as string) || "svc-1";

  const isPrefilled = searchParams.get("prefilled") === "true";
  const proQuery = searchParams.get("pro");
  const dateQuery = searchParams.get("date");
  const slotQuery = searchParams.get("slot");
  const packageQuery = searchParams.get("package");

  const matchedPackage =
    CURATED_SERVICE_PACKAGES.find(
      (p) =>
        (packageQuery &&
          (p.slug.toLowerCase() === packageQuery.toLowerCase() ||
            p.id.toLowerCase() === packageQuery.toLowerCase())) ||
        p.id.toLowerCase() === serviceId.toLowerCase() ||
        p.slug.toLowerCase() === serviceId.toLowerCase()
    ) || null;

  const matchingPro = proQuery
    ? TOP_PROFESSIONALS.find(
        (p) =>
          p.name.toLowerCase() === proQuery.toLowerCase() ||
          p.id.toLowerCase() === proQuery.toLowerCase()
      )
    : null;

  const [service, setService] = useState<ServiceItem>(() => {
    if (matchedPackage) {
      return {
        id: matchedPackage.id,
        name: matchedPackage.title,
        slug: matchedPackage.slug,
        category: "Bundled Service Package",
        categorySlug: "packages",
        rating: matchedPackage.rating,
        reviewsCount: matchedPackage.reviewsCount,
        bookingsCount: matchedPackage.reviewsCount * 2,
        price: matchedPackage.packagePrice,
        originalPrice: matchedPackage.originalPrice,
        duration: matchedPackage.duration,
        image: matchedPackage.image,
        badge: matchedPackage.tag,
        description: matchedPackage.description,
        includes: matchedPackage.includedServices.map((s) => `${s.name}: ${s.desc}`),
        excludes: ["Additional consumables beyond standard package allocation"],
        isAvailable: true,
      };
    }
    if (matchingPro && (!serviceId || serviceId === "svc-1")) {
      return getMatchingServiceForPro(matchingPro);
    }
    const foundDirect =
      POPULAR_SERVICES.find(
        (s) =>
          s.id === serviceId ||
          s.slug === serviceId ||
          s.categorySlug === serviceId ||
          s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === serviceId.toLowerCase() ||
          s.name.toLowerCase() === serviceId.toLowerCase()
      ) || findMatchingServiceForCategory(serviceId);

    if (foundDirect) return foundDirect;
    if (matchingPro) return getMatchingServiceForPro(matchingPro);
    return POPULAR_SERVICES[0];
  });

  // Synchronize service when package or service query updates
  React.useEffect(() => {
    if (matchedPackage) {
      setService({
        id: matchedPackage.id,
        name: matchedPackage.title,
        slug: matchedPackage.slug,
        category: "Bundled Service Package",
        categorySlug: "packages",
        rating: matchedPackage.rating,
        reviewsCount: matchedPackage.reviewsCount,
        bookingsCount: matchedPackage.reviewsCount * 2,
        price: matchedPackage.packagePrice,
        originalPrice: matchedPackage.originalPrice,
        duration: matchedPackage.duration,
        image: matchedPackage.image,
        badge: matchedPackage.tag,
        description: matchedPackage.description,
        includes: matchedPackage.includedServices.map((s) => `${s.name}: ${s.desc}`),
        excludes: ["Additional consumables beyond standard package allocation"],
        isAvailable: true,
      });
      setIssueNotes((prev) =>
        !prev || prev.startsWith("Package Bundle:") || prev.includes("AC regular cleaning")
          ? `Package Bundle: ${matchedPackage.title} (${matchedPackage.includedServices.map((s) => s.name).join(", ")})`
          : prev
      );
    } else {
      const found =
        POPULAR_SERVICES.find(
          (s) =>
            s.id === serviceId ||
            s.slug === serviceId ||
            s.categorySlug === serviceId ||
            s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === serviceId.toLowerCase() ||
            s.name.toLowerCase() === serviceId.toLowerCase()
        ) || findMatchingServiceForCategory(serviceId);
      if (found) {
        setService(found);
      } else if (matchingPro) {
        setService(getMatchingServiceForPro(matchingPro));
      }
    }
  }, [serviceId, packageQuery, matchingPro]);

  // Stepper: 1: Service, 2: Date & Time, 3: Address, 4: Details & Media, 5: Professional, 6: Checkout
  const [currentStep, setCurrentStep] = useState<number>(2); // Default to Step 2 since service was clicked

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(
    dateQuery || (isPrefilled ? "Tomorrow" : "Today")
  );
  const [selectedSlot, setSelectedSlot] = useState<string>(
    slotQuery || (isPrefilled ? "3:00 PM" : "10:30 AM")
  );
  const [isEmergency, setIsEmergency] = useState(false);

  // Address State
  const [addressType, setAddressType] = useState<"Home" | "Work" | "Other">("Home");
  const [addressLine, setAddressLine] = useState("Flat 402, Sunshine Heights, 12th Main");
  const [locality, setLocality] = useState("Indiranagar");
  const [selectedCity, setSelectedCity] = useState("Bengaluru");
  const [customerName, setCustomerName] = useState("Aarav Mehta");
  const [customerPhone, setCustomerPhone] = useState("+91 98765 43210");
  const [selectedSocietyPool, setSelectedSocietyPool] = useState<SocietyPoolItem | null>(null);
  const [showMapCanvas, setShowMapCanvas] = useState(false);

  // Additional Details & Media State
  const [issueNotes, setIssueNotes] = useState(
    matchedPackage
      ? `Package Bundle: ${matchedPackage.title} (${matchedPackage.includedServices.map((s) => s.name).join(", ")})`
      : isPrefilled
      ? "AC regular cleaning & jet spray service"
      : ""
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80",
  ]);
  const [isUploading, setIsUploading] = useState(false);

  // Professional Preference State
  const [proPreferenceMode, setProPreferenceMode] = useState<"auto" | "manual">(
    matchingPro ? "manual" : "auto"
  );
  const [selectedProId, setSelectedProId] = useState<string>(
    matchingPro ? matchingPro.id : TOP_PROFESSIONALS[0].id
  );

  // Promo Code State
  const [couponCode, setCouponCode] = useState("FIRSTBOOK");
  const [couponApplied, setCouponApplied] = useState(true);
  const [discountAmount, setDiscountAmount] = useState(150);
  const [couponError, setCouponError] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);

  // Payment Options State
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodType>("UPI");
  const [selectedUpiApp, setSelectedUpiApp] = useState<
    "GPAY" | "PHONEPE" | "PAYTM" | "QR"
  >("GPAY");
  const [upiId, setUpiId] = useState("aarav@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8819");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("892");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");
  const [selectedWallet, setSelectedWallet] = useState("Paytm Wallet");

  // Payment Processing Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentProcessState, setPaymentProcessState] = useState<
    "PROCESSING" | "SUCCESSFUL" | "FAILED"
  >("PROCESSING");
  const [activeReceipt, setActiveReceipt] = useState<PaymentReceipt | null>(
    null
  );

  // Submission State
  const [createdOrderId, setCreatedOrderId] = useState<string>("BK-849201");
  const [bookingState, setBookingState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifyingAuth, setIsVerifyingAuth] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { user: null }))
      .then((data) => {
        if (!isMounted) return;
        if (!data?.user) {
          const fullPath = window.location.pathname + window.location.search;
          router.push(`/login?returnUrl=${encodeURIComponent(fullPath)}`);
        } else {
          setIsVerifyingAuth(false);
          if (data.user.name) setCustomerName(data.user.name);
          if (data.user.phone) setCustomerPhone(data.user.phone);
          if (data.user.address) setAddressLine(data.user.address);
          if (data.user.locality) setLocality(data.user.locality);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fullPath = window.location.pathname + window.location.search;
        router.push(`/login?returnUrl=${encodeURIComponent(fullPath)}`);
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

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
    { time: "3:00 PM", status: "Available", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { time: "4:00 PM", status: "Unavailable", color: "text-slate-400 bg-slate-100 border-slate-200" },
    { time: "6:00 PM", status: "Almost full", color: "text-amber-800 bg-amber-50 border-amber-200" },
  ];

  const SAVED_ADDRESSES = {
    Home: "Flat 402, Sunshine Heights, 12th Main, Indiranagar",
    Work: "Level 4, WeWork Galaxy, Residency Road",
    Other: "House 18, 5th Cross, Palm Meadows",
  };

  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCode).trim();
    setCouponError("");
    const result = validateCoupon(code, service.price, true);
    if (result.isValid) {
      setCouponCode(code);
      setDiscountAmount(result.discountAmount);
      setCouponApplied(true);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3500);
    } else {
      setCouponApplied(false);
      setDiscountAmount(0);
      setCouponError("That code didn’t work. Try another coupon");
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

  const handleFinalSubmit = async (simulateFail: boolean = false) => {
    setBookingState("loading");
    setErrorMessage("");
    setPaymentModalOpen(true);
    setPaymentProcessState("PROCESSING");

    const orderId = "BK-" + Math.floor(100000 + Math.random() * 900000);
    setCreatedOrderId(orderId);
    const payResult = await processRealisticPayment(
      {
        orderId,
        amount: totalAmount,
        method: selectedPaymentMethod,
      },
      simulateFail
    );

    setActiveReceipt(payResult.receipt);

    if (payResult.success) {
      setPaymentProcessState("SUCCESSFUL");
      try {
        await createBooking({
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
          societyName: selectedSocietyPool?.societyName,
          groupCode: selectedSocietyPool?.code,
          poolId: selectedSocietyPool?.id,
        });
        setBookingState("success");
      } catch (err: any) {
        console.warn("Notice syncing local record:", err);
      }
    } else {
      setPaymentProcessState("FAILED");
      setBookingState("error");
      setErrorMessage(
        "Your payment didn’t go through. Please retry or select Cash After Service."
      );
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

  if (isVerifyingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Verifying member sign in...</p>
        </div>
      </div>
    );
  }

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

        {matchedPackage && (
          <div className="mb-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-brand-700 via-indigo-600 to-brand-600 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                    {matchedPackage.tag || "Bundled Service Package"}
                  </span>
                  <span className="text-xs text-emerald-200 font-bold bg-emerald-500/20 border border-emerald-300/30 px-2 py-0.5 rounded-full">
                    Save ₹{matchedPackage.savings} instantly
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black">{matchedPackage.title}</h2>
                <p className="text-xs text-brand-100 max-w-2xl mt-0.5 line-clamp-2">
                  <strong>Included:</strong> {matchedPackage.includedServices.map((s) => s.name).join(" • ")}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/15 self-start sm:self-center">
              <div className="text-2xl font-black">₹{matchedPackage.packagePrice}</div>
              <div className="text-xs text-brand-200 line-through">₹{matchedPackage.originalPrice}</div>
            </div>
          </div>
        )}

        {isPrefilled && (
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
                <Sparkles className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="font-bold text-teal-950 text-sm">1-Click Instant Rebook Activated</p>
                <p className="text-teal-700 text-xs">
                  Prefilled with {matchingPro ? matchingPro.name : "preferred specialist"} for <strong>{selectedDate} at {selectedSlot}</strong>. You can proceed directly or customize each step below.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-200/80 text-teal-900 font-bold text-[11px] self-start sm:self-center shrink-0">
              ⚡ Instant Rebook
            </span>
          </div>
        )}

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

                {matchedPackage && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Included In This Package ({matchedPackage.includedServices.length} Services):</span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        ₹{matchedPackage.savings} Combined Discount
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {matchedPackage.includedServices.map((inc, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                          <p className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{inc.name}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{inc.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

                {/* OpenStreetMap + Leaflet GIS Live Canvas */}
                <div className="pt-1">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowMapCanvas(!showMapCanvas)}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-sm"
                    >
                      <Compass className="w-4 h-4 text-emerald-600" />
                      <span>{showMapCanvas ? "Close OpenStreetMap Canvas" : "Pin Address on OpenStreetMap (Leaflet Canvas)"}</span>
                    </button>
                    {showMapCanvas && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        GIS Reverse Geocode Active
                      </span>
                    )}
                  </div>

                  {showMapCanvas && (
                    <div className="mt-3 animate-in fade-in duration-200">
                      <ServiceLocationMap
                        initialLocality={locality || "Greenwood Heights"}
                        onLocationSelect={(loc) => {
                          if (loc.address) setAddressLine(loc.address);
                          if (loc.locality) setLocality(loc.locality);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Optional Society/Apartment Group Pool Section */}
                <SocietyGroupPoolSection
                  category={service.category}
                  locality={locality}
                  addressLine={addressLine}
                  selectedPool={selectedSocietyPool}
                  onSelectPool={setSelectedSocietyPool}
                />

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

                {/* Specialist Confirmation Banner */}
                <div className="p-3.5 bg-brand-50/80 border border-brand-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🔧</span>
                    <div>
                      <p className="text-xs font-black text-brand-950">Your pro is locked in 🔧</p>
                      <p className="text-[10px] text-brand-700">
                        {proPreferenceMode === "auto"
                          ? "Automated match reserved with nearest top-rated pro."
                          : `Reserved specialist: ${TOP_PROFESSIONALS.find((p) => p.id === selectedProId)?.name || "Rahul Kumar"}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-brand-600 text-white px-2 py-0.5 rounded-md shrink-0">
                    Guaranteed
                  </span>
                </div>

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

                {/* Engaging Offers & Coupons System */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Coupons & Exclusive Offers
                    </label>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      3 Offers Available
                    </span>
                  </div>

                  {/* Featured FIRSTBOOK Offer Card */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-200/80 text-amber-900 flex flex-col items-center justify-center font-black text-xs leading-none">
                        <span>₹150</span>
                        <span className="text-[8px] uppercase">OFF</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-amber-950 text-xs">FIRSTBOOK</span>
                          <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
                            First booking
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Get ₹150 off your first service booking (Min order ₹399)
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("FIRSTBOOK")}
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-sm self-start sm:self-center shrink-0"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Quick Promo Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Other coupons:</span>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("SUMMERCOOL")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-brand-500 bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-brand-600" />
                      <span>SUMMERCOOL (20% OFF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("DEEP250")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 hover:border-brand-500 bg-slate-50 text-[11px] font-bold text-slate-700 flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3 text-brand-600" />
                      <span>DEEP250 (₹250 OFF)</span>
                    </button>
                  </div>

                  {/* Custom Coupon Input */}
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter promo code (e.g. FIRSTBOOK)"
                      className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                    >
                      Apply
                    </button>
                  </div>

                  {/* Celebration Animation Banner */}
                  {showCelebration && (
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-between animate-in zoom-in-95 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                        <span>🎉 Woohoo! Coupon '{couponCode}' applied! Saved ₹{discountAmount}.</span>
                      </div>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase">
                        Discount Applied
                      </span>
                    </div>
                  )}

                  {couponApplied && !showCelebration && (
                    <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Coupon '{couponCode}' applied! You saved ₹{discountAmount}.
                    </p>
                  )}

                  {couponError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                      <span>{couponError}</span>
                    </div>
                  )}
                </div>

                {/* Realistic Payment Methods UI */}
                <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Select Payment Method</h3>
                      <p className="text-xs text-slate-500">
                        Zero transaction fees. 256-bit encrypted checkout.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                      <span>Razorpay / Stripe Ready</span>
                    </span>
                  </div>

                  {/* Payment Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {PAYMENT_METHODS.map((method) => {
                      const isSelected = selectedPaymentMethod === method.id;
                      return (
                        <div
                          key={method.id}
                          onClick={() => setSelectedPaymentMethod(method.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                            isSelected
                              ? "border-brand-600 bg-brand-50/40 shadow-sm"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="paymentMethodRadio"
                                checked={isSelected}
                                onChange={() => setSelectedPaymentMethod(method.id)}
                                className="text-brand-600 h-4 w-4"
                              />
                              <span className="text-xs font-bold text-slate-900">
                                {method.title}
                              </span>
                            </div>
                            {method.badge && (
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${method.badgeColor}`}>
                                {method.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 pl-6">
                            {method.sub}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Sub-Details for Selected Method */}
                  {selectedPaymentMethod === "UPI" && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                      <span className="text-[11px] font-bold text-slate-700 block">Choose UPI App:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "GPAY", label: "Google Pay" },
                          { id: "PHONEPE", label: "PhonePe" },
                          { id: "PAYTM", label: "Paytm UPI" },
                          { id: "QR", label: "Show QR Code" },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => setSelectedUpiApp(app.id as any)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                              selectedUpiApp === app.id
                                ? "bg-white border-brand-600 text-brand-700 shadow-sm"
                                : "bg-white border-slate-200 text-slate-600"
                            }`}
                          >
                            {app.label}
                          </button>
                        ))}
                      </div>
                      {selectedUpiApp !== "QR" ? (
                        <div className="flex gap-2 pt-1">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="Enter VPA ID (e.g. mobile@upi)"
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium"
                          />
                        </div>
                      ) : (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                          <QrCode className="w-16 h-16 mx-auto text-slate-800" />
                          <p className="text-[11px] text-slate-500">Scan QR using any UPI app to pay ₹{totalAmount}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(selectedPaymentMethod === "CREDIT_CARD" || selectedPaymentMethod === "DEBIT_CARD") && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in text-xs">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4532 0000 0000 0000"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                          />
                          <CreditCard className="w-4 h-4 absolute right-3 top-2.5 text-slate-400" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Valid Thru (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === "NET_BANKING" && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in text-xs">
                      <label className="font-bold text-slate-700 block">Select Your Bank:</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {selectedPaymentMethod === "WALLETS" && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in text-xs">
                      <label className="font-bold text-slate-700 block">Select Digital Wallet:</label>
                      <select
                        value={selectedWallet}
                        onChange={(e) => setSelectedWallet(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
                      >
                        <option value="Paytm Wallet">Paytm Wallet (Balance ₹1,420)</option>
                        <option value="Amazon Pay">Amazon Pay Balance</option>
                        <option value="Mobikwik">Mobikwik Wallet</option>
                      </select>
                    </div>
                  )}

                  {selectedPaymentMethod === "CASH_AFTER_SERVICE" && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        <strong>Zero upfront risk:</strong> Inspect work first, then pay in cash or UPI directly to your assigned technician.
                      </span>
                    </div>
                  )}
                </div>

                {/* Smart Pricing Itemized Breakdown & Summary */}
                <div className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Itemized Payment Summary
                  </h3>
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
                      <span>Promo Coupon Discount ({couponCode})</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Replacement Spare Parts / Materials</span>
                    <span className="font-bold text-slate-900">₹0 (As per MRP if required)</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 text-base sm:text-lg font-black text-slate-900">
                    <span>Total Payable</span>
                    <span className="text-brand-600">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                    <span>Payment Method:</span>
                    <span className="font-bold text-slate-700">{selectedPaymentMethod.replace(/_/g, " ")}</span>
                  </div>
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

                  <div className="flex items-center gap-2">
                    {/* Optional test fail simulation button */}
                    <button
                      type="button"
                      onClick={() => handleFinalSubmit(true)}
                      title="Test payment failure handling"
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-400 text-[10px] font-bold"
                    >
                      Simulate Failure
                    </button>

                    <button
                      onClick={() => handleFinalSubmit(false)}
                      disabled={bookingState === "loading"}
                      className="px-8 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-black text-xs sm:text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
                    >
                      {bookingState === "loading" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <span>Let’s fix it (₹{totalAmount})</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* REALISTIC PAYMENT MODAL & RECEIPT */}
          {paymentModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
                {paymentProcessState === "PROCESSING" && (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-14 h-14 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <h3 className="text-lg font-black text-slate-900">
                      Payment Processing...
                    </h3>
                    <p className="text-xs text-slate-500">
                      Authorizing ₹{totalAmount} via {selectedPaymentMethod.replace(/_/g, " ")}. Please do not press back or refresh.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-mono">
                      Encrypted 256-Bit SSL Handshake Active
                    </div>
                  </div>
                )}

                {paymentProcessState === "SUCCESSFUL" && (
                  <div className="space-y-4 animate-in fade-in">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-black animate-checkmark">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-black text-slate-900">
                        {selectedPaymentMethod === "CASH_AFTER_SERVICE"
                          ? "Booking Confirmed (Pay After Service)"
                          : "Payment Successful!"}
                      </h3>
                      <p className="text-xs text-slate-500">
                        Transaction reference: {activeReceipt?.transactionId || "TXN-PAY-849102"}
                      </p>
                    </div>

                    {/* Official Receipt Summary */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Service</span>
                        <span className="font-bold text-slate-900">{service.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Base Fare</span>
                        <span className="font-bold text-slate-900">₹{basePrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">GST (18%)</span>
                        <span className="font-bold text-slate-900">₹{taxes}</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-emerald-600 font-bold">
                          <span>Discount ({couponCode})</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-900">
                        <span>Total Paid</span>
                        <span className="text-brand-600">₹{totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>Payment Status:</span>
                        <span className="text-emerald-700 font-bold uppercase">
                          {activeReceipt?.status || "Payment successful"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <Link
                        href={`/tracking/${createdOrderId || activeReceipt?.orderId || "BK-849201"}`}
                        className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs sm:text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                      >
                        <Zap className="w-4 h-4" />
                        <span>Track Specialist Live ↗</span>
                      </Link>

                      <Link
                        href="/member"
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
                        <span>Go to Member Dashboard</span>
                      </Link>

                      <button
                        onClick={() => alert("Downloading printable PDF receipt...")}
                        className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Download Payment Receipt</span>
                      </button>
                    </div>
                  </div>
                )}

                {paymentProcessState === "FAILED" && (
                  <div className="space-y-4 animate-in fade-in text-center">
                    <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto font-black">
                      <X className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Your payment didn’t go through.</h3>
                      <p className="text-xs text-rose-600 mt-1">
                        Transaction declined by issuing bank or payment gateway.
                      </p>
                    </div>

                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-left">
                      No amount was debited from your account. You can retry immediately or choose Cash After Service.
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
                      <button
                        onClick={() => handleFinalSubmit(false)}
                        className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-[0.98] transition-transform"
                      >
                        Try again
                      </button>
                      <button
                        onClick={() => setPaymentModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Change Payment Method
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookingPageContent />
    </Suspense>
  );
}
