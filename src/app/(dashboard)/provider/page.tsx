import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Star,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Phone,
} from "lucide-react";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";

export default async function ProviderDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Fetch provider profile
  const profile = await prisma.providerProfile.findUnique({
    where: { userId: user.userId },
  });

  // Fetch all requests assigned to this provider
  const assignedRequests = await prisma.serviceRequest.findMany({
    where: { assignedProviderId: user.userId },
    include: {
      member: { select: { name: true, phone: true, locality: true } },
      rating: true,
    },
    orderBy: [
      { isEmergency: "desc" }, // Emergency pinned at top
      { createdAt: "desc" },
    ],
  });

  const emergencyRequests = assignedRequests.filter(
    (r) => r.isEmergency && !["RESOLVED", "CANCELLED"].includes(r.status)
  );

  const activeQueue = assignedRequests.filter(
    (r) => !["RESOLVED", "CANCELLED"].includes(r.status)
  );

  const resolvedRequests = assignedRequests.filter((r) => r.status === "RESOLVED");

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Provider Dispatch: {user.name}
            </h1>
            {profile?.isVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Specialist
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Pending Verification
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Assigned Service Area: <strong className="text-slate-700">{profile?.serviceArea || user.locality}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/provider/ratings"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold hover:bg-amber-100 transition-colors"
          >
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>★ {profile?.avgRating || "0.0"} ({profile?.totalReviews || 0} reviews)</span>
          </Link>

          <Link
            href="/provider/profile"
            className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Queue"
          value={activeQueue.length}
          subtitle="Assigned to you"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Emergency Calls"
          value={emergencyRequests.length}
          subtitle="Require urgent arrival"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Resolved Jobs"
          value={resolvedRequests.length}
          subtitle="Completed services"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rating Average"
          value={`${profile?.avgRating || 0.0} ★`}
          subtitle={`From ${profile?.totalReviews || 0} reviews`}
          icon={Star}
          color="amber"
        />
      </div>

      {/* PINNED EMERGENCY QUEUE (If any emergency requests) */}
      {emergencyRequests.length > 0 && (
        <div className="p-5 rounded-2xl bg-red-50/70 border-2 border-red-300 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 animate-pulse" />
              <h2 className="text-sm font-black text-red-900 uppercase tracking-wider">
                Emergency Priority Dispatch ({emergencyRequests.length})
              </h2>
            </div>
            <span className="text-xs font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200">
              Immediate Response Required
            </span>
          </div>

          <div className="space-y-3">
            {emergencyRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{req.category}</span>
                    <StatusBadge status={req.status} size="sm" />
                    <UrgencyBadge isEmergency={true} size="sm" />
                  </div>
                  <p className="text-xs text-slate-800 font-semibold">{req.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.address} ({req.locality})
                    </span>
                    <span>•</span>
                    <span>Member: {req.member.name} ({req.member.phone})</span>
                  </div>
                </div>

                <Link
                  href={`/provider/requests/${req.id}`}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-sm transition-colors text-center shrink-0"
                >
                  Manage Emergency Call →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Assigned Requests Queue */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Assigned Requests Queue</h2>
            <p className="text-xs text-slate-500">
              Review new coordinator assignments and progress active jobs to completion
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {activeQueue.length} Pending Actions
          </span>
        </div>

        {assignedRequests.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No requests assigned yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              When the coordinator matches a customer request to your skills and locality, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignedRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  req.isEmergency
                    ? "bg-red-50/30 border-red-200"
                    : req.status === "RESOLVED"
                    ? "bg-emerald-50/20 border-slate-200 opacity-80"
                    : "bg-white border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{req.category}</span>
                    <StatusBadge status={req.status} size="sm" />
                    <UrgencyBadge isEmergency={req.isEmergency} size="sm" />
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {req.visibility}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-2">
                    {req.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {req.address}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {req.member.name} ({req.member.phone || "No phone"})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/provider/requests/${req.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all text-center"
                  >
                    Open Action Panel →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
