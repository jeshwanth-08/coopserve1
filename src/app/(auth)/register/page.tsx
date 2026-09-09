"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Lock, Mail, User, Phone, MapPin, Wrench, ArrowRight, AlertCircle } from "lucide-react";
import { CATEGORIES, LOCALITIES, ROLES } from "@/lib/constants";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "";

  const [role, setRole] = useState<"MEMBER" | "PROVIDER">("MEMBER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [locality, setLocality] = useState<string>(LOCALITIES[0]);

  // Provider specific
  const [selectedCategories, setSelectedCategories] = useState<string[]>([CATEGORIES[0]]);
  const [skills, setSkills] = useState("");
  const [serviceArea, setServiceArea] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCategoryToggle = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter((c) => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        role,
        phone,
        address,
        locality,
      };

      if (role === "PROVIDER") {
        payload.serviceCategories = selectedCategories;
        payload.skills = skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        payload.serviceArea = serviceArea || locality;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      if (role === "PROVIDER") {
        router.push("/provider");
      } else if (
        returnUrl &&
        !returnUrl.startsWith("/auth") &&
        !returnUrl.startsWith("/login") &&
        !returnUrl.startsWith("/register")
      ) {
        router.push(returnUrl);
      } else {
        router.push("/member");
      }
      router.refresh();
    } catch {
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center flex flex-col items-center">
        <Link href="/" className="inline-block transition-transform hover:scale-105 mb-2" title="CoopServe Home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="CoopServe Logo"
            className="h-14 w-auto object-contain mx-auto"
          />
        </Link>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Register as a community member or certified local service provider
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl sm:px-10 border border-slate-200/80">
          {/* Role Selector Tabs */}
          <div className="mb-6 grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setRole("MEMBER")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                role === "MEMBER"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Community Member (Customer)</span>
            </button>
            <button
              type="button"
              onClick={() => setRole("PROVIDER")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                role === "PROVIDER"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Service Provider (Worker)</span>
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Lin"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

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
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0199"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Locality / Society
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {LOCALITIES.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Flat 402, Block B"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Extra fields for Service Provider */}
            {role === "PROVIDER" && (
              <div className="pt-4 border-t border-slate-200 space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-2">
                    Service Categories (Choose at least one)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                          selectedCategories.includes(cat)
                            ? "bg-blue-50 text-blue-700 border-blue-300 font-semibold"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {selectedCategories.includes(cat) ? "✓ " : "+ "}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Specialized Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. Circuit Breakers, Rewiring, High Voltage Safety"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Service Area / Radius
                  </label>
                  <input
                    type="text"
                    value={serviceArea}
                    onChange={(e) => setServiceArea(e.target.value)}
                    placeholder="e.g. Greenwood Heights & Riverside Society"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Note: Provider profiles will undergo verification by the Cooperative Coordinator before full activation.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              <span>{loading ? "Registering account..." : "Complete Registration"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Social OAuth / Google Sign-In */}
          <div className="mt-5">
            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-xs uppercase font-medium text-slate-400 shrink-0">
                Or continue with
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            <GoogleSignInButton returnUrl={returnUrl} text="Sign up with Google (Member)" />
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Already have an account?{" "}
            <Link
              href={returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : "/login"}
              className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
          Loading registration...
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
