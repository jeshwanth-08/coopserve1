import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-client-secret",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        console.warn("[NextAuth] Google sign-in rejected: No email provided");
        return false;
      }

      const cleanEmail = user.email.toLowerCase().trim();

      try {
        // Data model integration: Google sign-in must create/find the User record
        // in our existing DB with role defaulted to MEMBER, so Google users flow into
        // the same User/ProviderProfile model as email/password users.
        let existingUser = await prisma.user.findUnique({
          where: { email: cleanEmail },
          include: { providerProfile: true },
        });

        if (!existingUser) {
          // Brand new user: CRITICAL REQUIREMENT - strictly default role to MEMBER!
          // Never assign ADMIN or PROVIDER automatically.
          const randomHash = `OAUTH_GOOGLE_${crypto.randomBytes(16).toString("hex")}`;
          existingUser = await prisma.user.create({
            data: {
              name: user.name || "Google User",
              email: cleanEmail,
              passwordHash: randomHash,
              role: "MEMBER",
              locality: "Greenwood Heights",
            },
            include: { providerProfile: true },
          });
          console.log(`[NextAuth] Created new MEMBER account for Google user: ${cleanEmail}`);
        } else {
          console.log(`[NextAuth] Linked existing account (${existingUser.role}) for Google user: ${cleanEmail}`);
        }

        // Attach internal user ID and verified role to user object for the jwt callback
        user.id = existingUser.id;
        (user as any).role = existingUser.role || "MEMBER";
        (user as any).locality = existingUser.locality || "Greenwood Heights";

        return true;
      } catch (dbErr) {
        console.error("[NextAuth] Database error linking Google user:", dbErr);
        // Fallback resilience: allow sign in with default MEMBER role if DB transient error
        user.id = user.id || `usr-google-${cleanEmail.replace(/[^a-z0-9]/g, "-")}`;
        (user as any).role = "MEMBER";
        (user as any).locality = "Greenwood Heights";
        return true;
      }
    },

    async jwt({ token, user }) {
      // On initial sign-in, attach our internal DB user id, role, and locality onto the JWT token
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role || "MEMBER";
        token.locality = (user as any).locality || "Greenwood Heights";
      }
      return token;
    },

    async session({ session, token }) {
      // Attach our internal user id + role + locality onto the session object
      if (session.user) {
        (session.user as any).id = (token.userId as string) || (token.sub as string);
        (session.user as any).role = (token.role as string) || "MEMBER";
        (session.user as any).locality = (token.locality as string) || "Greenwood Heights";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "coopserve-auth-secret-key-2026",
};
