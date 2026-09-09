"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Clock,
  Car,
  Hammer,
  FileCheck,
  Star,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Search,
  Filter,
  Phone,
  User,
  ShieldCheck,
  RotateCcw,
  Building,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import { broadcastStatusUpdate, subscribeToStatusUpdates } from "@/lib/realtimeSync";
import { REQUEST_STATUS } from "@/lib/constants";

export default function ProviderAssignedRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Resolve Modal State
  const [resolveModalRequest, setResolveModalRequest] = useState<any | null>(null);
  const [completionNotes, setCompletionNotes] = useState("");

  // Decline Modal State
  const [declineModalRequest, setDeclineModalRequest] = useState<any | null>(null);
  const [declineReason, setDeclineReason] = useState("");

  const fetchAssignedRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to load assigned requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedRequests();

    // 1. Instant cross-tab real-time update listener
    const unsubscribe = subscribeToStatusUpdates(() => {
      fetchAssignedRequests();
    });

    // 2. Multi-device auto-polling interval
    const pollInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchAssignedRequests();
      }
    }, 3500);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, []);

  const handleRespond = async (requestId: string, action: "ACCEPT" | "DECLINE", reason?: string) => {
    try {
      setActionLoadingId(requestId);
      const res = await fetch(`/api/requests/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to ${action.toLowerCase()} request`);
        return;
      }

      // Broadcast update across tabs
      broadcastStatusUpdate({
        requestId,
        status: action === "ACCEPT" ? "ACCEPTED" : "PENDING",
        timestamp: new Date().toISOString(),
      });

      await fetchAssignedRequests();
    } catch (err) {
      alert("Network error processing response");
    } finally {
      setActionLoadingId(null);
      setDeclineModalRequest(null);
      setDeclineReason("");
    }
  };

  const handleUpdateProgress = async (requestId: string, nextStatus: string, notes?: string) => {
    try {
      setActionLoadingId(requestId);
      const res = await fetch(`/api/requests/${requestId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextStatus,
          completionNotes: notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || `Failed to update status to ${nextStatus}`);
        return;
      }

      // Broadcast update across tabs immediately
      broadcastStatusUpdate({
        requestId,
        status: nextStatus,
        timestamp: new Date().toISOString(),
        note: notes,
      });

      await fetchAssignedRequests();
    } catch (err) {
      alert("Network error updating status");
    } finally {
      setActionLoadingId(null);
      setResolveModalRequest(null);
      setCompletionNotes("");
    }
  };

  const filtered = requests.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.category.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.member?.name?.toLowerCase().includes(q)
    );
  });

  // KPI counters
  const assignedCount = requests.filter((r) => r.status === "ASSIGNED").length;
  const inProgressCount = requests.filter((r) =>
    ["ACCEPTED", "ON_THE_WAY", "IN_PROGRESS"].includes(r.status)
  ).length;
  const resolvedCount = requests.filter((r) => r.status === "RESOLVED").length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner with Schema Actions & Ratings link */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 mb-2">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            <span>Service Provider Access • Schema Execution</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Assigned Service Requests
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Accept incoming requests assigned by central dispatch, update live arrival and work progress, and mark tasks resolved upon completion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/provider/ratings"
            className="px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black transition-all flex items-center gap-2 shadow-sm"
          >
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>View Ratings & Reviews</span>
          </Link>
          <Link
            href="/provider"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Provider Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Needs Response
            </p>
            <p className="text-xl font-black text-slate-900">{assignedCount} Assigned</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              In Progress
            </p>
            <p className="text-xl font-black text-slate-900">{inProgressCount} Active</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Completed
            </p>
            <p className="text-xl font-black text-slate-900">{resolvedCount} Resolved</p>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer, category, locality or notes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {["ALL", "ASSIGNED", "ACCEPTED", "ON_THE_WAY", "IN_PROGRESS", "RESOLVED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Requests" : st.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-500">Loading your assigned requests...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No assigned requests match</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search or status filter. When dispatch assigns new service requests to you, they will appear here immediately.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => {
            const isLoading = actionLoadingId === req.id;
            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:border-blue-300 transition-all space-y-4"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{req.category}</span>
                    <StatusBadge status={req.status} size="sm" />
                    <UrgencyBadge isEmergency={req.isEmergency} size="sm" />
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {req.visibility}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 font-medium">
                    Requested on {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Society Pool Badge if pooled */}
                {(req.groupCode || req.societyName || req.pool) && (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
                    <Building className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      <strong>Society Pool:</strong> {req.societyName || req.pool?.societyName} &bull; Group Code: <span className="font-mono font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">{req.groupCode || req.pool?.code}</span>
                    </span>
                    {req.pool?.serviceWindow && (
                      <span className="text-blue-700 hidden sm:inline">&bull; Window: {req.pool.serviceWindow}</span>
                    )}
                  </div>
                )}

                {/* Description & Member info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {req.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.address} ({req.locality})</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Customer Member
                    </p>
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {req.member?.name || "Community Member"}
                    </p>
                    {req.member?.phone && (
                      <p className="text-slate-600 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {req.member.phone}
                      </p>
                    )}
                    {req.rating && (
                      <div className="mt-1 pt-1.5 border-t border-slate-200/60 flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>Member Rated: {req.rating.stars}.0 / 5</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Completion Notes (if resolved) */}
                {req.completionNotes && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    <strong className="block font-bold mb-0.5">Completion Notes:</strong>
                    {req.completionNotes}
                  </div>
                )}

                {/* Schema Action Controls */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <Link
                    href={`/provider/requests/${req.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Open Request Action Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* 1. Accept Request / Decline (When ASSIGNED) */}
                    {req.status === "ASSIGNED" && (
                      <>
                        <button
                          disabled={isLoading}
                          onClick={() => setDeclineModalRequest(req)}
                          className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all"
                        >
                          Decline
                        </button>
                        <button
                          disabled={isLoading}
                          onClick={() => handleRespond(req.id, "ACCEPT")}
                          className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isLoading ? "Processing..." : "Accept Request"}</span>
                        </button>
                      </>
                    )}

                    {/* 2. Update Progress: Start Travel (When ACCEPTED) */}
                    {req.status === "ACCEPTED" && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateProgress(req.id, "ON_THE_WAY")}
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span>{isLoading ? "Updating..." : "Update Progress: On The Way"}</span>
                      </button>
                    )}

                    {/* 3. Update Progress: Start Work (When ON_THE_WAY) */}
                    {req.status === "ON_THE_WAY" && (
                      <button
                        disabled={isLoading}
                        onClick={() => handleUpdateProgress(req.id, "IN_PROGRESS")}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <Hammer className="w-3.5 h-3.5" />
                        <span>{isLoading ? "Updating..." : "Update Progress: Start Work (In Progress)"}</span>
                      </button>
                    )}

                    {/* 4. Mark Resolved (When IN_PROGRESS) */}
                    {req.status === "IN_PROGRESS" && (
                      <button
                        disabled={isLoading}
                        onClick={() => setResolveModalRequest(req)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    {/* When RESOLVED */}
                    {req.status === "RESOLVED" && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Service Resolved & Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mark Resolved Modal */}
      {resolveModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Mark Request Resolved</h3>
                  <p className="text-xs text-slate-500">{resolveModalRequest.category}</p>
                </div>
              </div>
              <button
                onClick={() => setResolveModalRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Completion Notes & Resolution Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Explain the work performed, replaced parts, testing done, or maintenance tips provided..."
                rows={4}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setResolveModalRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                disabled={!completionNotes.trim() || actionLoadingId === resolveModalRequest.id}
                onClick={() =>
                  handleUpdateProgress(resolveModalRequest.id, "RESOLVED", completionNotes)
                }
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20"
              >
                {actionLoadingId === resolveModalRequest.id ? "Saving..." : "Confirm Resolution"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {declineModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Decline Assigned Request</h3>
              <button
                onClick={() => setDeclineModalRequest(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Declining will return this request to the coordinator queue so another verified specialist can be dispatched.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Reason for declining (Optional)
              </label>
              <textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="E.g., Out of range, overlapping emergency call, required parts unavailable..."
                rows={3}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeclineModalRequest(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleRespond(declineModalRequest.id, "DECLINE", declineReason)
                }
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
