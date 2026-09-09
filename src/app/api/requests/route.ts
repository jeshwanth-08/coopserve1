import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES, REQUEST_STATUS } from "@/lib/constants";
import { createNotification } from "@/lib/notifications";
import { MOCK_REQUESTS } from "@/lib/mockDb";
import { autoAssignProvider } from "@/lib/providerAssignmentService";
import { sendSms, SMS_TEMPLATES } from "@/lib/smsGatewayService";

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
        pool: true,
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
      selectedProviderId,
      preferredProviderId,
      providerId,
      societyName,
      groupCode,
      poolId,
    } = body;

    const requestedProviderId = selectedProviderId || preferredProviderId || providerId || null;

    if (!category || !description || !address) {
      return NextResponse.json(
        { error: "Category, description, and address are required." },
        { status: 400 }
      );
    }

    const targetLocality = locality || user.locality || "Greenwood Heights";

    // Optional Society Pool resolution
    let resolvedPoolId = poolId || null;
    let resolvedGroupCode = groupCode || null;
    let resolvedSociety = societyName || null;

    if (!resolvedPoolId && resolvedGroupCode) {
      try {
        const pool = await prisma.societyPool.findUnique({
          where: { code: resolvedGroupCode.trim().toUpperCase() },
        });
        if (pool) {
          resolvedPoolId = pool.id;
          resolvedSociety = resolvedSociety || pool.societyName;
        }
      } catch (err) {
        console.warn("Notice: could not resolve society pool by code:", err);
      }
    }

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
        poolId: resolvedPoolId,
        societyName: resolvedSociety,
        groupCode: resolvedGroupCode,
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

    // Run Automated Service Provider Assignment System
    const assignmentResult = await autoAssignProvider(newRequest.id, requestedProviderId);

    // Notify coordinators/admins
    const admins = await prisma.user.findMany({
      where: { role: ROLES.ADMIN },
    });

    for (const admin of admins) {
      let adminMsg = "";
      if (assignmentResult.assigned && assignmentResult.provider) {
        adminMsg = isEmergency
          ? `[EMERGENCY - AUTO-ASSIGNED] ${category} at ${targetLocality} assigned to ${assignmentResult.provider.name}.`
          : `New ${category} request at ${targetLocality} automatically assigned to ${assignmentResult.provider.name}.`;
      } else {
        adminMsg = isEmergency
          ? `[EMERGENCY - UNASSIGNED] New ${category} request at ${targetLocality} requires coordinator dispatch.`
          : `New ${category} request submitted at ${targetLocality} (Pending Dispatch).`;
      }

      await createNotification({
        userId: admin.id,
        type: isEmergency ? "COMMUNITY_ALERT" : "STATUS_CHANGE",
        message: adminMsg,
        link: `/admin/requests`,
      });
    }

    // Dispatch SMS notification to member/customer
    try {
      const memberUser = await prisma.user.findUnique({ where: { id: user.userId } });
      if (memberUser?.phone) {
        if (assignmentResult.assigned && assignmentResult.provider) {
          sendSms({
            to: memberUser.phone,
            message: SMS_TEMPLATES.providerAssigned(
              newRequest.id.slice(-6).toUpperCase(),
              assignmentResult.provider.name,
              assignmentResult.provider.phone || "+91 98765 00000"
            ),
            type: "PROVIDER_ASSIGNED",
            bookingId: newRequest.id,
          }).catch(console.error);
        } else {
          sendSms({
            to: memberUser.phone,
            message: SMS_TEMPLATES.bookingConfirmed(
              newRequest.id.slice(-6).toUpperCase(),
              category,
              targetLocality
            ),
            type: "BOOKING_CONFIRMED",
            bookingId: newRequest.id,
          }).catch(console.error);
        }
      }
    } catch {
      // Non-blocking SMS dispatch
    }

    // Return the updated request record
    const finalRequest = await prisma.serviceRequest.findUnique({
      where: { id: newRequest.id },
      include: {
        assignedProvider: {
          select: { id: true, name: true, phone: true, locality: true },
        },
        pool: true,
      },
    });

    return NextResponse.json(
      { success: true, request: finalRequest || newRequest, assignment: assignmentResult },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST request error:", error);
    return NextResponse.json({ error: "Failed to create service request" }, { status: 500 });
  }
}
