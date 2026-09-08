import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const locality = searchParams.get("locality") || user.locality;
    const category = searchParams.get("category");
    const status = searchParams.get("status");

    const where: any = {
      visibility: "COMMUNITY",
    };

    if (locality && locality !== "ALL") {
      where.locality = locality;
    }
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (status && status !== "ALL") {
      where.status = status;
    }

    const communityRequests = await prisma.serviceRequest.findMany({
      where,
      include: {
        member: {
          select: { id: true, name: true, locality: true },
        },
        assignedProvider: {
          select: { id: true, name: true },
        },
        coSigns: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
        _count: {
          select: { coSigns: true, comments: true },
        },
      },
      orderBy: [{ isEmergency: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ requests: communityRequests });
  } catch (error) {
    console.error("GET community requests error:", error);
    return NextResponse.json({ error: "Failed to fetch community feed" }, { status: 500 });
  }
}
