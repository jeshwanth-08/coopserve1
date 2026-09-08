import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { ROLES } from "@/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== ROLES.ADMIN) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { isVerified, isActive } = body;

    const dataToUpdate: any = {};
    if (typeof isVerified === "boolean") dataToUpdate.isVerified = isVerified;
    if (typeof isActive === "boolean") dataToUpdate.isActive = isActive;

    const updated = await prisma.providerProfile.update({
      where: { userId: id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error) {
    console.error("Provider verify/status error:", error);
    return NextResponse.json({ error: "Failed to update provider status" }, { status: 500 });
  }
}
