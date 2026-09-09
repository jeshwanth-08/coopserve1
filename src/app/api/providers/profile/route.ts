import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const providerUser = await prisma.user.findUnique({
      where: { id: user.userId },
      include: {
        providerProfile: true,
        ratingsReceived: {
          include: {
            member: { select: { name: true, locality: true } },
            request: { select: { category: true, resolvedAt: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!providerUser || !providerUser.providerProfile) {
      return NextResponse.json({ error: "Provider profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: providerUser,
      profile: providerUser.providerProfile,
      ratings: providerUser.ratingsReceived,
    });
  } catch (error) {
    console.error("GET provider profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { skills, serviceCategories, serviceArea, certifications } = body;

    const updatedProfile = await prisma.providerProfile.upsert({
      where: { userId: user.userId },
      update: {
        skills: JSON.stringify(skills || []),
        serviceCategories: JSON.stringify(serviceCategories || []),
        serviceArea: serviceArea || "",
        ...(certifications ? { certifications: JSON.stringify(certifications) } : {}),
      },
      create: {
        userId: user.userId,
        skills: JSON.stringify(skills || ["General Maintenance"]),
        serviceCategories: JSON.stringify(serviceCategories || ["General"]),
        serviceArea: serviceArea || "All Localities",
        certifications: JSON.stringify(certifications || []),
        isVerified: false,
        isActive: true,
        avgRating: 5.0,
        totalReviews: 0,
      },
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("PUT provider profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
