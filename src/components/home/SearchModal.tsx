"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  History,
  Trash2,
  CheckCircle2,
  Star,
  BrainCircuit,
  CornerDownLeft,
} from "lucide-react";
import {
  POPULAR_SERVICES,
  CATEGORIES,
  NATURAL_LANGUAGE_INTENTS,
  ServiceItem,
} from "@/lib/homeData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: ServiceItem) => void;
}

const SMART_SUGGESTIONS = [
  "AC not cooling",
  "Bathroom cleaning",
  "Tap leaking",
  "Fan not working",
  "Sofa cleaning",
  "Laptop repair",
  "Haircut at home",
  "Deep cleaning",
  "Pest problem",
  "Washing machine repair",
];

export default function SearchModal({
  isOpen,
  onClose,
  onSelectService,
}: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("coop_recent_searches");
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        } else {
          setRecentSearches(["AC jet service", "Bathroom deep cleaning", "Ceiling fan install"]);
        }
      } catch (e) {
        console.error("Local storage error:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const updated = [trimmed, ...recentSearches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    try {
      localStorage.setItem("coop_recent_searches", JSON.stringify(updated));
    } catch {}
  };

  const removeRecentSearch = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter((s) => s !== item);
    setRecentSearches(updated);
    try {
      localStorage.setItem("coop_recent_searches", JSON.stringify(updated));
    } catch {}
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("coop_recent_searches");
    } catch {}
  };

  const handleSearchSubmit = (searchQuery: string) => {
    saveRecentSearch(searchQuery);
    onClose();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Natural Language Intent Detection
  const lowerQuery = query.toLowerCase();
  const matchedIntent = query.trim()
    ? NATURAL_LANGUAGE_INTENTS.find((intent) =>
        intent.patterns.some((pattern) => lowerQuery.includes(pattern))
      )
    : null;

  const filteredServices = POPULAR_SERVICES.filter(
    (s) =>
      s.name.toLowerCase().includes(lowerQuery) ||
      s.category.toLowerCase().includes(lowerQuery) ||
      s.description.toLowerCase().includes(lowerQuery)
  );

  const matchedCategories = CATEGORIES.filter(
    (c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.tagline.toLowerCase().includes(lowerQuery) ||
      c.aliases.some((a) => a.includes(lowerQuery))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-brand-50/50 via-white to-amber-50/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <BrainCircuit className="w-3 h-3 text-brand-600" />
              Smart Intent Discovery
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline">
                ESC to close
              </span>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-3">
            What can we help you with?
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) handleSearchSubmit(query);
            }}
            className="flex items-center gap-3 bg-white p-2 rounded-2xl border-2 border-brand-500 shadow-md"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 ml-1">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 'My AC is making weird noises', 'bathroom cleaning', 'tap leak'..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 shrink-0"
            >
              <span>Search</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Natural Language Intent Recommendation Banner */}
          {matchedIntent && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-brand-50 to-amber-50 border border-brand-200 space-y-2.5 animate-in fade-in duration-150">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>AI Intent Match for your symptom:</span>
              </div>
              <div className="space-y-2">
                {matchedIntent.suggestions.map((sug, i) => (
                  <div
                    key={i}
                    onClick={() => handleSearchSubmit(sug.name)}
                    className="p-2.5 rounded-xl bg-white/90 hover:bg-white border border-brand-100 shadow-sm cursor-pointer flex items-center justify-between gap-3 group transition-all"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                        {sug.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{sug.reason}</p>
                    </div>
                    <span className="text-[11px] font-bold text-brand-600 group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                      View Service <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                <span className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </span>
                <button
                  onClick={clearAllRecent}
                  className="text-[10px] text-slate-400 hover:text-red-600 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <div
                    key={item}
                    onClick={() => handleSearchSubmit(item)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-transparent text-xs font-medium text-slate-700 cursor-pointer transition-all flex items-center gap-2 group"
                  >
                    <Clock className="w-3 h-3 text-slate-400 group-hover:text-brand-600" />
                    <span>{item}</span>
                    <button
                      onClick={(e) => removeRecentSearch(item, e)}
                      className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Prompts Grid */}
          {!query && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                <span>Common Home Needs</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SMART_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSearchSubmit(sug)}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-brand-50 hover:border-brand-200 border border-slate-200/80 text-left text-xs font-semibold text-slate-700 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate group-hover:text-brand-700">{sug}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-brand-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Shortcuts */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Category Shortcuts
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/services/${cat.slug}`}
                  onClick={onClose}
                  className="p-2 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all flex items-center gap-2 group"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-7 h-7 rounded-lg object-cover shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-brand-600 truncate">
                      {cat.title}
                    </p>
                    <p className="text-[10px] text-slate-400">From ₹{cat.startingPrice}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Direct Matching Services */}
          {query && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Services Matching "{query}" ({filteredServices.length})
                </p>
                <button
                  onClick={() => handleSearchSubmit(query)}
                  className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  <span>See full marketplace results</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {filteredServices.length === 0 ? (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-800">Nothing direct came up for "{query}" 👀</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for AC repair, deep cleaning, electrician, or tap leaks.
                  </p>
                  <button
                    onClick={() => handleSearchSubmit(query)}
                    className="mt-3 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
                  >
                    Search Full Marketplace
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredServices.slice(0, 4).map((service) => (
                    <div
                      key={service.id}
                      className="p-3 rounded-2xl border border-slate-200 hover:border-brand-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                              {service.category}
                            </span>
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {service.rating}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                            {service.name}
                          </h4>
                          <p className="text-[10px] text-slate-500">{service.duration} • 30-Day Warranty</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-sm font-black text-slate-900 block">
                            ₹{service.price}
                          </span>
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{service.originalPrice}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            saveRecentSearch(service.name);
                            onSelectService(service);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Guaranteed verified professionals in your locality
          </span>
          <button
            onClick={() => handleSearchSubmit(query || "home services")}
            className="font-bold text-brand-600 hover:underline flex items-center gap-1"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
