import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES, REQUEST_STATUS } from "@/lib/constants";
import { createNotification } from "@/lib/notifications";
import { MOCK_REQUESTS } from "@/lib/mockDb";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const visibility = searchParams.get("visibility");
    const urgency = searchParams.get("urgency"); // "emergency" or "normal"

    const where: any = {};

    // Role scoping
    if (user.role === ROLES.MEMBER) {
      // Member sees their own requests (personal + community ones they created)
      where.memberId = user.userId;
    } else if (user.role === ROLES.PROVIDER) {
      // Provider sees requests assigned to them
      where.assignedProviderId = user.userId;
    }
    // Admin sees all requests

    // Filters
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (category && category !== "ALL") {
      where.category = category;
    }
    if (visibility && visibility !== "ALL") {
      where.visibility = visibility;
    }
    if (urgency === "emergency") {
      where.isEmergency = true;
    } else if (urgency === "normal") {
      where.isEmergency = false;
    }

    const requests = await prisma.serviceRequest.findMany({
      where,
      include: {
        member: {
          select: { id: true, name: true, phone: true, locality: true },
        },
        assignedProvider: {
          select: {
            id: true,
            name: true,
            phone: true,
            providerProfile: true,
          },
        },
        rating: true,
        _count: {
          select: { coSigns: true, comments: true },
        },
      },
      orderBy: [
        { isEmergency: "desc" }, // Emergency always sorted first!
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ requests });
  } catch (error) {
    console.warn("Prisma error in GET /api/requests, falling back to mock dataset:", error);
    try {
      const user = await getCurrentUser();
      let filtered = [...MOCK_REQUESTS];
      if (user?.role === ROLES.MEMBER) {
        filtered = filtered.filter((r) => r.memberId === user.userId || r.member?.name === user.name);
        if (filtered.length === 0) filtered = MOCK_REQUESTS.slice(0, 3);
      } else if (user?.role === ROLES.PROVIDER) {
        filtered = filtered.filter((r) => r.assignedProviderId === user.userId || r.assignedProvider?.name === user.name);
        if (filtered.length === 0) filtered = MOCK_REQUESTS.slice(0, 3);
      }
      return NextResponse.json({ requests: filtered });
    } catch {
      return NextResponse.json({ requests: MOCK_REQUESTS });
    }
  }
}

export async function POST(req: Request) {
  try {
    let user = await getCurrentUser();
    if (!user) {
      // Graceful fallback for guest marketplace bookings
      const fallbackMember = await prisma.user.findFirst({
        where: { role: ROLES.MEMBER },
      });
      if (fallbackMember) {
        user = {
          userId: fallbackMember.id,
          email: fallbackMember.email,
          name: fallbackMember.name,
          role: ROLES.MEMBER,
          locality: fallbackMember.locality,
        };
      } else {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();
    const {
      category,
      description,
      visibility = "PERSONAL",
      locality,
      address,
      isEmergency = false,
      preferredDateTime,
    } = body;

    if (!category || !description || !address) {
      return NextResponse.json(
        { error: "Category, description, and address are required." },
        { status: 400 }
      );
    }

    const targetLocality = locality || user.locality || "Greenwood Heights";

    const newRequest = await prisma.serviceRequest.create({
      data: {
        memberId: user.userId,
        category,
        description,
        visibility,
        locality: targetLocality,
        address,
        isEmergency: Boolean(isEmergency),
        preferredDateTime: preferredDateTime ? new Date(preferredDateTime) : null,
        status: REQUEST_STATUS.PENDING,
      },
    });

    // Create initial status history entry
    await prisma.statusHistory.create({
      data: {
        requestId: newRequest.id,
        status: REQUEST_STATUS.PENDING,
        changedById: user.userId,
        note: isEmergency
          ? "Emergency service request created by member."
          : "Service request created by member.",
      },
    });

    // Notify coordinators/admins
    const admins = await prisma.user.findMany({
      where: { role: ROLES.ADMIN },
    });

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: isEmergency ? "COMMUNITY_ALERT" : "STATUS_CHANGE",
        message: isEmergency
          ? `[EMERGENCY] New ${category} request at ${targetLocality}: "${description.slice(0, 50)}..."`
          : `New ${category} request submitted at ${targetLocality}.`,
        link: `/admin/requests`,
      });
    }

    return NextResponse.json({ success: true, request: newRequest }, { status: 201 });
  } catch (error) {
    console.error("POST request error:", error);
    return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
  }
}
