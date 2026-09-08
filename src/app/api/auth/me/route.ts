import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
          providerProfile: true,
        },
      });
    } catch (dbErr) {
      console.warn("Database skipped in /me, using session payload:", dbErr);
    }

    return NextResponse.json({
      user: {
        id: user?.id || session.userId,
        name: user?.name || session.name,
        email: user?.email || session.email,
        role: user?.role || session.role,
        phone: user?.phone || "+1 555-0199",
        address: user?.address || "Cooperative Community",
        locality: user?.locality || session.locality || "Greenwood Heights",
        providerProfile: user?.providerProfile || null,
      },
    });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
