import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const locality = searchParams.get("locality");

    const providers = await prisma.user.findMany({
      where: {
        role: ROLES.PROVIDER,
        ...(verifiedOnly
          ? { providerProfile: { isVerified: true, isActive: true } }
          : { providerProfile: { isNot: null } }),
      },
      include: {
        providerProfile: true,
        _count: {
          select: { assignedRequests: true, ratingsReceived: true },
        },
      },
      orderBy: { name: "asc" },
    });

    // In-memory category matching if specified
    let filtered = providers;
    if (category && category !== "ALL") {
      filtered = filtered.filter((p) => {
        try {
          const cats = JSON.parse(p.providerProfile?.serviceCategories || "[]");
          return cats.includes(category);
        } catch {
          return true;
        }
      });
    }

    return NextResponse.json({ providers: filtered });
  } catch (error) {
    console.error("GET providers error:", error);
    return NextResponse.json({ error: "Failed to fetch providers" }, { status: 500 });
  }
}
