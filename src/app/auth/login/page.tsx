"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Briefcase,
  Shield,
  KeyRound,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { loginWithCredentials, verifyOtp } from "@/lib/authService";

function AuthLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "";

  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone");
  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER" | "ADMIN">("CUSTOMER");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("aarav.mehta@gmail.com");
  const [password, setPassword] = useState("��������");
  const [otpStage, setOtpStage] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStage(true);
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await verifyOtp(phone, otpValue);
    if (!res.success) {
      setErrorMessage(res.error || "Invalid OTP code. Try 123456.");
      setLoading(false);
      return;
    }

    // Role-based routing
    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "PROVIDER") {
      router.push("/provider");
    } else {
      router.push(returnUrl || "/account");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await loginWithCredentials(email, password);
    setLoading(false);

    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "PROVIDER") {
      router.push("/provider");
    } else {
      router.push(returnUrl || "/account");
    }
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push(returnUrl || "/account");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => router.push("/search")}
        onOpenBooking={() => router.push("/book/svc-1")}
      />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          {/* Card Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Welcome to CoopServe
            </h1>
            <p className="text-xs text-slate-500">
              India's trusted cooperative for certified home services
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            {/* Account Type Selector (Customer, Professional, Admin) */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Account Type:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "CUSTOMER", label: "Customer", icon: <Users className="w-3.5 h-3.5" /> },
                  { id: "PROVIDER", label: "Professional", icon: <Briefcase className="w-3.5 h-3.5" /> },
                  { id: "ADMIN", label: "Admin", icon: <Shield className="w-3.5 h-3.5" /> },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setRole(t.id as any);
                      if (t.id === "ADMIN") {
                        setEmail("priya.sharma@coopserve.in");
                        setAuthMethod("email");
                      } else if (t.id === "PROVIDER") {
                        setEmail("rahul.kumar@coop.org");
                      } else {
                        setEmail("aarav.mehta@gmail.com");
                      }
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                      role === t.id
                        ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Method Switcher: Phone vs Email */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod("phone");
                  setOtpStage(false);
                }}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMethod === "phone" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Phone Number (OTP)
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod("email")}
                className={`flex-1 py-2 rounded-lg transition-all ${
                  authMethod === "email" ? "bg-white text-brand-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Email & Password
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Phone OTP Auth Form */}
            {authMethod === "phone" && (
              <>
                {!otpStage ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">We will send a 6-digit OTP code to verify.</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <span>Sending OTP...</span> : <><span>Get Verification Code</span><ArrowRight className="w-4 h-4" /></>}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                    <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between">
                      <span className="text-brand-800 font-medium">OTP sent to {phone}</span>
                      <button
                        type="button"
                        onClick={() => setOtpStage(false)}
                        className="text-brand-600 font-bold underline text-[11px]"
                      >
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Enter 6-Digit OTP</label>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpValue}
                          onChange={(e) => setOtpValue(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 font-mono font-black text-slate-900 tracking-widest text-base focus:outline-none focus:ring-2 focus:ring-brand-500 text-center"
                          placeholder="123456"
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 text-center">Tip: Enter <strong>123456</strong> for instant login</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? <span>Verifying...</span> : <><span>Verify & Continue</span><CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Email & Password Form */}
            {authMethod === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Password</label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-[11px] font-bold text-brand-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <span>Authenticating...</span> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            {/* Google OAuth Option */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400 font-bold text-[10px]">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-2.5 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In with Google</span>
            </button>

            {/* Signup CTA */}
            <div className="text-center pt-2 text-xs text-slate-500">
              Don't have an account yet?{" "}
              <Link href="/auth/signup" className="font-bold text-brand-600 hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AuthLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>}>
      <AuthLoginContent />
    </Suspense>
  );
}
