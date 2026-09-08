"use client";

import React, { useState, useEffect } from "react";
import { Wrench, Star, ShieldCheck, X, Check, Search, Filter } from "lucide-react";

interface AssignProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string;
  category: string;
  locality: string;
  isEmergency: boolean;
  onAssigned: () => void;
}

export default function AssignProviderModal({
  isOpen,
  onClose,
  requestId,
  category,
  locality,
  isEmergency,
  onAssigned,
}: AssignProviderModalProps) {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [assignmentNote, setAssignmentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterLocality, setFilterLocality] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchMatchingProviders = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("category", category);

        const res = await fetch(`/api/providers?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProviders(data.providers || []);
          if (data.providers?.length > 0) {
            // Auto-select first matching verified provider
            const firstVerified = data.providers.find((p: any) => p.providerProfile?.isVerified);
            setSelectedProviderId(firstVerified ? firstVerified.id : data.providers[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load matching providers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchingProviders();
  }, [isOpen, category]);

  if (!isOpen) return null;

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProviderId) {
      alert("Please select a provider to assign.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/requests/${requestId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerId: selectedProviderId,
          note: assignmentNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to assign provider");
        return;
      }

      onAssigned();
      onClose();
    } catch {
      alert("Network error while assigning provider.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Dispatch Service Provider
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Matching for <strong className="text-blue-700">{category}</strong> in{" "}
              <strong className="text-slate-700">{locality}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleAssign} className="space-y-4 mt-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Eligible Specialist Candidates ({providers.length})
              </label>
              {isEmergency && (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  Emergency Priority Call
                </span>
              )}
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Loading matching specialists...
              </div>
            ) : providers.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No active providers found registered under "{category}".
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {providers.map((p) => {
                  const isSelected = selectedProviderId === p.id;
                  const profile = p.providerProfile;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProviderId(p.id)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{p.name}</span>
                          {profile?.isVerified && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span>Area: {profile?.serviceArea || p.locality}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            {profile?.avgRating || "0.0"} ({profile?.totalReviews || 0})
                          </span>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Dispatch Instructions / Coordinator Note (Optional)
            </label>
            <input
              type="text"
              value={assignmentNote}
              onChange={(e) => setAssignmentNote(e.target.value)}
              placeholder="e.g. Customer requested morning arrival; emergency parts dispatched."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedProviderId}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50"
            >
              {submitting ? "Assigning..." : "Confirm & Dispatch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
