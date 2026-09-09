"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Car,
  Hammer,
  FileCheck,
  AlertTriangle,
  Phone,
  MapPin,
  Calendar,
  Upload,
  User,
  Star,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import StatusTimeline from "@/components/StatusTimeline";
import { broadcastStatusUpdate, subscribeToStatusUpdates } from "@/lib/realtimeSync";

export default function ProviderRequestActionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Decline dialog state
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState("");

  // Resolve dialog / form state
  const [completionNotes, setCompletionNotes] = useState("");
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/requests/${id}`);
      if (!res.ok) {
        setError("Unable to find request or unauthorized.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRequest(data.request);
    } catch {
      setError("Network error loading request.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();

    // 1. Instant cross-tab real-time listener
    const unsubscribe = subscribeToStatusUpdates((event) => {
      if (event.requestId === id) {
        fetchDetail();
      }
    });

    // 2. Multi-device auto-polling interval
    const pollInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchDetail();
      }
    }, 3500);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [id]);

  const handleRespond = async (action: "ACCEPT" | "DECLINE") => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/requests/${id}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reason: declineReason }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to process response");
        return;
      }

      broadcastStatusUpdate({
        requestId: id,
        status: action === "ACCEPT" ? "ACCEPTED" : "PENDING",
        timestamp: new Date().toISOString(),
      });

      if (action === "DECLINE") {
        router.push("/provider");
      } else {
        fetchDetail();
      }
    } catch {
      alert("Network error processing response.");
    } finally {
      setActionLoading(false);
      setShowDeclineModal(false);
    }
  };

  const handleProgressStatus = async (nextStatus: string, note?: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/requests/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nextStatus,
          note,
          completionNotes: nextStatus === "RESOLVED" ? completionNotes : undefined,
          completionPhotos: uploadedPhotoUrl ? [uploadedPhotoUrl] : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update status");
        return;
      }

      // Broadcast immediately across all open tabs / windows
      broadcastStatusUpdate({
        requestId: id,
        status: nextStatus,
        timestamp: new Date().toISOString(),
        note,
      });

      fetchDetail();
    } catch {
      alert("Network error updating status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadedPhotoUrl(data.url);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch {
      alert("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading service request...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
        <p className="text-sm font-semibold text-rose-600">{error || "Request not found"}</p>
        <Link
          href="/provider"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assigned Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/provider"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {request.category} Action Panel
              </h1>
              <span className="text-xs font-mono text-slate-400">
                #{request.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Customer: {request.member.name} • {request.locality}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={request.status} />
          <UrgencyBadge isEmergency={request.isEmergency} />
        </div>
      </div>

      {/* EMERGENCY HIGHLIGHT BANNER */}
      {request.isEmergency && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-center justify-between text-red-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="text-xs font-bold uppercase">
              Emergency Priority Call: Expedited Response Required
            </span>
          </div>
          <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">
            Immediate Dispatch
          </span>
        </div>
      )}

      {/* ACTION WORKFLOW CONTROLLER CARD */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Request Workflow Progression</h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Current lifecycle state: <strong className="uppercase underline">{request.status}</strong>
            </p>
          </div>
        </div>

        {/* Dynamic Controls based on currentStatus */}
        {request.status === "ASSIGNED" && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 space-y-3">
            <p className="text-xs text-white">
              The coordinator assigned this service call to you. Please review the details below and
              either accept the dispatch or decline so it can be reassigned:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleRespond("ACCEPT")}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Assignment</span>
              </button>
              <button
                onClick={() => setShowDeclineModal(true)}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>Decline & Return to Queue</span>
              </button>
            </div>
          </div>
        )}

        {request.status === "ACCEPTED" && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 space-y-3">
            <p className="text-xs text-white">
              You have accepted this job. When you begin traveling to the customer location, click below:
            </p>
            <button
              onClick={() => handleProgressStatus("ON_THE_WAY", "Provider departed for location")}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              <Car className="w-4 h-4" />
              <span>Mark "On The Way"</span>
            </button>
          </div>
        )}

        {request.status === "ON_THE_WAY" && (
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 space-y-3">
            <p className="text-xs text-white">
              Arrived at site? Mark work in progress to keep the customer and cooperative updated:
            </p>
            <button
              onClick={() => handleProgressStatus("IN_PROGRESS", "Provider arrived on site and started work")}
              disabled={actionLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              <Hammer className="w-4 h-4" />
              <span>Mark "Work In Progress"</span>
            </button>
          </div>
        )}

        {request.status === "IN_PROGRESS" && (
          <div className="bg-white text-slate-900 rounded-xl p-5 shadow space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Mark Request as Resolved</h3>
              <p className="text-xs text-slate-500">
                Provide notes on what was repaired/completed, and optionally attach a photo.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Resolution Summary & Notes
              </label>
              <textarea
                rows={3}
                required
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="e.g. Replaced faulty 32A dual-pole breaker, tested voltage on all sockets, verified no short circuits."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Attach Work Completion Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {uploading && <span className="text-xs text-blue-600">Uploading...</span>}
                {uploadedPhotoUrl && (
                  <span className="text-xs text-emerald-600 font-semibold">✓ Photo attached</span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleProgressStatus("RESOLVED")}
              disabled={actionLoading || !completionNotes.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all disabled:opacity-50"
            >
              <FileCheck className="w-4 h-4" />
              <span>Confirm & Mark Resolved</span>
            </button>
          </div>
        )}

        {request.status === "RESOLVED" && (
          <div className="bg-emerald-500/20 backdrop-blur rounded-xl p-4 border border-emerald-400/40 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">Job Successfully Completed & Resolved</p>
              <p className="text-xs text-emerald-100">
                Resolved on {new Date(request.resolvedAt || request.updatedAt).toLocaleString()}.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Request Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Description & Notes (2 Cols) */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Task Specifications
          </h3>

          <div>
            <p className="text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {request.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Service Address</span>
                <span>{request.address}</span>
                <span className="text-slate-400 block">({request.locality})</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Customer Schedule</span>
                <span>
                  {request.preferredDateTime
                    ? new Date(request.preferredDateTime).toLocaleString()
                    : "Immediate Priority"}
                </span>
              </div>
            </div>
          </div>

          {request.completionNotes && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 mt-2">
              <h4 className="text-xs font-bold text-emerald-900">Recorded Resolution Notes:</h4>
              <p className="text-xs text-emerald-800 mt-1">{request.completionNotes}</p>
            </div>
          )}

          {request.rating && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Customer Rating</span>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: request.rating.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-xs font-bold ml-1 text-amber-800">
                    {request.rating.stars}.0 / 5
                  </span>
                </div>
              </div>
              {request.rating.comment && (
                <p className="text-xs text-amber-900 mt-1 italic">
                  "{request.rating.comment}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Customer Info Card (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Customer Contact
          </h3>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              {request.member.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{request.member.name}</h4>
              <p className="text-[11px] text-slate-500">{request.locality}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <a
                href={`tel:${request.member.phone}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {request.member.phone || "No phone registered"}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <span>{request.member.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <StatusTimeline
        currentStatus={request.status}
        history={request.statusHistory || []}
      />

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Decline Service Request</h3>
            <p className="text-xs text-slate-600">
              Declining will immediately return this request to the coordinator's dispatch queue so
              another specialist can be assigned.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Reason for Declining (Optional)
              </label>
              <textarea
                rows={3}
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="e.g. Current tool parts unavailable, or scheduling conflict with another emergency call."
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDeclineModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRespond("DECLINE")}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
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
