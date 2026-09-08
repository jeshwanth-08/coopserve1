import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { REQUEST_STATUS, ROLES } from "@/lib/constants";
import { validateStatusTransition } from "@/lib/transitions";
import { createNotification } from "@/lib/notifications";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { action, reason } = body; // action: "ACCEPT" | "DECLINE"

    if (!["ACCEPT", "DECLINE"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid response action. Expected 'ACCEPT' or 'DECLINE'." },
        { status: 400 }
      );
    }

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { member: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isAssignedProvider = request.assignedProviderId === user.userId;
    const isAdmin = user.role === ROLES.ADMIN;

    if (!isAssignedProvider && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You are not the assigned provider for this request." },
        { status: 403 }
      );
    }

    const targetStatus =
      action === "ACCEPT" ? REQUEST_STATUS.ACCEPTED : REQUEST_STATUS.DECLINED;

    const validation = validateStatusTransition(
      request.status,
      targetStatus,
      user.role,
      isAssignedProvider,
      false,
      isAdmin
    );

    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.error || "Cannot perform this action in current status." },
        { status: 400 }
      );
    }

    if (action === "ACCEPT") {
      const updated = await prisma.serviceRequest.update({
        where: { id },
        data: { status: REQUEST_STATUS.ACCEPTED },
      });

      await prisma.statusHistory.create({
        data: {
          requestId: id,
          status: REQUEST_STATUS.ACCEPTED,
          changedById: user.userId,
          note: `Assignment accepted by ${user.name}`,
        },
      });

      // Notify member
      await createNotification({
        userId: request.memberId,
        type: "STATUS_CHANGE",
        message: `${user.name} has accepted your ${request.category} request!`,
        link: `/member/requests/${id}`,
      });

      return NextResponse.json({ success: true, request: updated });
    } else {
      // DECLINE: Reset back to PENDING and unassign provider
      const updated = await prisma.serviceRequest.update({
        where: { id },
        data: {
          status: REQUEST_STATUS.PENDING,
          assignedProviderId: null,
        },
      });

      await prisma.statusHistory.create({
        data: {
          requestId: id,
          status: REQUEST_STATUS.DECLINED,
          changedById: user.userId,
          note: `Declined by ${user.name}: ${reason || "No reason provided"}. Resetting to queue.`,
        },
      });

      // Notify admin coordinators for reassignment
      const admins = await prisma.user.findMany({ where: { role: ROLES.ADMIN } });
      for (const a of admins) {
        await createNotification({
          userId: a.id,
          type: "STATUS_CHANGE",
          message: `${user.name} declined request #${id.slice(-6)}. Needs reassignment.`,
          link: `/admin/requests`,
        });
      }

      return NextResponse.json({
        success: true,
        message: "Request declined and reset to pending dispatch queue.",
        request: updated,
      });
    }
  } catch (error) {
    console.error("Provider response error:", error);
    return NextResponse.json({ error: "Failed to process response" }, { status: 500 });
  }
}
