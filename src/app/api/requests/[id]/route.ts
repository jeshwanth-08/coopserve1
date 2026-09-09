import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";
import { MOCK_REQUESTS } from "@/lib/mockDb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let serviceRequest: any = null;

    try {
      serviceRequest = await prisma.serviceRequest.findUnique({
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
    } catch (dbErr) {
      console.warn("Database lookup failed for request ID, checking mock store:", dbErr);
    }

    if (!serviceRequest) {
      const mockMatch = MOCK_REQUESTS.find((r) => r.id === id);
      if (mockMatch) {
        serviceRequest = {
          ...mockMatch,
          statusHistory: [
            {
              id: `sh-init-${mockMatch.id}`,
              status: "PENDING",
              changedAt: mockMatch.createdAt,
              note: "Request logged into cooperative dispatch system",
              changedBy: {
                id: mockMatch.memberId,
                name: mockMatch.member?.name || "Member",
                role: "MEMBER",
              },
            },
            ...(mockMatch.status !== "PENDING"
              ? [
                  {
                    id: `sh-status-${mockMatch.id}`,
                    status: mockMatch.status,
                    changedAt: new Date().toISOString(),
                    note: `Status updated to ${mockMatch.status}`,
                    changedBy: {
                      id: mockMatch.assignedProviderId || "coordinator",
                      name: mockMatch.assignedProvider?.name || "Coordinator Desk",
                      role: "PROVIDER",
                    },
                  },
                ]
              : []),
          ],
          coSigns: [],
          comments: [],
          rating: mockMatch.rating
            ? {
                stars: mockMatch.rating.stars,
                comment: mockMatch.rating.review,
                createdAt: mockMatch.createdAt,
              }
            : null,
        };
      }
    }

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
    const mockMatch = MOCK_REQUESTS.find((r) => r.id === id);
    if (mockMatch) {
      return NextResponse.json({
        request: {
          ...mockMatch,
          statusHistory: [],
          coSigns: [],
          comments: [],
        },
      });
    }
    return NextResponse.json({ error: "Failed to retrieve request details" }, { status: 500 });
  }
}
