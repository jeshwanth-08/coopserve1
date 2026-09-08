"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  Users,
  Lock,
  Calendar,
  MapPin,
  FileText,
  Sparkles,
  Send,
} from "lucide-react";
import { CATEGORIES, LOCALITIES } from "@/lib/constants";

export default function NewRequestPage() {
  const router = useRouter();

  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [visibility, setVisibility] = useState<"PERSONAL" | "COMMUNITY">("PERSONAL");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState<string>(LOCALITIES[0]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [preferredDateTime, setPreferredDateTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!description.trim() || !address.trim()) {
      setError("Please describe your issue and provide an address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          visibility,
          description: description.trim(),
          address: address.trim(),
          locality,
          isEmergency,
          preferredDateTime: preferredDateTime || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create request");
        setLoading(false);
        return;
      }

      router.push(`/member/requests/${data.request.id}`);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/member"
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Service Request</h1>
          <p className="text-xs text-slate-500">
            Dispatch a certified cooperative professional for personal or community needs
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Visibility Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Request Scope & Visibility
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVisibility("PERSONAL")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  visibility === "PERSONAL"
                    ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>Personal Request</span>
                  </div>
                  {visibility === "PERSONAL" && (
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Visible only to you and your assigned provider. Ideal for private home repairs,
                  wiring, plumbing, or cleaning.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVisibility("COMMUNITY")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  visibility === "COMMUNITY"
                    ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-sm"
                    : "border-slate-200 hover:bg-slate-50 text-slate-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>Community Request</span>
                  </div>
                  {visibility === "COMMUNITY" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Visible to neighbors in your locality. Others can co-sign, comment, and share
                  in the coordinated service call (e.g. leaking pipe, elevator).
                </p>
              </button>
            </div>
          </div>

          {/* Service Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Select Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                    category === cat
                      ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Emergency Toggle */}
          <div
            onClick={() => setIsEmergency(!isEmergency)}
            className={`cursor-pointer p-4 rounded-xl border transition-all flex items-center justify-between ${
              isEmergency
                ? "bg-red-50 border-red-300 ring-2 ring-red-400/20"
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isEmergency ? "bg-red-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  Mark as Emergency Request
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Check this for dangerous electrical sparks, active pipe bursts, sewer backups, or
                  urgent lockouts. Will trigger immediate priority dispatch.
                </p>
              </div>
            </div>
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isEmergency
                  ? "border-red-600 bg-red-600 text-white font-bold text-xs"
                  : "border-slate-300 bg-white"
              }`}
            >
              {isEmergency && "✓"}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Issue Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail. What is broken or needed? (e.g. Master bathroom faucet valve leaking behind drywall, water dripping into downstairs flat)."
              className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Location & Preferred Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Locality / Society
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Exact Address / Unit
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Apt 4B, Pinecrest Towers"
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                value={preferredDateTime}
                onChange={(e) => setPreferredDateTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <Link
              href="/member"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all ${
                isEmergency
                  ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
              } disabled:opacity-50`}
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "Submitting..." : isEmergency ? "Dispatch Emergency Request" : "Submit Service Request"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
