"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { DEMO_ACCOUNTS } from "@/components/DemoAccountSwitcher";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      if (returnUrl) {
        router.push(returnUrl);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else if (data.user.role === "PROVIDER") {
        router.push("/provider");
      } else {
        router.push("/member");
      }
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  const handleQuickLogin = async (accEmail: string) => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/quick-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: accEmail }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(returnUrl || data.redirectUrl);
        router.refresh();
      } else {
        setError(data.error || "Quick login failed");
      }
    } catch {
      setError("Failed to execute quick demo login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
          <Users className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          CoopServe
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Community-driven request and dispatch system
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-200/80">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Signing in..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Login Personas */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1-Click Demo Logins
              </span>
              <span className="text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                Pre-seeded
              </span>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => {
                const IconComponent = acc.icon;
                return (
                  <button
                    key={acc.email}
                    onClick={() => handleQuickLogin(acc.email)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-left transition-all text-xs group"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md ${acc.color}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800 group-hover:text-blue-700">
                          {acc.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          {acc.label}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 group-hover:text-blue-600">
                      Login →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
