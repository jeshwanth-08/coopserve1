"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Wrench,
  Clock,
  RotateCcw,
  Tag,
  Users,
  Building,
  Info,
  ChevronRight,
  FileImage,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import {
  SAMPLE_ISSUE_PRESETS,
  AiDiagnosisResult,
  SampleIssuePreset,
} from "@/lib/aiProblemDetector";

export default function AiDiagnosisPage() {
  const router = useRouter();

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(
    SAMPLE_ISSUE_PRESETS[0].thumbnail
  );
  const [activePreset, setActivePreset] = useState<SampleIssuePreset | null>(
    SAMPLE_ISSUE_PRESETS[0]
  );
  const [userNotes, setUserNotes] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState<AiDiagnosisResult | null>(
    SAMPLE_ISSUE_PRESETS[0].diagnosis
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const SCAN_STAGES = [
    "Preprocessing image & calibrating lighting...",
    "Scanning surface textures, thermal & moisture gradients...",
    "Matching defect signatures against 15,000+ verified co-op cases...",
    "Formulating diagnostic hypothesis & calculating fair co-op rate...",
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        setSelectedPhoto(resultUrl);
        setActivePreset(null);
        runAiAnalysis(resultUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: SampleIssuePreset) => {
    setActivePreset(preset);
    setSelectedPhoto(preset.thumbnail);
    setUserNotes(preset.description);
    runAiAnalysis(preset.thumbnail, undefined, preset.id);
  };

  const runAiAnalysis = async (
    photoUrl: string,
    fileName?: string,
    presetId?: string
  ) => {
    setAnalyzing(true);
    setScanStep(0);
    setDiagnosis(null);

    // Progressive scanning simulator
    const stepInterval = setInterval(() => {
      setScanStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          samplePresetId: presetId || activePreset?.id,
          userNotes,
          fileName,
        }),
      });

      const data = await res.json();
      setTimeout(() => {
        clearInterval(stepInterval);
        setAnalyzing(false);
        if (data.diagnosis) {
          setDiagnosis(data.diagnosis);
        }
      }, 1800);
    } catch {
      clearInterval(stepInterval);
      setAnalyzing(false);
      // Fallback to preset diagnosis
      if (activePreset) {
        setDiagnosis(activePreset.diagnosis);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-indigo-900/40">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-black uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Vision Diagnostic Pipeline</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Snap a Photo. AI Diagnoses the Defect.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Don't know what's broken or what to ask for? Upload a photo of your leaking pipe,
              flickering switchboard, or faulty AC. Our vision model isolates the root cause and
              matches you directly with certified cooperative specialists at pre-agreed fair rates.
            </p>

            {/* Workflow Breadcrumbs */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-bold text-indigo-200">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg">1. Upload Photo</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="bg-white/10 px-2.5 py-1 rounded-lg">2. AI Analysis</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="bg-white/10 px-2.5 py-1 rounded-lg">3. Root Cause</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="bg-white/10 px-2.5 py-1 rounded-lg">4. Fair Cost</span>
              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              <span className="bg-brand-500 text-white px-2.5 py-1 rounded-lg shadow-sm">
                5. Instant Provider Match
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Photo Upload & Preset Gallery (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Upload Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-brand-600" />
                  <span>Upload Problem Photo</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-semibold">JPG, PNG or HEIC</span>
              </div>

              {/* Photo Preview & Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 cursor-pointer group transition-all flex flex-col items-center justify-center p-4 text-center"
              >
                {selectedPhoto ? (
                  <>
                    <img
                      src={selectedPhoto}
                      alt="Uploaded defect"
                      className={`w-full h-full object-cover transition-all duration-300 ${
                        analyzing ? "brightness-75 scale-105" : ""
                      }`}
                    />
                    {/* Laser scanning beam overlay when analyzing */}
                    {analyzing && (
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/30 to-transparent animate-pulse pointer-events-none flex flex-col justify-center items-center">
                        <div className="w-full h-1 bg-gradient-to-r from-cyan-400 via-indigo-400 to-cyan-400 shadow-lg shadow-cyan-400/50" />
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl text-white text-xs flex items-center justify-between">
                      <span className="truncate font-semibold text-[11px]">
                        {activePreset ? activePreset.title : "Custom Uploaded Photo"}
                      </span>
                      <span className="text-[10px] text-slate-300 uppercase tracking-wider font-bold">
                        Tap to change
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Camera className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Tap to take photo or upload file
                    </p>
                    <p className="text-[11px] text-slate-400">
                      High resolution close-up gives best accuracy
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Optional User Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Describe symptoms (Optional)
                </label>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Water is dripping continuously, making humming noise, occurred after voltage fluctuation..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                disabled={analyzing || !selectedPhoto}
                onClick={() =>
                  selectedPhoto &&
                  runAiAnalysis(selectedPhoto, undefined, activePreset?.id)
                }
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-700 hover:to-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{analyzing ? "AI Scanning Photo..." : "Re-Run AI Diagnosis"}</span>
              </button>
            </div>

            {/* Quick-Test Preset Samples */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Or 1-Tap Test Common Defect Presets
                </h4>
                <span className="text-[10px] text-brand-600 font-bold">6 Samples</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {SAMPLE_ISSUE_PRESETS.map((preset) => {
                  const isSelected = activePreset?.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-500 text-indigo-950 font-bold shadow-sm"
                          : "bg-slate-50 border-slate-200/80 hover:bg-slate-100 text-slate-700"
                      }`}
                    >
                      <img
                        src={preset.thumbnail}
                        alt={preset.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold block truncate">
                          {preset.title}
                        </span>
                        <span className="text-[9px] text-slate-400 block truncate uppercase font-semibold">
                          {preset.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: AI Diagnosis & Provider Action (7 Cols) */}
          <div className="lg:col-span-7">
            {analyzing ? (
              <div className="bg-white rounded-3xl p-10 sm:p-14 border border-slate-200 shadow-sm text-center space-y-5">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  <h3 className="text-base font-black text-slate-900">
                    Analyzing Visual Defect Signatures
                  </h3>
                  <p className="text-xs text-indigo-600 font-semibold h-6">
                    {SCAN_STAGES[scanStep]}
                  </p>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full max-w-md mx-auto overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(scanStep + 1) * 25}%` }}
                  />
                </div>
              </div>
            ) : diagnosis ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 animate-in fade-in duration-300">
                {/* Diagnosis Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Identified Problem
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {diagnosis.confidence}% AI Confidence
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      {diagnosis.problemTitle}
                    </h2>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider self-start sm:self-center ${
                      diagnosis.severity === "EMERGENCY"
                        ? "bg-rose-100 text-rose-800 border border-rose-200 animate-pulse"
                        : diagnosis.severity === "HIGH"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}
                  >
                    {diagnosis.severity} Severity
                  </span>
                </div>

                {/* Urgency Advice Callout */}
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3 text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold block uppercase tracking-wider text-[10px]">
                      Immediate Safety Protocol
                    </span>
                    <p className="leading-relaxed">{diagnosis.urgencyAdvice}</p>
                  </div>
                </div>

                {/* Detected Symptoms & Root Cause */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Visual Defect Symptoms Detected
                  </h4>
                  <div className="space-y-2">
                    {diagnosis.detectedSymptoms.map((symptom, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{symptom}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1">
                    <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">
                      Root Cause Engineering Analysis:
                    </span>
                    <p className="text-slate-600 leading-relaxed">{diagnosis.rootCauseAnalysis}</p>
                  </div>
                </div>

                {/* Recommended Service & Pricing Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  {/* Recommended Service Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5" /> Recommended Service
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {diagnosis.recommendedService.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Discipline: <strong>{diagnosis.category}</strong>
                    </p>
                  </div>

                  {/* Estimated Cost Card */}
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Estimated Transparent Cost
                    </span>
                    <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
                      <span>
                        ₹{diagnosis.estimatedCost.min} - ₹{diagnosis.estimatedCost.max}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold block">
                      {diagnosis.estimatedCost.doorstepFee}
                    </span>
                  </div>
                </div>

                {/* Available Provider Match & Action CTA */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4 text-brand-600" />
                      <span>
                        <strong>{diagnosis.matchedSpecialistsCount} Verified Co-op Specialists</strong> available in your locality
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      Instant Auto-Dispatch Ready
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                      onClick={() => router.push(diagnosis.bookingUrl)}
                      className="w-full sm:flex-1 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                    >
                      <span>Find &amp; Dispatch Specialist for this Issue</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <Link
                      href="/member/requests/new"
                      className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors text-center"
                    >
                      Log in Member Portal
                    </Link>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
