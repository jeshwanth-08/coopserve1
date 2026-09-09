import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { decode } from "next-auth/jwt";
import { Role } from "./constants";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "cooperative-gig-services-platform-secret-key-2026-secure"
);

export const AUTH_COOKIE_NAME = "coop_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: Role;
  locality?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (token) {
    const verified = await verifySessionToken(token);
    if (verified) return verified;
  }

  // Dual-session support: recognize NextAuth Google OAuth session token
  const nextAuthCookie =
    cookieStore.get("next-auth.session-token")?.value ||
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (nextAuthCookie) {
    try {
      const decoded = await decode({
        token: nextAuthCookie,
        secret:
          process.env.NEXTAUTH_SECRET ||
          process.env.JWT_SECRET ||
          "coopserve-auth-secret-key-2026",
      });
      if (decoded && decoded.email) {
        return {
          userId: (decoded.userId as string) || (decoded.sub as string),
          email: decoded.email as string,
          name: (decoded.name as string) || "Google User",
          role: ((decoded.role as string) || "MEMBER") as Role,
          locality: (decoded.locality as string) || "Greenwood Heights",
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}
