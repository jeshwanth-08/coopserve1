import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { ROLES, Role } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      role,
      phone,
      address,
      locality,
      skills,
      serviceCategories,
      serviceArea,
    } = body;

    if (!name || !email || !password || !role || !locality) {
      return NextResponse.json(
        { error: "Name, email, password, role, and locality are required." },
        { status: 400 }
      );
    }

    if (role === ROLES.ADMIN) {
      return NextResponse.json(
        { error: "Administrative accounts cannot be self-registered." },
        { status: 403 }
      );
    }

    if (![ROLES.MEMBER, ROLES.PROVIDER].includes(role)) {
      return NextResponse.json(
        { error: "Invalid registration role selected." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role,
        phone: phone || null,
        address: address || null,
        locality: locality.trim(),
      },
    });

    let providerProfile = null;
    if (role === ROLES.PROVIDER) {
      providerProfile = await prisma.providerProfile.create({
        data: {
          userId: newUser.id,
          skills: JSON.stringify(Array.isArray(skills) ? skills : [skills || "General Handyman"]),
          serviceCategories: JSON.stringify(
            Array.isArray(serviceCategories) ? serviceCategories : [serviceCategories || "General"]
          ),
          certifications: JSON.stringify([]),
          serviceArea: serviceArea || locality,
          isVerified: false, // Must be verified by cooperative admin
          isActive: true,
          avgRating: 0,
          totalReviews: 0,
        },
      });
    }

    const token = await signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as Role,
      locality: newUser.locality,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        locality: newUser.locality,
        providerProfile,
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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error occurred during registration." },
      { status: 500 }
    );
  }
}
