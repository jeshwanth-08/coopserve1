"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  UserPlus,
  AlertTriangle,
  ArrowRight,
  Shield,
  Clock,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import AssignProviderModal from "@/components/AssignProviderModal";
import { CATEGORIES, LOCALITIES, REQUEST_STATUS } from "@/lib/constants";

export default function AdminAllRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [urgencyFilter, setUrgencyFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Assignment Modal
  const [assignModalData, setAssignModalData] = useState<{
    isOpen: boolean;
    requestId: string;
    category: string;
    locality: string;
    isEmergency: boolean;
  }>({
    isOpen: false,
    requestId: "",
    category: "",
    locality: "",
    isEmergency: false,
  });

  // Admin Override Modal
  const [overrideData, setOverrideData] = useState<{
    isOpen: boolean;
    requestId: string;
    currentStatus: string;
    newStatus: string;
    note: string;
  }>({
    isOpen: false,
    requestId: "",
    currentStatus: "",
    newStatus: "RESOLVED",
    note: "",
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (categoryFilter !== "ALL") params.append("category", categoryFilter);
      if (visibilityFilter !== "ALL") params.append("visibility", visibilityFilter);
      if (urgencyFilter === "emergency") params.append("urgency", "emergency");
      else if (urgencyFilter === "normal") params.append("urgency", "normal");

      const res = await fetch(`/api/requests?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load all requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, categoryFilter, visibilityFilter, urgencyFilter]);

  const handleOpenAssignModal = (req: any) => {
    setAssignModalData({
      isOpen: true,
      requestId: req.id,
      category: req.category,
      locality: req.locality,
      isEmergency: req.isEmergency,
    });
  };

  const handleAdminOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideData.note.trim()) {
      alert("Please provide an audit rationale/note for the administrative status override.");
      return;
    }

    try {
      const res = await fetch(`/api/requests/${overrideData.requestId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextStatus: overrideData.newStatus,
          note: `[ADMIN OVERRIDE]: ${overrideData.note.trim()}`,
          adminOverride: true,
        }),
      });

      if (res.ok) {
        setOverrideData({ ...overrideData, isOpen: false, note: "" });
        fetchRequests();
      } else {
        const data = await res.json();
        alert(data.error || "Override failed");
      }
    } catch {
      alert("Network error during override.");
    }
  };

  const filtered = requests.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.locality.toLowerCase().includes(q) ||
      r.member?.name.toLowerCase().includes(q) ||
      r.assignedProvider?.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">All Service Requests & Dispatch</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              Master Dispatch Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch providers to pending jobs, monitor emergency escalations, and manage resolution states
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Table</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer, provider, description, category, or locality..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-40 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="ALL">All Statuses</option>
            {Object.keys(REQUEST_STATUS).map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-40 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="w-full md:w-36 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="ALL">All Urgencies</option>
            <option value="emergency">Emergency Only</option>
            <option value="normal">Normal Only</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="w-full md:w-36 p-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="ALL">All Visibility</option>
            <option value="PERSONAL">Personal</option>
            <option value="COMMUNITY">Community</option>
          </select>
        </div>
      </div>

      {/* Master Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-500">Loading master request table...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No service requests found matching the current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Urgency & Id</th>
                  <th className="py-3 px-4">Category & Scope</th>
                  <th className="py-3 px-4">Description & Location</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Provider</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((req) => (
                  <tr
                    key={req.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      req.isEmergency ? "bg-red-50/20" : ""
                    }`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <UrgencyBadge isEmergency={req.isEmergency} size="sm" />
                        <span className="font-mono text-[11px] text-slate-400 block">
                          #{req.id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 block">{req.category}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-500">
                          {req.visibility}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-800 font-medium truncate" title={req.description}>
                        {req.description}
                      </p>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {req.address} ({req.locality})
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-900 block">{req.member.name}</span>
                      <span className="text-[11px] text-slate-400">{req.member.phone || "No phone"}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={req.status} size="sm" />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {req.assignedProvider ? (
                        <div>
                          <span className="font-semibold text-slate-900 block">
                            {req.assignedProvider.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ★ {req.assignedProvider.providerProfile?.avgRating || "4.8"} avg
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 font-medium text-xs">
                          Unassigned
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      {/* Assign / Reassign Button */}
                      {["PENDING", "ASSIGNED", "DECLINED"].includes(req.status) && (
                        <button
                          onClick={() => handleOpenAssignModal(req)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{req.assignedProvider ? "Reassign" : "Assign"}</span>
                        </button>
                      )}

                      {/* Override Status Button */}
                      <button
                        onClick={() =>
                          setOverrideData({
                            isOpen: true,
                            requestId: req.id,
                            currentStatus: req.status,
                            newStatus: "RESOLVED",
                            note: "",
                          })
                        }
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50 border border-slate-200"
                        title="Coordinator Status Override"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Override</span>
                      </button>

                      {/* Detail Link */}
                      <Link
                        href={`/member/requests/${req.id}`}
                        className="inline-flex items-center gap-0.5 text-xs text-blue-600 hover:underline font-semibold"
                      >
                        Timeline →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Provider Modal */}
      <AssignProviderModal
        isOpen={assignModalData.isOpen}
        onClose={() => setAssignModalData({ ...assignModalData, isOpen: false })}
        requestId={assignModalData.requestId}
        category={assignModalData.category}
        locality={assignModalData.locality}
        isEmergency={assignModalData.isEmergency}
        onAssigned={fetchRequests}
      />

      {/* Status Override Modal */}
      {overrideData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Coordinator Status Override
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Override status for dispute resolution or manual cooperative exception.
              </p>
            </div>

            <form onSubmit={handleAdminOverride} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Target Status
                </label>
                <select
                  value={overrideData.newStatus}
                  onChange={(e) =>
                    setOverrideData({ ...overrideData, newStatus: e.target.value })
                  }
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {Object.keys(REQUEST_STATUS).map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Mandatory Audit Note / Rationale
                </label>
                <textarea
                  rows={3}
                  required
                  value={overrideData.note}
                  onChange={(e) => setOverrideData({ ...overrideData, note: e.target.value })}
                  placeholder="Explain why coordinator override was performed (e.g. customer confirmed verbal resolution with on-site technician)."
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOverrideData({ ...overrideData, isOpen: false })}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm"
                >
                  Apply Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
