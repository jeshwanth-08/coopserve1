import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { Role } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const { targetEmail } = await req.json();

    if (!targetEmail) {
      return NextResponse.json({ error: "targetEmail is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail.toLowerCase().trim() },
      include: { providerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Demo user not found" }, { status: 404 });
    }

    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      locality: user.locality,
    });

    let redirectUrl = "/";
    if (user.role === "ADMIN") redirectUrl = "/admin";
    else if (user.role === "PROVIDER") redirectUrl = "/provider";
    else if (user.role === "MEMBER") redirectUrl = "/member";

    const response = NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        locality: user.locality,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Quick switch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
