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
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
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

export default function HomeBuddyWidget() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [activeApiKey, setActiveApiKey] = useState("");
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
      text: "Hello! I am Home Buddy ⚡, your AI home maintenance concierge. Tell me what's happening (e.g., 'poor working washing machine', 'AC not cooling', or 'water leaking under sink') and I will diagnose the issue and match you with the right cooperative specialist.",
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

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

  // Local fallback if network fetch fails
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
          text: "I am ready to help! Please tell me which home issue you need solved.",
          action: {
            label: "Browse All Services",
            url: "/services",
          },
        },
      ]);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(undefined, prompt);
  };

  return (
    <>
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
              <span className="block text-[11px] font-black text-white">Home Buddy</span>
              <span className="block text-[9px] text-slate-300 font-medium">
                {activeApiKey ? "Gemini AI Active" : "Smart AI Diagnostic"}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating AI Drawer / Widget Modal */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[560px] max-h-[85vh] animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Home Buddy</span>
                  <span className="text-[9px] bg-brand-500/30 text-brand-300 border border-brand-400/40 px-1.5 py-0.2 rounded-full uppercase font-bold">
                    {activeApiKey ? "Gemini AI" : "Smart Diagnostic"}
                  </span>
                </h4>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>20 Cooperative Trades • Online</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                title="AI Settings & API Key"
                className={`p-1.5 rounded-xl transition-colors ${
                  showSettings ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Optional API Key / Settings Dropdown */}
          {showSettings && (
            <div className="p-3.5 bg-slate-800 text-white text-xs border-b border-slate-700 animate-in fade-in space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-brand-400" />
                  <span>Google Gemini API Key (Optional)</span>
                </span>
                {activeApiKey ? (
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Active
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 bg-slate-700 px-2 py-0.5 rounded">
                    Built-in Engine
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 leading-tight">
                The built-in smart diagnostic engine handles all 20 services with zero dependencies. Optionally paste a Gemini API key for free-form reasoning:
              </p>
              <form onSubmit={handleSaveApiKey} className="flex gap-1.5 pt-1">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold"
                >
                  Save
                </button>
                {activeApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("coopserve_gemini_key");
                      setActiveApiKey("");
                      setApiKeyInput("");
                    }}
                    className="px-2 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs"
                  >
                    Clear
                  </button>
                )}
              </form>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[86%] p-3.5 rounded-2xl text-xs space-y-2.5 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "bg-brand-600 text-white rounded-tr-none font-medium"
                      : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none font-normal"
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-line space-y-1">{m.text}</div>

                  {/* Diagnostic Points Checklist */}
                  {m.diagnosticPoints && m.diagnosticPoints.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 text-[11px] text-slate-700">
                      <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">
                        Diagnostic Assessment:
                      </span>
                      {m.diagnosticPoints.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-brand-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Safety Tip Alert */}
                  {m.safetyTip && (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-[11px]">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[10px] uppercase font-bold text-amber-800">
                          Safety Advice:
                        </strong>
                        <span>{m.safetyTip}</span>
                      </div>
                    </div>
                  )}

                  {/* Recommended Service & Pro Card */}
                  {m.recommendedService && (
                    <div className="p-3 rounded-xl bg-brand-50/60 border border-brand-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-brand-700 uppercase">
                          Recommended Match
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          {m.recommendedService.name}
                        </h5>
                        {m.recommendedPro && (
                          <p className="text-[10px] text-slate-500">
                            Pro: {m.recommendedPro.name} • {m.recommendedPro.role}
                          </p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 text-sm block">
                          ₹{m.recommendedService.price}
                        </span>
                        {m.recommendedService.duration && (
                          <span className="text-[10px] text-slate-500">
                            {m.recommendedService.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action CTA Button */}
                  {m.action && (
                    <div className="pt-0.5">
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          router.push(m.action!.url);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/25 transition-transform active:scale-95"
                      >
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

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200 w-fit animate-in fade-in">
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce delay-200" />
                <span className="ml-1 text-[11px] font-medium">Analyzing symptoms...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 text-[11px] no-scrollbar">
            {[
              "Poor working washing machine",
              "How to save on electricity bill",
              "Water leaking under sink",
              "How to book a service?",
              "How to remove hard water stains",
              "Main power MCB keeps tripping",
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
          <form onSubmit={(e) => handleSend(e)} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Describe what is happening at home..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
