import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "cooperative-gig-services-platform-secret-key-2026-secure"
);

const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  "coopserve-auth-secret-key-2026";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/tracking") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/search") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 1. Check legacy/direct coop_session JWT
  const token = request.cookies.get("coop_session")?.value;
  let role: string | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      role = payload.role as string;
    } catch {
      // Invalid/expired token, fall through to check NextAuth
    }
  }

  // 2. Dual check: NextAuth Google OAuth session token
  if (!role) {
    try {
      const nextAuthToken = await getToken({
        req: request,
        secret: NEXTAUTH_SECRET,
      });
      if (nextAuthToken) {
        role = (nextAuthToken.role as string) || "MEMBER";
      }
    } catch {
      // Ignore NextAuth decode errors
    }
  }

  if (!role) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    const fullTarget = request.nextUrl.pathname + request.nextUrl.search;
    loginUrl.searchParams.set("returnUrl", fullTarget);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(role === "PROVIDER" ? "/provider" : "/member", request.url));
  }

  if (pathname.startsWith("/provider") && role !== "PROVIDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  if (pathname.startsWith("/member") && role !== "MEMBER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/provider", request.url));
  }

  if (pathname.startsWith("/api/admin/") && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden: Coordinator Admin access required." }, { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/book/:path*",
    "/booking/:path*",
    "/member/:path*",
    "/provider/:path*",
    "/admin/:path*",
    "/api/requests/:path*",
    "/api/admin/:path*",
    "/api/providers/:path*",
    "/api/members/:path*",
    "/api/analytics/:path*",
    "/api/notifications/:path*",
  ],
};