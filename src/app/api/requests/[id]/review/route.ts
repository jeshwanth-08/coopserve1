import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { REQUEST_STATUS } from "@/lib/constants";
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
    const { stars, comment } = body;

    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { error: "A rating between 1 and 5 stars is required." },
        { status: 400 }
      );
    }

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
      include: { rating: true, assignedProvider: true },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.memberId !== user.userId) {
      return NextResponse.json(
        { error: "Only the member who created this request can submit a review." },
        { status: 403 }
      );
    }

    if (request.status !== REQUEST_STATUS.RESOLVED) {
      return NextResponse.json(
        { error: "Reviews can only be submitted once the service is Resolved." },
        { status: 400 }
      );
    }

    if (request.rating) {
      return NextResponse.json(
        { error: "You have already reviewed this service request." },
        { status: 400 }
      );
    }

    if (!request.assignedProviderId) {
      return NextResponse.json(
        { error: "No provider assigned to review." },
        { status: 400 }
      );
    }

    // Create the rating record
    const newRating = await prisma.rating.create({
      data: {
        requestId: id,
        memberId: user.userId,
        providerId: request.assignedProviderId,
        stars: Number(stars),
        comment: comment?.trim() || null,
      },
    });

    // Recompute provider's avgRating and totalReviews
    const allProviderRatings = await prisma.rating.findMany({
      where: { providerId: request.assignedProviderId },
    });

    const totalStars = allProviderRatings.reduce((acc, r) => acc + r.stars, 0);
    const avg = parseFloat((totalStars / allProviderRatings.length).toFixed(2));

    await prisma.providerProfile.update({
      where: { userId: request.assignedProviderId },
      data: {
        avgRating: avg,
        totalReviews: allProviderRatings.length,
      },
    });

    // Notify provider
    await createNotification({
      userId: request.assignedProviderId,
      type: "REVIEW_SUBMITTED",
      message: `${user.name} rated your service ${stars} stars! "${comment ? comment.slice(0, 40) + "..." : "Great job"}"`,
      link: `/provider/ratings`,
    });

    return NextResponse.json({ success: true, rating: newRating });
  } catch (error) {
    console.error("Submit review error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
