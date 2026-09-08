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
    const body = await req.json().catch(() => ({}));
    const { note = "Cancelled by member" } = body;

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const isOwner = request.memberId === user.userId;
    const isAdmin = user.role === ROLES.ADMIN;

    const validation = validateStatusTransition(
      request.status,
      REQUEST_STATUS.CANCELLED,
      user.role,
      false,
      isOwner,
      isAdmin
    );

    if (!validation.allowed) {
      return NextResponse.json(
        { error: validation.error || "Cannot cancel request in current status." },
        { status: 400 }
      );
    }

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        status: REQUEST_STATUS.CANCELLED,
      },
    });

    await prisma.statusHistory.create({
      data: {
        requestId: id,
        status: REQUEST_STATUS.CANCELLED,
        changedById: user.userId,
        note,
      },
    });

    // Notify admin
    const admins = await prisma.user.findMany({ where: { role: ROLES.ADMIN } });
    for (const a of admins) {
      await createNotification({
        userId: a.id,
        type: "STATUS_CHANGE",
        message: `Request #${id.slice(-6)} for ${request.category} was cancelled by ${user.name}.`,
        link: `/admin/requests`,
      });
    }

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Cancel request error:", error);
    return NextResponse.json({ error: "Failed to cancel request" }, { status: 500 });
  }
}
