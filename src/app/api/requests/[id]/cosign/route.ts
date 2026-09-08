import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    const request = await prisma.serviceRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (request.visibility !== "COMMUNITY") {
      return NextResponse.json(
        { error: "Only community requests can be co-signed." },
        { status: 400 }
      );
    }

    const existing = await prisma.communitySupport.findUnique({
      where: {
        requestId_userId: {
          requestId: id,
          userId: user.userId,
        },
      },
    });

    if (existing) {
      // Toggle off / remove co-sign
      await prisma.communitySupport.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ success: true, coSigned: false });
    } else {
      await prisma.communitySupport.create({
        data: {
          requestId: id,
          userId: user.userId,
        },
      });
      return NextResponse.json({ success: true, coSigned: true });
    }
  } catch (error) {
    console.error("Co-sign error:", error);
    return NextResponse.json({ error: "Failed to co-sign request" }, { status: 500 });
  }
}
