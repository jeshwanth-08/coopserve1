/**
 * Clean Auth Service Layer
 * Easily swappable with Supabase Auth or NextAuth in production.
 */

export interface AuthSession {
  user: {
    id: string;
    email: string;
    phone: string;
    name: string;
    role: "CUSTOMER" | "PROVIDER" | "ADMIN";
    avatar?: string;
  };
  token: string;
}

export const CURRENT_MOCK_USERS = [
  {
    id: "usr-cust-1",
    name: "Aarav Mehta",
    email: "aarav.mehta@gmail.com",
    phone: "+91 98765 43210",
    role: "CUSTOMER" as const,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "usr-pro-1",
    name: "Rahul Kumar",
    email: "rahul.kumar@coop.org",
    phone: "+91 98450 11223",
    role: "PROVIDER" as const,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
  },
  {
    id: "usr-adm-1",
    name: "Priya Sharma",
    email: "priya.sharma@coopserve.in",
    phone: "+91 99001 88776",
    role: "ADMIN" as const,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
  },
];

export async function loginWithCredentials(identifier: string, passOrOtp: string, isOtp = false) {
  // Simulates network delay
  await new Promise((r) => setTimeout(r, 600));

  // Find user by email or phone
  const cleanId = identifier.trim().toLowerCase();
  const matched = CURRENT_MOCK_USERS.find(
    (u) => u.email.toLowerCase() === cleanId || u.phone.replace(/[^0-9]/g, "").includes(cleanId.replace(/[^0-9]/g, ""))
  ) || CURRENT_MOCK_USERS[0];

  return {
    success: true,
    user: matched,
    session: {
      user: matched,
      token: "mock-jwt-token-" + Date.now(),
    },
  };
}

export async function verifyOtp(phone: string, otp: string) {
  await new Promise((r) => setTimeout(r, 500));
  if (otp.length === 6 || otp === "1234" || otp === "123456") {
    return { success: true };
  }
  return { success: false, error: "Invalid OTP code. Please enter 123456." };
}
