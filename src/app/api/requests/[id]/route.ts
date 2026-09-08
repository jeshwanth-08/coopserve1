import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            locality: true,
            address: true,
          },
        },
        assignedProvider: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            locality: true,
            providerProfile: true,
          },
        },
        statusHistory: {
          include: {
            changedBy: {
              select: { id: true, name: true, role: true },
            },
          },
          orderBy: { changedAt: "asc" },
        },
        rating: true,
        coSigns: {
          include: {
            user: { select: { id: true, name: true, locality: true } },
          },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!serviceRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Role visibility permission check:
    // Community requests: visible to all members in locality, assigned provider, admin
    // Personal requests: visible to creator member, assigned provider, admin
    const isOwner = serviceRequest.memberId === user.userId;
    const isAssigned = serviceRequest.assignedProviderId === user.userId;
    const isAdmin = user.role === ROLES.ADMIN;
    const isCommunityInSameLocality =
      serviceRequest.visibility === "COMMUNITY" &&
      (user.locality === serviceRequest.locality || isAdmin);

    if (!isOwner && !isAssigned && !isAdmin && !isCommunityInSameLocality) {
      return NextResponse.json(
        { error: "Access denied. This is a personal service request." },
        { status: 403 }
      );
    }

    return NextResponse.json({ request: serviceRequest });
  } catch (error) {
    console.error("GET request by ID error:", error);
    return NextResponse.json({ error: "Failed to retrieve request details" }, { status: 500 });
  }
}
