"use client";

import React, { useState, useEffect } from "react";
import {
  Building,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  X,
  Clock,
  Leaf,
} from "lucide-react";
import { SocietyPoolItem } from "@/lib/societyPoolService";

interface SocietyGroupPoolSectionProps {
  category: string;
  locality?: string;
  addressLine?: string;
  selectedPool: SocietyPoolItem | null;
  onSelectPool: (pool: SocietyPoolItem | null) => void;
  className?: string;
}

const POPULAR_SOCIETIES = [
  "Prestige Ozone",
  "Sunshine Heights",
  "Greenwood Heights",
  "Sobha City",
  "Palm Meadows",
];

export default function SocietyGroupPoolSection({
  category,
  locality = "Indiranagar",
  addressLine = "",
  selectedPool,
  onSelectPool,
  className = "",
}: SocietyGroupPoolSectionProps) {
  const [societyInput, setSocietyInput] = useState("");
  const [groupCodeInput, setGroupCodeInput] = useState("");
  const [availablePools, setAvailablePools] = useState<SocietyPoolItem[]>([]);
  const [loadingPools, setLoadingPools] = useState(false);
  const [checkingCode, setCheckingCode] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState("");

  // Attempt to auto-extract society from addressLine if not set
  useEffect(() => {
    if (!societyInput && addressLine) {
      for (const soc of POPULAR_SOCIETIES) {
        if (addressLine.toLowerCase().includes(soc.toLowerCase())) {
          setSocietyInput(soc);
          break;
        }
      }
    }
  }, [addressLine, societyInput]);

  // Fetch available pools when society or category changes
  useEffect(() => {
    let isMounted = true;
    const fetchPools = async () => {
      setLoadingPools(true);
      try {
        const query = new URLSearchParams();
        if (societyInput.trim()) query.set("society", societyInput.trim());
        if (category.trim()) query.set("category", category.trim());
        if (locality.trim()) query.set("locality", locality.trim());

        const res = await fetch(`/api/society-pools?${query.toString()}`);
        if (res.ok && isMounted) {
          const data = await res.json();
          setAvailablePools(data.pools || []);
        }
      } catch (e) {
        console.warn("Could not fetch society pools:", e);
      } finally {
        if (isMounted) setLoadingPools(false);
      }
    };

    fetchPools();
    return () => {
      isMounted = false;
    };
  }, [societyInput, category, locality]);

  // Handle manual group code verification
  const handleVerifyGroupCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = groupCodeInput.trim().toUpperCase();
    if (!cleanCode) return;

    setCheckingCode(true);
    setCodeError("");
    setCodeSuccess("");

    try {
      const query = new URLSearchParams({
        code: cleanCode,
        society: societyInput.trim(),
        category: category.trim(),
      });

      const res = await fetch(`/api/society-pools?${query.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        setCodeError(data.error || "Invalid or inactive group pool code.");
        return;
      }

      if (data.validation && !data.validation.eligible) {
        setCodeError(data.validation.reason || "Incompatible pool.");
        return;
      }

      // Valid pool joined
      onSelectPool(data.pool);
      setCodeSuccess(`Successfully joined ${data.pool.code} for ${data.pool.societyName}!`);
      setGroupCodeInput("");
    } catch {
      setCodeError("Network error checking group code. Please try again.");
    } finally {
      setCheckingCode(false);
    }
  };

  return (
    <div
      className={`bg-gradient-to-br from-slate-50 to-blue-50/40 rounded-3xl p-5 sm:p-6 border border-blue-100 shadow-sm space-y-4 ${className}`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Join a Society Service Pool
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 tracking-wide">
                OPTIONAL
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Coordinate same-day visits with neighbors in your society to eliminate doorstep fees.
            </p>
          </div>
        </div>

        {selectedPool && (
          <button
            type="button"
            onClick={() => onSelectPool(null)}
            className="text-xs font-semibold text-red-600 hover:text-red-700 hover:underline self-start sm:self-auto flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Leave Pool / Book Individually</span>
          </button>
        )}
      </div>

      {/* ACTIVE JOINED STATE */}
      {selectedPool ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                    {selectedPool.societyName}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-xs">
                    {selectedPool.code}
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-800 mt-1">
                  {selectedPool.memberCount} residents already in this pool • {selectedPool.serviceWindow}
                </p>
                <p className="text-[11px] text-emerald-700/90 mt-0.5">
                  Your booking will be grouped with your neighbors. Service provider arrives in the coordinated window.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPool(null)}
              className="p-1 text-emerald-700 hover:text-red-600 hover:bg-emerald-100 rounded-lg transition-colors shrink-0"
              title="Leave pool"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Group Pool Benefits */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-200/60 text-[11px]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Zero Doorstep Fee
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 font-bold">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              Coordinated Arrival
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100/80 text-emerald-800 font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              Eco Neighborhood Visit
            </span>
          </div>
        </div>
      ) : (
        /* UNJOINED SELECTION FORM */
        <div className="space-y-4">
          {/* Society Selector & Code Finder Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Society Name Input */}
            <div className="sm:col-span-7 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                1. Your Society / Apartment:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={societyInput}
                  onChange={(e) => setSocietyInput(e.target.value)}
                  placeholder="e.g. Prestige Ozone, Sunshine Heights"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none pr-8"
                />
                {societyInput && (
                  <button
                    type="button"
                    onClick={() => setSocietyInput("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Group Code Direct Input */}
            <div className="sm:col-span-5 space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                2. Have a Group Code? (Optional):
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={groupCodeInput}
                  onChange={(e) => {
                    setGroupCodeInput(e.target.value.toUpperCase());
                    if (codeError) setCodeError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleVerifyGroupCode();
                    }
                  }}
                  placeholder="e.g. AC-SAT-15"
                  className="flex-1 px-3 py-2.5 text-xs font-mono uppercase font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  disabled={!groupCodeInput.trim() || checkingCode}
                  onClick={() => handleVerifyGroupCode()}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs disabled:opacity-50 shrink-0"
                >
                  {checkingCode ? "..." : "Join"}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Society Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-bold text-[11px] mr-1">Popular:</span>
            {POPULAR_SOCIETIES.map((soc) => (
              <button
                key={soc}
                type="button"
                onClick={() => setSocietyInput(soc)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                  societyInput.toLowerCase() === soc.toLowerCase()
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
              >
                {soc}
              </button>
            ))}
          </div>

          {/* Code Error or Success Alert */}
          {codeError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{codeError}</span>
            </div>
          )}
          {codeSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{codeSuccess}</span>
            </div>
          )}

          {/* AVAILABLE POOLS FOR MATCHING LOCATION & SERVICE */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700">
                {societyInput ? `Service Pools for ${societyInput}` : "Active Neighborhood Service Pools:"}
              </span>
              <span className="text-[11px] text-slate-400">
                {availablePools.length} pool{availablePools.length === 1 ? "" : "s"} found
              </span>
            </div>

            {loadingPools ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                Looking up active society pools...
              </div>
            ) : availablePools.length === 0 ? (
              <div className="p-4 text-center bg-white rounded-2xl border border-slate-200 space-y-1">
                <p className="text-xs text-slate-600 font-medium">
                  No active group pool found for <strong>{societyInput || "your society"}</strong> in <strong>{category}</strong>.
                </p>
                <p className="text-[11px] text-slate-400">
                  You can proceed with a normal individual booking, or enter a specific Group Code above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availablePools.map((pool) => (
                  <div
                    key={pool.id}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            {pool.societyName}
                          </span>
                          <span className="text-[11px] font-semibold text-blue-600 block mt-0.5">
                            {pool.category}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold shrink-0">
                          {pool.code}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-2">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{pool.memberCount} residents joined</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{pool.serviceWindow}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-medium truncate">
                        Zero doorstep fee
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectPool(pool)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1 shrink-0"
                      >
                        <span>Join Pool</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
