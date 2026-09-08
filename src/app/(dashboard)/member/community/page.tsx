"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users2,
  Heart,
  MessageSquare,
  AlertTriangle,
  ArrowRight,
  Filter,
  PlusCircle,
  MapPin,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import { CATEGORIES, LOCALITIES, REQUEST_STATUS } from "@/lib/constants";

export default function CommunityFeedPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedLocality, setSelectedLocality] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedLocality !== "ALL") params.append("locality", selectedLocality);
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);

      const res = await fetch(`/api/requests/community?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load community feed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedLocality, selectedCategory, selectedStatus]);

  const handleQuickCoSign = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch(`/api/requests/${id}/cosign`, { method: "POST" });
      if (res.ok) {
        fetchFeed();
      }
    } catch (err) {
      console.error("Failed to co-sign:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Community Requests Feed</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Locality Public Hub
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Collaborate on shared society problems (leaks, security, elevators, landscaping) and
            co-sign calls to mobilize cooperative action.
          </p>
        </div>

        <Link
          href="/member/requests/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Community Request</span>
        </Link>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mr-2">
          <Filter className="w-4 h-4" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedLocality}
          onChange={(e) => setSelectedLocality(e.target.value)}
          className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="ALL">All Communities</option>
          {LOCALITIES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="ALL">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="ALL">All Statuses</option>
          {Object.keys(REQUEST_STATUS).map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading community feed...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Users2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">No community requests found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are currently no active community requests matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((cReq) => (
            <Link
              key={cReq.id}
              href={`/member/requests/${cReq.id}`}
              className={`block bg-white p-5 rounded-2xl border transition-all hover:shadow-md group flex flex-col justify-between ${
                cReq.isEmergency
                  ? "border-red-200 bg-red-50/20 hover:border-red-300"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                      {cReq.category}
                    </span>
                    <StatusBadge status={cReq.status} size="sm" />
                    <UrgencyBadge isEmergency={cReq.isEmergency} size="sm" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(cReq.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-800 font-medium line-clamp-2">
                    {cReq.description}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {cReq.address} — <strong className="text-slate-700">{cReq.locality}</strong>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleQuickCoSign(cReq.id, e)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition-colors"
                    title="Co-sign this request"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-emerald-600" />
                    <span>+{cReq._count?.coSigns || 0} Co-Signed</span>
                  </button>

                  <span className="text-slate-500 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{cReq._count?.comments || 0} notes</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">
                    Handling: {cReq.assignedProvider?.name || "Pending Dispatch"}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
