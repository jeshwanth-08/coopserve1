import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "cooperative-gig-services-platform-secret-key-2026-secure"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("coop_session")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    const role = payload.role as string;

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
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("coop_session");
    return response;
  }
}

export const config = {
  matcher: [
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