import React from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ArrowLeft } from "lucide-react";
import MaintenanceDashboardWidget from "@/components/maintenance/MaintenanceDashboardWidget";
import { MOCK_REQUESTS } from "@/lib/mockDb";

export default async function MemberMaintenancePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let requests: any[] = [];
  try {
    requests = await prisma.serviceRequest.findMany({
      where: { memberId: user.userId },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    requests = MOCK_REQUESTS.filter(
      (r) => r.memberId === user.userId || r.member?.name === user.name
    );
  }

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
      {/* Header with back link */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/member"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Household Maintenance & AMC Scheduler
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              Smart Preventive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated reminder intervals and cooperative AMC coverage calculated from your service history.
          </p>
        </div>
      </div>

      <MaintenanceDashboardWidget completedRequests={completedRequests} />
    </div>
  );
}
