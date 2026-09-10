"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Phone,
  Wrench,
  AlertTriangle,
  Star,
  XCircle,
  Clock,
  Heart,
  MessageSquare,
  ShieldCheck,
  Send,
  Building,
  Truck,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";
import StatusTimeline from "@/components/StatusTimeline";
import ReviewModal from "@/components/ReviewModal";
import { subscribeToStatusUpdates } from "@/lib/realtimeSync";

export default function MemberRequestDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { id } = params;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Community discussion states
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [coSigning, setCoSigning] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/requests/${id}`);
      if (!res.ok) {
        setError("Unable to find request or access denied.");
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

    // 1. Instant cross-tab real-time update listener
    const unsubscribe = subscribeToStatusUpdates((event) => {
      if (event.requestId === id) {
        setRequest((prev: any) => (prev ? { ...prev, status: event.status } : prev));
        fetchDetail();
      }
    });

    // 2. Continuous multi-device polling heartbeat (every 3 seconds)
    const pollInterval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetch(`/api/requests/${id}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.request) {
              setRequest((prev: any) => {
                if (prev && prev.status !== data.request.status) {
                  return data.request;
                }
                return prev || data.request;
              });
            }
          })
          .catch(() => {});
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this pending service request?")) {
      return;
    }

    try {
      setCancelling(true);
      const res = await fetch(`/api/requests/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: "Cancelled by member" }),
      });

      if (res.ok) {
        fetchDetail();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel request");
      }
    } catch {
      alert("Error cancelling request");
    } finally {
      setCancelling(false);
    }
  };

  const handleCoSign = async () => {
    try {
      setCoSigning(true);
      const res = await fetch(`/api/requests/${id}/cosign`, { method: "POST" });
      if (res.ok) {
        fetchDetail();
      }
    } catch (err) {
      console.error("Failed to co-sign:", err);
    } finally {
      setCoSigning(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      const res = await fetch(`/api/requests/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: newComment.trim() }),
      });
      if (res.ok) {
        setNewComment("");
        fetchDetail();
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading service request details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
        <p className="text-sm font-semibold text-rose-600">{error || "Request not found"}</p>
        <Link
          href="/member/requests"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to My Requests
        </Link>
      </div>
    );
  }

  const isPending = request.status === "PENDING";
  const isResolved = request.status === "RESOLVED";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/member/requests"
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                {request.category} Request
              </h1>
              <span className="text-xs font-mono text-slate-400">
                #{request.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Logged on {new Date(request.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isPending && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              <span>{cancelling ? "Cancelling..." : "Cancel Request"}</span>
            </button>
          )}

          {isResolved && !request.rating && request.assignedProvider && (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-400 hover:bg-amber-500 shadow-sm transition-all"
            >
              <Star className="w-4 h-4 fill-amber-900" />
              <span>Rate & Review Service</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Alert Banner */}
      {request.isEmergency && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-red-800">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">
                Emergency Priority Dispatch Active
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                This request has been tagged as an emergency and prioritized at the top of coordinator & provider dispatch feeds.
              </p>
            </div>
          </div>
          <UrgencyBadge isEmergency={true} />
        </div>
      )}

      {/* Realtime Live Tracking Banner when Provider is On The Way */}
      {request.status === "ON_THE_WAY" && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-900 text-white shadow-lg border border-purple-800/60 relative overflow-hidden animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-sm">
                  <Truck className="w-6 h-6 animate-pulse text-purple-300" />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-purple-950" />
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500 text-white shadow-xs">
                    Live Tracking • On The Way
                  </span>
                  <span className="text-xs text-purple-200 font-medium">
                    Dispatched from Local Hub
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {request.assignedProvider?.name || "Your Specialist"} is on the way to your address!
                </h3>
                <p className="text-xs text-purple-200 leading-relaxed max-w-xl">
                  Technician has departed with diagnostic equipment and genuine spare parts. Estimated arrival: 15–20 mins.
                </p>
              </div>
            </div>

            {request.assignedProvider?.phone && (
              <a
                href={`tel:${request.assignedProvider.phone}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-950 font-bold text-xs shadow-md transition-all shrink-0 self-start sm:self-center"
              >
                <Phone className="w-4 h-4 text-purple-700" />
                <span>Call Specialist ({(request.assignedProvider?.name || "Specialist").split(" ")[0]})</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Society Group Pool Banner */}
      {(request.groupCode || request.societyName || request.pool) && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-blue-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
                  Society Group Pool
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-200 text-blue-800">
                  {request.groupCode || request.pool?.code}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-0.5">
                Pooled for <strong>{request.societyName || request.pool?.societyName}</strong>
                {request.pool?.serviceWindow && ` • Preferred Window: ${request.pool.serviceWindow}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300">
              Coordinated Visit &bull; Zero Doorstep Fee
            </span>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Request Details (2 Cols) */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <StatusBadge status={request.status} />
              <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                {request.visibility} Visibility
              </span>
            </div>
            <span className="text-xs text-slate-400">
              Locality: <strong className="text-slate-700">{request.locality}</strong>
            </span>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Issue Description
            </h3>
            <p className="text-sm text-slate-800 font-medium whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {request.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Service Address</span>
                <span>{request.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Preferred Schedule</span>
                <span>
                  {request.preferredDateTime
                    ? new Date(request.preferredDateTime).toLocaleString()
                    : "Immediate / First Available"}
                </span>
              </div>
            </div>
          </div>

          {/* Completion Notes if Resolved */}
          {request.completionNotes && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <span>Provider Completion Notes</span>
              </h4>
              <p className="text-xs text-emerald-800 mt-1 whitespace-pre-line">
                {request.completionNotes}
              </p>
            </div>
          )}

          {/* Existing Review */}
          {request.rating && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">Your Submitted Review</span>
                <div className="flex items-center text-amber-500">
                  {Array.from({ length: request.rating.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                  <span className="text-xs font-bold ml-1.5 text-amber-800">
                    {request.rating.stars}.0 / 5
                  </span>
                </div>
              </div>
              {request.rating.comment && (
                <p className="text-xs text-amber-900 mt-1.5 italic">
                  "{request.rating.comment}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Assigned Provider Card (1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
            Assigned Service Provider
          </h3>

          {request.assignedProvider ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
                  {request.assignedProvider.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {request.assignedProvider.name}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {request.assignedProvider.providerProfile?.avgRating || "4.8"} avg
                    </span>
                    <span className="text-slate-400 font-normal">
                      ({request.assignedProvider.providerProfile?.totalReviews || 12} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {request.assignedProvider.providerProfile?.isVerified && (
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Cooperative Specialist</span>
                </div>
              )}

              <div className="text-xs text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{request.assignedProvider.phone || "+1 555-0210"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{request.assignedProvider.locality}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">Coordinator Dispatching</p>
              <p className="text-[11px] text-slate-500 mt-1">
                The cooperative admin is reviewing matching providers in your locality.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Timeline & Audit History */}
      <StatusTimeline
        currentStatus={request.status}
        history={request.statusHistory || []}
      />

      {/* Community Co-Signs & Neighborhood Discussion (For Community Requests) */}
      {request.visibility === "COMMUNITY" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Community Co-Signers ({request.coSigns?.length || 0})
              </h3>
              <p className="text-xs text-slate-500">
                Neighbors in {request.locality} supporting this service call
              </p>
            </div>
            <button
              onClick={handleCoSign}
              disabled={coSigning}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all shrink-0"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-emerald-600" />
              <span>{coSigning ? "Co-signing..." : "+1 Co-Sign Request"}</span>
            </button>
          </div>

          {/* Co-signers pills */}
          <div className="flex flex-wrap gap-2">
            {request.coSigns?.length === 0 ? (
              <p className="text-xs text-slate-400">Be the first neighbor to co-sign this request!</p>
            ) : (
              request.coSigns?.map((cs: any) => (
                <span
                  key={cs.id}
                  className="px-2.5 py-1 rounded-full text-xs bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                >
                  {cs.user.name} ({cs.user.locality})
                </span>
              ))
            )}
          </div>

          {/* Comments Discussion Thread */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Community Discussion
            </h4>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {request.comments?.length === 0 ? (
                <p className="text-xs text-slate-400">No comments yet. Share an update or coordinate with neighbors.</p>
              ) : (
                request.comments?.map((c: any) => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800">
                        {c.user.name}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">({c.user.role})</span>
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600">{c.comment}</p>
                  </div>
                ))
              )}
            </div>

            {/* Post comment input */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a message to neighbors or coordinator..."
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-1 shrink-0"
              >
                <Send className="w-3 h-3" />
                <span>Comment</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {request.assignedProvider && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          requestId={request.id}
          providerName={request.assignedProvider.name}
          onReviewSubmitted={fetchDetail}
        />
      )}
    </div>
  );
}
