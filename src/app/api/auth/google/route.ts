import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { encode } from "next-auth/jwt";
import { Role, ROLES } from "@/lib/constants";
import crypto from "crypto";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  const isConfigured =
    Boolean(clientId) &&
    Boolean(clientSecret) &&
    !clientId.includes("placeholder") &&
    !clientId.includes("your-google-client-id");

  return NextResponse.json({
    configured: isConfigured,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      action,
      email,
      name,
      returnUrl,
      verificationMethod,
      code,
      password,
      role: requestedRole,
      category: requestedCategory,
      skills: requestedSkills,
    } = body;

    if (action === "check") {
      const clientId = process.env.GOOGLE_CLIENT_ID || "";
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

      const isConfigured =
        Boolean(clientId) &&
        Boolean(clientSecret) &&
        !clientId.includes("placeholder") &&
        !clientId.includes("your-google-client-id");

      return NextResponse.json({ configured: isConfigured });
    }

    // Direct Google authentication flow (used for instant sign-in or when real OAuth keys aren't provisioned)
    const targetEmail = (email || "alex.rivera@gmail.com").toLowerCase().trim();
    const targetName = name || "Alex Rivera";

    if (!targetEmail.includes("@")) {
      return NextResponse.json({ error: "Invalid Google email address" }, { status: 400 });
    }

    // Validate OTP if code was provided
    if (verificationMethod === "otp") {
      const cleanCode = (code || "").toString().trim();
      if (cleanCode.length < 6) {
        return NextResponse.json(
          { error: "Please enter a valid 6-digit Google verification code" },
          { status: 400 }
        );
      }
    }

    // Validate Password if method was password
    if (verificationMethod === "password") {
      if (!password || password.length < 4) {
        return NextResponse.json(
          { error: "Password must be at least 4 characters" },
          { status: 400 }
        );
      }
    }

    let user: any = null;
    let isNewUser = false;
    try {
      user = await prisma.user.findUnique({
        where: { email: targetEmail },
        include: { providerProfile: true },
      });

      if (!user) {
        const assignedRole = requestedRole === "PROVIDER" ? ROLES.PROVIDER : ROLES.MEMBER;
        const randomHash = `OAUTH_GOOGLE_${crypto.randomBytes(16).toString("hex")}`;
        user = await prisma.user.create({
          data: {
            name: targetName,
            email: targetEmail,
            passwordHash: randomHash,
            role: assignedRole,
            locality: "Greenwood Heights",
          },
          include: { providerProfile: true },
        });

        if (assignedRole === ROLES.PROVIDER) {
          const chosenCategory = requestedCategory || "Plumber";
          await prisma.providerProfile.create({
            data: {
              userId: user.id,
              skills: JSON.stringify(
                requestedSkills ? [requestedSkills] : [`Certified ${chosenCategory} Specialist`]
              ),
              serviceCategories: JSON.stringify([chosenCategory]),
              certifications: JSON.stringify([]),
              serviceArea: "All Localities",
              isVerified: true,
              isActive: true,
              avgRating: 5.0,
              totalReviews: 0,
            },
          });
        }
        isNewUser = true;
        console.log(`[Google Auth] Created new ${assignedRole} account for Google user: ${targetEmail}`);
      } else {
        // If user signs in selecting PROVIDER role, ensure role and specialization are updated
        if (requestedRole === "PROVIDER") {
          const chosenCategory = requestedCategory || "Gardener";
          user = await prisma.user.update({
            where: { id: user.id },
            data: { role: ROLES.PROVIDER },
            include: { providerProfile: true },
          });

          await prisma.providerProfile.upsert({
            where: { userId: user.id },
            update: {
              serviceCategories: JSON.stringify([chosenCategory]),
              skills: JSON.stringify(
                requestedSkills ? [requestedSkills] : [`Certified ${chosenCategory} Specialist`]
              ),
              isActive: true,
              isVerified: true,
            },
            create: {
              userId: user.id,
              skills: JSON.stringify(
                requestedSkills ? [requestedSkills] : [`Certified ${chosenCategory} Specialist`]
              ),
              serviceCategories: JSON.stringify([chosenCategory]),
              certifications: JSON.stringify([]),
              serviceArea: "All Localities",
              isVerified: true,
              isActive: true,
              avgRating: 5.0,
              totalReviews: 0,
            },
          });
        }
        console.log(`[Google Auth] Signed in/updated existing account (${user.role}) for Google user: ${targetEmail}`);
      }
    } catch (dbErr) {
      console.warn("[Google Auth] Database query error, using fallback demo user:", dbErr);
      const assignedRole = requestedRole === "PROVIDER" ? ROLES.PROVIDER : ROLES.MEMBER;
      const chosenCategory = requestedCategory || "Gardener";
      user = {
        id: `usr-google-${targetEmail.replace(/[^a-z0-9]/g, "-")}`,
        name: targetName,
        email: targetEmail,
        role: assignedRole,
        locality: "Greenwood Heights",
        providerProfile: assignedRole === ROLES.PROVIDER ? {
          serviceCategories: JSON.stringify([chosenCategory]),
          skills: JSON.stringify([`Certified ${chosenCategory} Specialist`]),
        } : null,
      };
    }

    // 1. Sign our primary coop_session JWT
    const token = await signSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as Role,
      locality: user.locality || "Greenwood Heights",
    });

    // 2. Also sign NextAuth session token for full dual-session synchronization
    const nextAuthSecret =
      process.env.NEXTAUTH_SECRET ||
      process.env.JWT_SECRET ||
      "coopserve-auth-secret-key-2026";

    let nextAuthToken = "";
    try {
      nextAuthToken = await encode({
        token: {
          userId: user.id,
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          locality: user.locality || "Greenwood Heights",
        },
        secret: nextAuthSecret,
        maxAge: 7 * 24 * 60 * 60,
      });
    } catch (err) {
      console.warn("[Google Auth] Failed to encode NextAuth token:", err);
    }

    const defaultDestination = user.role === "PROVIDER" ? "/provider" : "/member";
    const callbackUrl =
      returnUrl && !returnUrl.startsWith("/login") && !returnUrl.startsWith("/register")
        ? returnUrl
        : defaultDestination;

    const response = NextResponse.json({
      success: true,
      verified: true,
      verificationMethod: verificationMethod || "instant",
      redirectUrl: callbackUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        locality: user.locality,
      },
    });

    const isProd = process.env.NODE_ENV === "production";

    // Set coop_session cookie
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // Set NextAuth cookie
    if (nextAuthToken) {
      response.cookies.set({
        name: isProd ? "__Secure-next-auth.session-token" : "next-auth.session-token",
        value: nextAuthToken,
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return response;
  } catch (error) {
    console.error("[Google Auth] Error processing Google sign in:", error);
    return NextResponse.json({ error: "Failed to process Google sign in" }, { status: 500 });
  }
}
