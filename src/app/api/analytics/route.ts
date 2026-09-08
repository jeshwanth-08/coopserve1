import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES, REQUEST_STATUS, CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const allRequests = await prisma.serviceRequest.findMany({
      include: {
        assignedProvider: { select: { name: true } },
      },
    });

    const totalRequests = allRequests.length;
    const emergencyCount = allRequests.filter((r) => r.isEmergency).length;
    const resolvedRequests = allRequests.filter((r) => r.status === REQUEST_STATUS.RESOLVED);

    // Requests by Status
    const statusCounts: Record<string, number> = {};
    Object.keys(REQUEST_STATUS).forEach((st) => {
      statusCounts[st] = 0;
    });
    allRequests.forEach((r) => {
      statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
    });

    const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    // Requests by Category
    const categoryCounts: Record<string, number> = {};
    CATEGORIES.forEach((cat) => {
      categoryCounts[cat] = 0;
    });
    allRequests.forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
    });

    const categoryChartData = Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count);

    // Visibility Split (Personal vs Community)
    const personalCount = allRequests.filter((r) => r.visibility === "PERSONAL").length;
    const communityCount = allRequests.filter((r) => r.visibility === "COMMUNITY").length;

    const visibilitySplit = [
      { name: "Personal Requests", value: personalCount },
      { name: "Community Requests", value: communityCount },
    ];

    // Average Resolution Time (in hours)
    let avgResolutionHours = 0;
    const resolvedWithDates = resolvedRequests.filter((r) => r.resolvedAt);
    if (resolvedWithDates.length > 0) {
      const totalDurationMs = resolvedWithDates.reduce((acc, r) => {
        return acc + (new Date(r.resolvedAt!).getTime() - new Date(r.createdAt).getTime());
      }, 0);
      avgResolutionHours = parseFloat(
        (totalDurationMs / resolvedWithDates.length / (1000 * 60 * 60)).toFixed(1)
      );
    }

    // Top Rated Providers
    const providers = await prisma.user.findMany({
      where: { role: ROLES.PROVIDER },
      include: {
        providerProfile: true,
        _count: {
          select: { assignedRequests: true },
        },
      },
      orderBy: {
        providerProfile: {
          avgRating: "desc",
        },
      },
      take: 6,
    });

    const topProviders = providers.map((p) => {
      let cats: string[] = [];
      try {
        cats = JSON.parse(p.providerProfile?.serviceCategories || "[]");
      } catch {
        cats = [];
      }

      return {
        id: p.id,
        name: p.name,
        locality: p.locality,
        categories: cats,
        avgRating: p.providerProfile?.avgRating || 0,
        totalReviews: p.providerProfile?.totalReviews || 0,
        isVerified: p.providerProfile?.isVerified || false,
        totalJobs: p._count.assignedRequests,
      };
    });

    return NextResponse.json({
      metrics: {
        totalRequests,
        emergencyCount,
        resolvedCount: resolvedRequests.length,
        activeCount: totalRequests - resolvedRequests.length - (statusCounts["CANCELLED"] || 0),
        avgResolutionHours,
        personalCount,
        communityCount,
      },
      statusChartData,
      categoryChartData,
      visibilitySplit,
      topProviders,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to generate analytics" }, { status: 500 });
  }
}
