"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  X,
  Send,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Key,
  CheckCircle2,
  Settings,
  HelpCircle,
  Camera,
  Upload,
  Image as ImageIcon,
  Wrench,
  Flame,
  Droplets,
  Zap,
  Check,
} from "lucide-react";
import {
  AiDiagnosisResult,
  SAMPLE_ISSUE_PRESETS,
  SampleIssuePreset,
} from "@/lib/aiProblemDetector";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  imageThumbnail?: string;
  visualDiagnosis?: AiDiagnosisResult;
  diagnosticPoints?: string[];
  recommendedService?: {
    id: string;
    name: string;
    price: number;
    duration?: string;
    url: string;
  };
  recommendedPro?: {
    name: string;
    role: string;
  };
  action?: {
    label: string;
    url: string;
  };
  safetyTip?: string;
  isEmergency?: boolean;
}

const SAMPLE_DEFECTS = SAMPLE_ISSUE_PRESETS.map((p) => ({
  id: p.id,
  title: p.title,
  badge: p.category,
  thumb: p.thumbnail,
  desc: p.description,
  diagnosis: p.diagnosis,
}));

export default function HomeBuddyWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPhotoDiagnosis, setShowPhotoDiagnosis] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [activeApiKey, setActiveApiKey] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("coopserve_gemini_key") || "";
    setActiveApiKey(saved);
    setApiKeyInput(saved);
  }, []);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-init-1",
      sender: "bot",
      text: "Hello! I am Home Buddy ⚡, your AI home maintenance concierge. Describe your issue or tap the 📸 Camera button to diagnose defects directly from a photo!",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping, showPhotoDiagnosis]);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKeyInput.trim();
    localStorage.setItem("coopserve_gemini_key", trimmed);
    setActiveApiKey(trimmed);
    setShowSettings(false);
  };

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputQuery;
    if (!textToSend.trim()) return;

    const lower = textToSend.toLowerCase();
    if (lower.includes("photo") || lower.includes("camera") || lower.includes("image") || lower.includes("diagnose photo")) {
      setShowPhotoDiagnosis(true);
    }

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          apiKey: activeApiKey || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const botMsg: Message = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: data.text || "Here is what I found for your issue:",
          diagnosticPoints: data.diagnosticPoints,
          recommendedService: data.recommendedService,
          recommendedPro: data.recommendedPro,
          action: data.action,
          safetyTip: data.safetyTip,
          isEmergency: data.isEmergency,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        fallbackDiagnostic(textToSend);
      }
    } catch {
      fallbackDiagnostic(textToSend);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRunPhotoDiagnosis = async (options: {
    sampleId?: string;
    imageBase64?: string;
    title: string;
    thumb?: string;
    presetDiagnosis?: AiDiagnosisResult;
  }) => {
    setShowPhotoDiagnosis(false);
    setIsDiagnosing(true);

    // Add user message
    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: `📸 Requested AI Photo Diagnosis for: ${options.title}`,
      imageThumbnail: options.thumb,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          samplePresetId: options.sampleId,
          imageBase64: options.imageBase64,
          userNotes: options.title,
          fileName: options.title,
          apiKey: activeApiKey || undefined,
        }),
      });

      const data = await res.json();
      const diag: AiDiagnosisResult | undefined =
        data.success && data.diagnosis ? data.diagnosis : options.presetDiagnosis;

      if (diag) {
        const botMsg: Message = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: `🔍 AI Visual Analysis Complete: **${diag.problemTitle}**`,
          imageThumbnail: options.thumb,
          visualDiagnosis: diag,
          safetyTip: diag.actionableTip || diag.urgencyAdvice,
          action: {
            label: `Book ${diag.recommendedService.name} (from ₹${diag.recommendedService.startingPrice})`,
            url: diag.bookingUrl || `/book/${diag.recommendedService.id}`,
          },
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: "b-" + Date.now(),
            sender: "bot",
            text: data.message || "I could not identify a domestic maintenance defect in this photo. Please ensure good lighting or pick a sample.",
          },
        ]);
      }
    } catch (err) {
      if (options.presetDiagnosis) {
        const diag = options.presetDiagnosis;
        const botMsg: Message = {
          id: "b-" + Date.now(),
          sender: "bot",
          text: `🔍 AI Visual Analysis Complete: **${diag.problemTitle}**`,
          imageThumbnail: options.thumb,
          visualDiagnosis: diag,
          safetyTip: diag.actionableTip || diag.urgencyAdvice,
          action: {
            label: `Book ${diag.recommendedService.name} (from ₹${diag.recommendedService.startingPrice})`,
            url: diag.bookingUrl || `/book/${diag.recommendedService.id}`,
          },
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: "b-" + Date.now(),
            sender: "bot",
            text: "Connection to AI Vision Service timed out. Please try again or test an instant sample issue.",
          },
        ]);
      }
    } finally {
      setIsTyping(false);
      setIsDiagnosing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const b64 = uploadEvent.target?.result as string;
      handleRunPhotoDiagnosis({
        imageBase64: b64,
        title: file.name,
        thumb: b64,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const fallbackDiagnostic = (text: string) => {
    const q = text.toLowerCase();
    if (q.includes("washing") || q.includes("washer") || q.includes("laundry") || q.includes("dryer")) {
      setMessages((prev) => [
        ...prev,
        {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "Diagnosed issue: Washing Machine Malfunction. Issues like failure to spin or drain typically stem from a worn drive belt, motor capacitor, or clogged drain filter.",
          recommendedService: {
            id: "svc-6",
            name: "Appliance Repair (Washing Machine)",
            price: 349,
            url: "/book/svc-6",
          },
          action: {
            label: "Book Appliance Specialist (₹349)",
            url: "/book/svc-6",
          },
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: "b-" + Date.now(),
          sender: "bot",
          text: "I am ready to help! You can describe the issue in words, or click the 📸 camera button below to run a visual diagnosis.",
          action: {
            label: "Browse All Services",
            url: "/services",
          },
        },
      ]);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    if (prompt.includes("Photo") || prompt.includes("Diagnose")) {
      setShowPhotoDiagnosis(true);
      return;
    }
    handleSend(undefined, prompt);
  };

  return (
    <>
      {/* Hidden File Input for Camera / Photo Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Floating Entry Trigger Button */}
      <div className="fixed bottom-20 md:bottom-6 right-5 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xl shadow-slate-900/30 border border-slate-700 transition-all hover:scale-105 active:scale-95 group"
            aria-label="Ask Home Buddy AI"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-[11px] font-black text-white flex items-center gap-1">
                Home Buddy <Camera className="w-3 h-3 text-cyan-300" />
              </span>
              <span className="block text-[9px] text-slate-300 font-medium">
                Chat & AI Photo Diagnosis
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating AI Drawer / Widget Modal */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[590px] max-h-[88vh] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Home Buddy AI</span>
                  <span className="text-[9px] bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 px-1.5 py-0.2 rounded-full uppercase font-bold">
                    Vision + Chat
                  </span>
                </h4>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>20 Cooperative Trades • Photo Diagnose Ready</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowPhotoDiagnosis(!showPhotoDiagnosis)}
                className={`p-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                  showPhotoDiagnosis ? "bg-cyan-500 text-white" : "bg-white/10 hover:bg-white/20 text-cyan-300"
                }`}
                title="AI Photo Diagnosis"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline text-[10px]">Diagnose</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="AI Settings"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Home Buddy"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Settings Drawer Overlay */}
          {showSettings && (
            <div className="bg-slate-800 text-white p-4 border-b border-slate-700 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-brand-300 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Google Gemini API Key
                </span>
                <span className="text-[10px] text-slate-400">Optional for custom quota</span>
              </div>
              <form onSubmit={handleSaveApiKey} className="space-y-2">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste Gemini API Key (AIzaSy...)"
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-brand-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-sm"
                  >
                    Save Key
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Photo Diagnosis Inline Panel */}
          {showPhotoDiagnosis && (
            <div className="bg-gradient-to-b from-cyan-950 via-slate-900 to-slate-900 text-white p-4 border-b border-cyan-800/50 space-y-3 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Camera className="w-3.5 h-3.5" />
                  </div>
                  <h5 className="text-xs font-bold text-white">Visual Defect Diagnosis</h5>
                </div>
                <button
                  onClick={() => setShowPhotoDiagnosis(false)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Upload button */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-center flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all group"
                >
                  <Upload className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
                  <span>Upload / Snap Photo</span>
                  <span className="text-[9px] text-slate-400 font-normal">JPG, PNG, Camera</span>
                </button>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-center text-[10px] text-slate-300 space-y-1">
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Auto-Categorized
                  </span>
                  <p className="text-slate-400 text-[9px] leading-tight">
                    Vision AI detects defect urgency, cost range, and matches certified cooperative pros.
                  </p>
                </div>
              </div>

              {/* Or Select Sample Issue */}
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Or Test with Sample Issue:
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {SAMPLE_DEFECTS.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() =>
                        handleRunPhotoDiagnosis({
                          sampleId: sample.id,
                          title: sample.title,
                          thumb: sample.thumb,
                          presetDiagnosis: sample.diagnosis,
                        })
                      }
                      className="text-left p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 transition-colors group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sample.thumb}
                        alt={sample.title}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-white truncate group-hover:text-cyan-300">
                          {sample.title}
                        </p>
                        <p className="text-[9px] text-cyan-300/80">{sample.badge}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs space-y-2 shadow-sm ${
                    m.sender === "user"
                      ? "bg-brand-600 text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none"
                  }`}
                >
                  {/* Photo thumbnail if uploaded */}
                  {m.imageThumbnail && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm max-w-[200px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.imageThumbnail}
                        alt="Defect Preview"
                        className="w-full h-28 object-cover"
                      />
                    </div>
                  )}

                  <p className="leading-relaxed whitespace-pre-line">{m.text}</p>

                  {/* AI Visual Diagnosis Card if available */}
                  {m.visualDiagnosis && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-slate-700">
                      <div className="flex items-center justify-between text-[11px] font-bold border-b border-slate-200/80 pb-2">
                        <span className="text-slate-900">{m.visualDiagnosis.category}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                            m.visualDiagnosis.severity === "EMERGENCY" || m.visualDiagnosis.severity === "HIGH"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {m.visualDiagnosis.severity} SEVERITY
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">AI Confidence:</span>
                          <span className="font-bold text-cyan-700">{m.visualDiagnosis.confidence}% Match</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Estimated Upfront Cost:</span>
                          <span className="font-black text-slate-900">
                            ₹{m.visualDiagnosis.estimatedCost.min} - ₹{m.visualDiagnosis.estimatedCost.max}
                          </span>
                        </div>
                      </div>

                      {m.visualDiagnosis.actionableTip && (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-900 space-y-0.5">
                          <span className="font-bold flex items-center gap-1 text-amber-700">
                            <AlertTriangle className="w-3 h-3" /> Urgent First-Aid Tip:
                          </span>
                          <p>{m.visualDiagnosis.actionableTip}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Diagnostic Points */}
                  {m.diagnosticPoints && m.diagnosticPoints.length > 0 && (
                    <ul className="space-y-1 text-[11px] list-disc pl-4 text-slate-600">
                      {m.diagnosticPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  )}

                  {/* Safety Tip */}
                  {m.safetyTip && !m.visualDiagnosis && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex gap-2 items-start">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Safety Note:</span> {m.safetyTip}
                      </div>
                    </div>
                  )}

                  {/* Recommended Service Action Button */}
                  {m.action && (
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(m.action!.url);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/25 transition-transform active:scale-95"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{m.action.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {m.sender === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    U
                  </div>
                )}
              </div>
            ))}

            {(isTyping || isDiagnosing) && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 w-fit animate-in fade-in">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-200" />
                <span className="ml-1 text-[11px] font-medium">
                  {isDiagnosing ? "Vision AI analyzing defect symptoms..." : "Home Buddy is analyzing..."}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 text-[11px] no-scrollbar shrink-0">
            <button
              onClick={() => setShowPhotoDiagnosis(true)}
              className="px-2.5 py-1 rounded-full bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-[10px] font-bold flex items-center gap-1 shrink-0"
            >
              <Camera className="w-3 h-3 text-cyan-600" />
              <span>📸 Diagnose from Photo</span>
            </button>
            {[
              "Water leaking under sink",
              "Main power MCB trips",
              "AC not cooling / freezing",
              "How to book a verified pro?",
              "What is HOME+ membership?",
            ].map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(qp)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 whitespace-nowrap transition-colors border border-slate-200 text-[10px] font-semibold shrink-0"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Message Input Footer */}
          <form onSubmit={(e) => handleSend(e)} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowPhotoDiagnosis(!showPhotoDiagnosis)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-cyan-50 text-slate-600 hover:text-cyan-700 transition-colors border border-slate-200 shrink-0"
              title="Upload photo for AI Diagnosis"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Describe issue or click 📸 to diagnose..."
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white transition-colors flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
