import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { REQUEST_STATUS, ROLES } from "@/lib/constants";
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

    if (user.role !== ROLES.ADMIN) {
      return NextResponse.json(
        { error: "Forbidden: Only cooperative coordinators can assign providers." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { providerId, note } = body;

    if (!providerId) {
      return NextResponse.json({ error: "Provider ID is required" }, { status: 400 });
    }

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { member: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const targetProvider = await prisma.user.findUnique({
      where: { id: providerId },
      include: { providerProfile: true },
    });

    if (!targetProvider || targetProvider.role !== ROLES.PROVIDER) {
      return NextResponse.json({ error: "Invalid provider selected" }, { status: 400 });
    }

    /**
     * =========================================================================
     * EXTENSION POINT: AUTOMATED MATCHING ALGORITHM
     * In future phases, this block can be substituted with an auto-dispatch engine:
     * - Vector/fuzzy matching request.category against providerProfile.skills
     * - Haversine distance calculation between request.locality and provider.serviceArea
     * - Live availability, current active workload index, and historical avgRating weighting
     * =========================================================================
     */

    const updated = await prisma.serviceRequest.update({
      where: { id },
      data: {
        assignedProviderId: targetProvider.id,
        status: REQUEST_STATUS.ASSIGNED,
      },
    });

    await prisma.statusHistory.create({
      data: {
        requestId: id,
        status: REQUEST_STATUS.ASSIGNED,
        changedById: user.userId,
        note: note || `Assigned to ${targetProvider.name} (${targetProvider.locality}) by ${user.name}`,
      },
    });

    // Notify provider of new assignment
    await createNotification({
      userId: targetProvider.id,
      type: "ASSIGNED",
      message: `${request.isEmergency ? "[EMERGENCY] " : ""}New job assigned: ${request.category} at ${request.address} (${request.locality}).`,
      link: `/provider/requests/${id}`,
    });

    // Notify customer
    await createNotification({
      userId: request.memberId,
      type: "STATUS_CHANGE",
      message: `Specialist ${targetProvider.name} has been assigned to your ${request.category} request.`,
      link: `/member/requests/${id}`,
    });

    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    console.error("Assign provider error:", error);
    return NextResponse.json({ error: "Failed to assign provider" }, { status: 500 });
  }
}
