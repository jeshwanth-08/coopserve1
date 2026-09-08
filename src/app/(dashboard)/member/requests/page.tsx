"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, Filter, AlertTriangle, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import { CATEGORIES, REQUEST_STATUS } from "@/lib/constants";

export default function MemberRequestsListPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (visibilityFilter !== "ALL") params.append("visibility", visibilityFilter);

      const res = await fetch(`/api/requests?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, categoryFilter, visibilityFilter]);

  const filtered = requests.filter((r) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.description.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      r.address.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Service Requests</h1>
          <p className="text-xs text-slate-500">
            Track and manage your household tasks, repairs, and community calls
          </p>
        </div>
        <Link
          href="/member/requests/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by description, address, or category..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-44 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">All Statuses</option>
            {Object.keys(REQUEST_STATUS).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-44 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Visibility Filter */}
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="w-full md:w-36 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">All Visibility</option>
            <option value="PERSONAL">Personal</option>
            <option value="COMMUNITY">Community</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No requests match filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or status filter, or create a new service request.
          </p>
          <Link
            href="/member/requests/new"
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4" /> Create Request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <Link
              key={req.id}
              href={`/member/requests/${req.id}`}
              className={`block bg-white p-5 rounded-2xl border transition-all hover:shadow-md group ${
                req.isEmergency
                  ? "border-red-200 hover:border-red-300 bg-red-50/20"
                  : "border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                      {req.category}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                    <UrgencyBadge isEmergency={req.isEmergency} size="sm" />
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {req.visibility}
                    </span>
                    {req.rating && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ★ {req.rating.stars}.0 Rated
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {req.description}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Location: <span className="text-slate-600">{req.address}</span> ({req.locality})
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-xs text-slate-400 font-medium block">
                    {new Date(req.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-1 mt-2">
                    Details & Timeline <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Provider & Action footer */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div>
                  Provider Assigned:{" "}
                  <strong className="text-slate-800">
                    {req.assignedProvider ? req.assignedProvider.name : "Cooperative Coordinator Dispatching..."}
                  </strong>
                </div>
                {req.visibility === "COMMUNITY" && (
                  <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    +{req._count?.coSigns || 0} neighbor co-signs
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
