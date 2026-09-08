"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Wrench,
  Sparkles,
  Scissors,
  Truck,
  Home,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceItem } from "@/lib/homeData";

interface InteractiveServiceFinderProps {
  onOpenBooking: (service: ServiceItem) => void;
}

interface PrimaryOption {
  id: string;
  label: string;
  emoji: string;
  icon: React.ReactNode;
  subQuestions: {
    question: string;
    choices: { label: string; recommendedServiceId: string; note: string }[];
  };
}

export default function InteractiveServiceFinder({
  onOpenBooking,
}: InteractiveServiceFinderProps) {
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null);
  const [selectedSubChoice, setSelectedSubChoice] = useState<{
    label: string;
    recommendedServiceId: string;
    note: string;
  } | null>(null);

  const PRIMARY_OPTIONS: PrimaryOption[] = [
    {
      id: "broke",
      label: "Something broke 🔧",
      emoji: "🔧",
      icon: <Wrench className="w-5 h-5 text-amber-600" />,
      subQuestions: {
        question: "Which appliance or fixture is malfunctioning?",
        choices: [
          {
            label: "AC is blowing warm air, hissing or leaking water",
            recommendedServiceId: "svc-5",
            note: "Master Power Jet AC Service & Gas Diagnosis",
          },
          {
            label: "Water tap is dripping, low pressure or flush leaking",
            recommendedServiceId: "svc-2",
            note: "Tap Leakage, Spout & Flush Tank Repair",
          },
          {
            label: "Switchboard sparking, fuse blown or MCB continuously tripping",
            recommendedServiceId: "svc-1",
            note: "Emergency Electrical Health & Wiring Audit",
          },
          {
            label: "Washing machine, fridge or microwave malfunctioning",
            recommendedServiceId: "svc-6",
            note: "All Appliance Motor & PCB Diagnosis",
          },
          {
            label: "Laptop or PC won't boot, slow performance or blue screen",
            recommendedServiceId: "svc-11",
            note: "Computer Hardware & OS Optimization",
          },
          {
            label: "Mobile phone screen cracked or battery draining quickly",
            recommendedServiceId: "svc-12",
            note: "Screen Replacement & Battery Checkup",
          },
          {
            label: "Car or bike breakdown, battery jumpstart or engine noise",
            recommendedServiceId: "svc-15",
            note: "Doorstep Mechanic & Breakdown Assistance",
          },
        ],
      },
    },
    {
      id: "cleaning",
      label: "Need cleaning 🧹",
      emoji: "🧹",
      icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
      subQuestions: {
        question: "What type of space requires deep cleaning?",
        choices: [
          {
            label: "Full 2/3 BHK home deep cleaning & sanitization",
            recommendedServiceId: "svc-7",
            note: "Complete Deep Cleaning with Single-Disc Scrubbing",
          },
          {
            label: "Bathrooms have stubborn hard water stains & lime scale",
            recommendedServiceId: "svc-7",
            note: "Intense Bathroom Deep Cleaning & De-scaling",
          },
          {
            label: "Garden lawn trimming, weeding & potted plant maintenance",
            recommendedServiceId: "svc-9",
            note: "Lawn Mowing & Soil Enrichment Care",
          },
        ],
      },
    },
    {
      id: "beauty",
      label: "Need beauty 💇",
      emoji: "💇",
      icon: <Scissors className="w-5 h-5 text-rose-500" />,
      subQuestions: {
        question: "What at-home self-care treatment do you prefer?",
        choices: [
          {
            label: "Hydra glow facial, cleanup, manicure & pedicure at home",
            recommendedServiceId: "svc-19",
            note: "Single-Use Sealed Salon Kit & Esthetician Glow",
          },
          {
            label: "Waxing, threading, hair styling & party/bridal makeup",
            recommendedServiceId: "svc-19",
            note: "At-Home Salon Spa with 100% Hygienic Disposables",
          },
          {
            label: "Custom dress, blouse stitching or suit alteration",
            recommendedServiceId: "svc-13",
            note: "Doorstep Master Tailor Measurement & Stitching",
          },
        ],
      },
    },
    {
      id: "moving",
      label: "Moving house 📦",
      emoji: "📦",
      icon: <Truck className="w-5 h-5 text-blue-600" />,
      subQuestions: {
        question: "What is your main moving or shifting requirement?",
        choices: [
          {
            label: "Full house shifting, packing, transport & safe unloading",
            recommendedServiceId: "svc-16",
            note: "Verified Packers & Movers with 3-Layer Bubble Wrap",
          },
          {
            label: "Disassemble & reassemble heavy IKEA bed/modular wardrobes",
            recommendedServiceId: "svc-3",
            note: "Modular Bed & Wardrobe Precision Carpentry",
          },
          {
            label: "Reliable city or outstation driver for personal car",
            recommendedServiceId: "svc-14",
            note: "Background-Verified Chauffeur for Local/Highway Drive",
          },
        ],
      },
    },
    {
      id: "maintenance",
      label: "Home & Family 🏠",
      emoji: "🏠",
      icon: <Home className="w-5 h-5 text-emerald-600" />,
      subQuestions: {
        question: "What service does your home or family need?",
        choices: [
          {
            label: "Fresh interior/exterior wall painting & color consultation",
            recommendedServiceId: "svc-4",
            note: "Laser Measured Wall Painting & Waterproofing",
          },
          {
            label: "Healthy daily home-cooked meals or party catering",
            recommendedServiceId: "svc-8",
            note: "Trained Hygienic Cook for North/South Indian Cuisines",
          },
          {
            label: "Private 1-on-1 tutor for school Maths, Science or English",
            recommendedServiceId: "svc-10",
            note: "Certified Curriculum Tutor (CBSE / ICSE / State)",
          },
          {
            label: "Loving, experienced childcare & infant babysitter",
            recommendedServiceId: "svc-17",
            note: "Police-Verified Nanny & Babysitter",
          },
          {
            label: "Dog walking, cat sitting & at-home pet care",
            recommendedServiceId: "svc-18",
            note: "Compassionate Pet Sitters & Grooming Care",
          },
          {
            label: "Birthday theme balloon decor, photographer & DJ setup",
            recommendedServiceId: "svc-20",
            note: "Celebration Event Planning & Backdrop Styling",
          },
        ],
      },
    },
  ];

  const currentPrimary = PRIMARY_OPTIONS.find((p) => p.id === selectedPrimary);
  const recommendedService = selectedSubChoice
    ? POPULAR_SERVICES.find(
        (s) =>
          s.id === selectedSubChoice.recommendedServiceId ||
          s.slug === selectedSubChoice.recommendedServiceId ||
          s.categorySlug === selectedSubChoice.recommendedServiceId
      ) ||
      (selectedPrimary === "beauty"
        ? POPULAR_SERVICES.find((s) => s.id === "svc-19" || s.slug === "beauty-services")
        : null) ||
      POPULAR_SERVICES[0]
    : null;


  const handleReset = () => {
    setSelectedPrimary(null);
    setSelectedSubChoice(null);
  };

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 via-brand-50/30 to-white border-b border-slate-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600" />
            <span>Interactive Service Finder</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Need help deciding?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Answer two quick questions to get matched with the exact specialist and fixed upfront price.
          </p>
        </div>

        {/* Wizard Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 relative overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className={`px-2.5 py-1 rounded-full ${!selectedPrimary ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                Step 1: Category
              </span>
              <span>→</span>
              <span className={`px-2.5 py-1 rounded-full ${selectedPrimary && !selectedSubChoice ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                Step 2: Specific Need
              </span>
              <span>→</span>
              <span className={`px-2.5 py-1 rounded-full ${selectedSubChoice ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                Step 3: Recommendation
              </span>
            </div>

            {(selectedPrimary || selectedSubChoice) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Start over</span>
              </button>
            )}
          </div>

          {/* STEP 1: What happened? */}
          {!selectedPrimary && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-base sm:text-lg font-black text-slate-900 text-center">
                What happened?
              </h3>
              <p className="text-xs text-slate-500 text-center max-w-md mx-auto -mt-2">
                Choose the statement that best matches your current situation:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3">
                {PRIMARY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedPrimary(opt.id)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-brand-50 hover:border-brand-300 border border-slate-200 text-left transition-all duration-200 flex flex-col justify-between group hover:shadow-md card-hover-effect"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      {opt.icon}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700">
                        {opt.label}
                      </p>
                      <span className="text-[10px] text-slate-400 group-hover:text-brand-600 flex items-center gap-1 mt-2">
                        Diagnose <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Follow-up Question */}
          {selectedPrimary && currentPrimary && !selectedSubChoice && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-brand-600 tracking-wider">
                    Selected: {currentPrimary.label}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    {currentPrimary.subQuestions.question}
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                {currentPrimary.subQuestions.choices.map((choice, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSubChoice(choice)}
                    className="w-full p-4 rounded-2xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200 hover:border-brand-300 text-left transition-all flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white text-brand-600 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-700">
                          {choice.label}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{choice.note}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Recommended Service Card */}
          {selectedSubChoice && recommendedService && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Match Found For Your Requirement
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  We recommend: {recommendedService.name}
                </h3>
              </div>

              {/* Matched Product Box */}
              <div className="bg-gradient-to-r from-brand-50/80 via-white to-amber-50/50 p-5 rounded-3xl border border-brand-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <img
                    src={recommendedService.image}
                    alt={recommendedService.name}
                    className="w-20 h-20 rounded-2xl object-cover shadow-sm shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                      {recommendedService.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                      {recommendedService.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {recommendedService.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {recommendedService.rating}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {recommendedService.duration}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">30-Day Warranty</span>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-right shrink-0 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Fixed Price
                  </span>
                  <div className="flex items-baseline justify-center md:justify-end gap-1.5 mb-3">
                    <span className="text-2xl font-black text-slate-900">
                      ₹{recommendedService.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{recommendedService.originalPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenBooking(recommendedService)}
                    className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Instant Book Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
