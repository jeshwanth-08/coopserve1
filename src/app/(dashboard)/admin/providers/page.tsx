"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Check,
  X,
  Star,
  Wrench,
  Power,
  FileText,
  MapPin,
  Phone,
} from "lucide-react";

export default function AdminProvidersManagementPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVerified, setFilterVerified] = useState("ALL");

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/providers");
      if (res.ok) {
        const data = await res.json();
        setProviders(data.providers || []);
      }
    } catch (err) {
      console.error("Failed to load providers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleToggleVerify = async (userId: string, currentVerified: boolean) => {
    try {
      const res = await fetch(`/api/providers/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentVerified }),
      });
      if (res.ok) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === userId
              ? {
                  ...p,
                  providerProfile: {
                    ...p.providerProfile,
                    isVerified: !currentVerified,
                  },
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to update verification:", err);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/providers/${userId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === userId
              ? {
                  ...p,
                  providerProfile: {
                    ...p.providerProfile,
                    isActive: !currentActive,
                  },
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to update active state:", err);
    }
  };

  const filtered = providers.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.locality.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVerified =
      filterVerified === "ALL" ||
      (filterVerified === "VERIFIED" && p.providerProfile?.isVerified) ||
      (filterVerified === "UNVERIFIED" && !p.providerProfile?.isVerified);

    return matchesSearch && matchesVerified;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Service Providers</h1>
          <p className="text-xs text-slate-500">
            Verify trade licenses, activate/deactivate accounts, and inspect quality metrics
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-800 rounded-full shrink-0">
          {providers.length} Total Registered Providers
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search provider name, trade, or locality..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <select
          value={filterVerified}
          onChange={(e) => setFilterVerified(e.target.value)}
          className="w-full sm:w-48 p-2 border border-slate-200 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="ALL">All Providers</option>
          <option value="VERIFIED">Verified Only</option>
          <option value="UNVERIFIED">Pending Verification</option>
        </select>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading service providers directory...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          No providers found matching filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((p) => {
            const profile = p.providerProfile;
            let categories: string[] = [];
            let skills: string[] = [];
            let certs: string[] = [];

            try {
              categories = JSON.parse(profile?.serviceCategories || "[]");
            } catch {}
            try {
              skills = JSON.parse(profile?.skills || "[]");
            } catch {}
            try {
              certs = JSON.parse(profile?.certifications || "[]");
            } catch {}

            return (
              <div
                key={p.id}
                className={`bg-white p-5 rounded-2xl border transition-all shadow-sm space-y-4 ${
                  !profile?.isActive
                    ? "border-slate-200 opacity-60 bg-slate-50"
                    : profile?.isVerified
                    ? "border-slate-200 hover:border-blue-300"
                    : "border-amber-300 bg-amber-50/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-base">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{p.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                          {profile?.avgRating || "0.0"}
                        </span>
                        <span className="text-slate-400">
                          ({profile?.totalReviews || 0} reviews • {p._count?.assignedRequests || 0} jobs)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pills */}
                  <div className="flex flex-col items-end gap-1">
                    {profile?.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        Unverified
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                        profile?.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {profile?.isActive ? "Active" : "Deactivated"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {categories.map((c) => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Area: <strong className="text-slate-700">{profile?.serviceArea || p.locality}</strong>
                  </p>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {p.phone || "+1 555-0210"} • {p.email}
                  </p>
                </div>

                {/* Certifications Preview */}
                {certs.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                    <span className="font-semibold text-slate-700 block mb-1">
                      Certificates & Licenses:
                    </span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {certs.map((c, i) => (
                        <li key={i} className="truncate">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Admin Management Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleVerify(p.id, profile?.isVerified)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      profile?.isVerified
                        ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    }`}
                  >
                    {profile?.isVerified ? "Revoke Verification" : "Approve & Verify"}
                  </button>

                  <button
                    onClick={() => handleToggleActive(p.id, profile?.isActive)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      profile?.isActive
                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {profile?.isActive ? "Deactivate" : "Reactivate"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
