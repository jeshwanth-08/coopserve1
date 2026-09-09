"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18nContext";
import { SupportedLanguage } from "@/lib/translations";

interface LanguageSwitcherProps {
  variant?: "navbar" | "mobile" | "compact";
}

export default function LanguageSwitcher({ variant = "navbar" }: LanguageSwitcherProps) {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === "mobile") {
    return (
      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Globe className="w-3.5 h-3.5 text-brand-600" />
          <span>Select Language / भाषा चुनें</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {supportedLanguages.map((opt) => {
            const isActive = opt.code === language;
            return (
              <button
                key={opt.code}
                onClick={() => handleSelect(opt.code)}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm font-black"
                    : "bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-100"
                }`}
              >
                <span>{opt.nativeName}</span>
                {isActive && <Check className="w-3.5 h-3.5 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const LANG_SHORT_CODES: Record<SupportedLanguage, string> = {
    en: "ENG",
    hi: "HIN",
    ta: "TAM",
    te: "TEL",
    kn: "KAN",
  };

  const currentShortCode = LANG_SHORT_CODES[language] || "ENG";

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-2.5 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-600 shadow-xs transition-all hover:border-slate-300 font-bold text-xs"
        title={`Change Language / भाषा बदलें (${currentOption.nativeName})`}
        aria-label="Change Language"
      >
        <Globe className="w-3.5 h-3.5 text-brand-600 shrink-0" />
        <span className="font-bold text-xs tracking-tight text-slate-700">{currentShortCode}</span>
        <ChevronDown className="w-3 h-3 text-slate-400 -ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Choose Language / भाषा
          </div>
          {supportedLanguages.map((opt) => {
            const isActive = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                onClick={() => handleSelect(opt.code)}
                className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700 font-bold"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{opt.flag}</span>
                  <div>
                    <div className="font-bold">{opt.nativeName}</div>
                    <div className="text-[10px] text-slate-400">{opt.name}</div>
                  </div>
                </div>
                {isActive && <Check className="w-4 h-4 text-brand-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
