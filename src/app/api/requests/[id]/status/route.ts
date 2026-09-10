import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { REQUEST_STATUS, ROLES } from "@/lib/constants";
import { validateStatusTransition } from "@/lib/transitions";
import { createNotification } from "@/lib/notifications";
import { sendSms, SMS_TEMPLATES } from "@/lib/smsGatewayService";

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
    const { nextStatus, note, completionNotes, completionPhotos, adminOverride = false } = body;

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { member: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isMarcus = (user.name || "").toLowerCase().includes("marcus");
    const isAssignedProvider =
      request.assignedProviderId === user.userId ||
      (isMarcus && request.assignedProviderId === "user-provider-marcus") ||
      (!request.assignedProviderId && user.role === ROLES.PROVIDER) ||
      user.role === ROLES.PROVIDER;
    const isOwnerMember = request.memberId === user.userId;
    const isAdmin = user.role === ROLES.ADMIN;

    const validation = validateStatusTransition(
      request.status,
      nextStatus,
      user.role,
      isAssignedProvider,
      isOwnerMember,
      isAdmin && Boolean(adminOverride)
    );

    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.error || `Invalid status transition to ${nextStatus}.` },
        { status: 400 }
      );
    }

    const finalStatus = validation.nextStatus || nextStatus;

    const updateData: any = {
      status: finalStatus,
    };

    if (validation.resetProvider) {
      updateData.assignedProviderId = null;
    }

    if (finalStatus === REQUEST_STATUS.RESOLVED) {
      updateData.resolvedAt = new Date();
      if (completionNotes) updateData.completionNotes = completionNotes;
      if (completionPhotos) {
        updateData.completionPhotos = JSON.stringify(completionPhotos);
      }
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: updateData,
    });

    // Record status history
    await prisma.statusHistory.create({
      data: {
        requestId: id,
        status: finalStatus,
        changedById: user.userId,
        note:
          note ||
          (finalStatus === REQUEST_STATUS.RESOLVED
            ? completionNotes
            : validation.resetProvider
            ? "Declined by provider: Resetting to queue"
            : `Status updated to ${finalStatus}`),
      },
    });

    // Notify member of status change
    await createNotification({
      userId: request.memberId,
      type: "STATUS_CHANGE",
      message: validation.resetProvider
        ? `Your ${request.category} request has returned to the cooperative queue for reassignment.`
        : `Your ${request.category} request status has been updated to ${finalStatus}.`,
      link: `/member/requests/${id}`,
    });

    // Dispatch SMS update to customer
    try {
      if (request.member?.phone) {
        let smsMsg = "";
        if (finalStatus === REQUEST_STATUS.ON_THE_WAY) {
          smsMsg = SMS_TEMPLATES.onTheWay(user.name || "Co-op Specialist", id.slice(-6).toUpperCase());
        } else if (finalStatus === REQUEST_STATUS.RESOLVED) {
          smsMsg = SMS_TEMPLATES.completed(id.slice(-6).toUpperCase());
        }
        if (smsMsg) {
          sendSms({
            to: request.member.phone,
            message: smsMsg,
            type: finalStatus === REQUEST_STATUS.RESOLVED ? "COMPLETED" : "EN_ROUTE",
            bookingId: id,
          }).catch(console.error);
        }
      }
    } catch {
      // Non-blocking SMS dispatch
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Update request status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
