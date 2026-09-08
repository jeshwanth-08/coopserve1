import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const locality = searchParams.get("locality");

    const where: any = { role: ROLES.MEMBER };
    if (locality && locality !== "ALL") {
      where.locality = locality;
    }

    const members = await prisma.user.findMany({
      where,
      include: {
        _count: {
          select: {
            memberRequests: true,
            ratingsGiven: true,
            coSigns: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("GET members error:", error);
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}
