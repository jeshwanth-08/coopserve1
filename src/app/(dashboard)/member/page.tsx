import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  ArrowRight,
  MapPin,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import UrgencyBadge from "@/components/UrgencyBadge";

const MaintenanceDashboardWidget = dynamic(
  () => import("@/components/maintenance/MaintenanceDashboardWidget"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-400">Loading Maintenance & AMC Scheduler...</p>
      </div>
    ),
  }
);

import { MOCK_REQUESTS } from "@/lib/mockDb";

export default async function MemberDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Fetch Member's requests with database-failure resilience
  let requests: any[] = [];
  let communityRequests: any[] = [];

  try {
    requests = await prisma.serviceRequest.findMany({
      where: { memberId: user.userId },
      include: {
        assignedProvider: { select: { name: true } },
        rating: true,
      },
      orderBy: [{ isEmergency: "desc" }, { createdAt: "desc" }],
    });

    communityRequests = await prisma.serviceRequest.findMany({
      where: {
        visibility: "COMMUNITY",
        locality: user.locality,
        memberId: { not: user.userId },
      },
      include: {
        member: { select: { name: true } },
        _count: { select: { coSigns: true } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.warn("Prisma error in MemberDashboard, falling back to mock dataset:", err);
    requests = MOCK_REQUESTS.filter(
      (r) => r.memberId === user.userId || r.member?.name === user.name
    );
    if (requests.length === 0) {
      requests = MOCK_REQUESTS.slice(0, 3);
    }
    communityRequests = MOCK_REQUESTS.filter((r) => r.visibility === "COMMUNITY").slice(0, 3);
  }

  // Calculate KPIs
  const totalCount = requests.length;
  const activeRequests = requests.filter(
    (r) => !["RESOLVED", "CANCELLED"].includes(r.status)
  );
  const resolvedCount = requests.filter((r) => r.status === "RESOLVED").length;
  const emergencyCount = requests.filter((r) => r.isEmergency).length;

  // Extract completed service history for Smart Maintenance Scheduler (serialized safely for client)
  const completedRequests = requests
    .filter((r) => r.status === "RESOLVED" || r.status === "CONFIRMED" || Boolean(r.resolvedAt))
    .map((r) => ({
      id: r.id,
      category: r.category,
      description: r.description,
      status: r.status,
      createdAt: typeof r.createdAt === "object" && r.createdAt?.toISOString ? r.createdAt.toISOString() : String(r.createdAt || ""),
      resolvedAt: r.resolvedAt ? (typeof r.resolvedAt === "object" && r.resolvedAt?.toISOString ? r.resolvedAt.toISOString() : String(r.resolvedAt)) : null,
    }));

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Member
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Resident of <strong className="text-slate-700">{user.locality || "Greenwood Heights"}</strong>
          </p>
        </div>

        <Link
          href="/member/requests/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Service Request</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Requests"
          value={activeRequests.length}
          subtitle="In dispatch & progress"
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Completed services"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Emergency Flags"
          value={emergencyCount}
          subtitle="High priority calls"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Total Requests"
          value={totalCount}
          subtitle="All time requests"
          icon={Users}
          color="purple"
        />
      </div>

      {/* Smart Household Maintenance AMC & Revisit Scheduler */}
      <MaintenanceDashboardWidget completedRequests={completedRequests} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active & Recent Requests (Left 2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Requests</h2>
              <p className="text-xs text-slate-500">Personal & community tasks you logged</p>
            </div>
            <Link
              href="/member/requests"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View all ({totalCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {requests.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-slate-500">You haven't requested any services yet.</p>
              <Link
                href="/member/requests/new"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
              >
                + Create your first request
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.slice(0, 5).map((req) => (
                <Link
                  key={req.id}
                  href={`/member/requests/${req.id}`}
                  className="block p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/70 transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          {req.category}
                        </span>
                        <StatusBadge status={req.status} size="sm" />
                        <UrgencyBadge isEmergency={req.isEmergency} size="sm" />
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {req.visibility}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {req.description}
                      </p>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0 font-medium" suppressHydrationWarning>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      Provider:{" "}
                      <strong className="text-slate-700">
                        {req.assignedProvider?.name || "Pending Dispatch"}
                      </strong>
                    </span>
                    <span className="text-blue-600 font-semibold group-hover:underline">
                      Track Timeline →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Community Requests in your Locality (Right 1 Col) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Community Alerts</h2>
              <p className="text-xs text-slate-500">Nearby in {user.locality}</p>
            </div>
            <Link
              href="/member/community"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Full Feed →
            </Link>
          </div>

          {communityRequests.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No active community issues in your locality.
            </p>
          ) : (
            <div className="space-y-3">
              {communityRequests.map((cReq) => (
                <Link
                  key={cReq.id}
                  href={`/member/requests/${cReq.id}`}
                  className="block p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50/50 hover:border-blue-200 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{cReq.category}</span>
                    <UrgencyBadge isEmergency={cReq.isEmergency} size="sm" />
                  </div>
                  <p className="text-slate-600 mt-1 line-clamp-2">{cReq.description}</p>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>By {cReq.member?.name || "Neighbor"}</span>
                    <span className="text-blue-600 font-semibold">
                      +{cReq._count?.coSigns ?? 0} co-signed
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80">
            <h4 className="text-xs font-bold text-blue-900">Cooperative Benefit</h4>
            <p className="text-[11px] text-blue-700 mt-0.5">
              Notice a common pipe leak or street light failure? Co-sign existing community calls or
              log a new community request to mobilize cooperative crews!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
