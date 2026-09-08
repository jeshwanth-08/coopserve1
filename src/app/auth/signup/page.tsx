"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Phone,
  Mail,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Users,
  Briefcase,
  KeyRound,
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { verifyOtp } from "@/lib/authService";

export default function AuthSignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");
  const [name, setName] = useState("Aarav Mehta");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("aarav.mehta@gmail.com");
  const [serviceSpecialty, setServiceSpecialty] = useState("HVAC & AC Service");
  const [otpStage, setOtpStage] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStartSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpStage(true);
    }, 600);
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const res = await verifyOtp(phone, otpValue);
    if (!res.success) {
      setErrorMessage(res.error || "Invalid OTP code. Try 123456.");
      setLoading(false);
      return;
    }

    if (role === "PROVIDER") {
      router.push("/provider");
    } else {
      router.push("/account");
    }
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
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Create Your Account
            </h1>
            <p className="text-xs text-slate-500">
              Join thousands of Indian households and verified pros
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            {/* Account Role Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("CUSTOMER")}
                className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  role === "CUSTOMER"
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Customer Member</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("PROVIDER")}
                className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  role === "PROVIDER"
                    ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Service Professional</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {!otpStage ? (
              <form onSubmit={handleStartSignup} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                {role === "PROVIDER" && (
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Primary Discipline / Skill</label>
                    <select
                      value={serviceSpecialty}
                      onChange={(e) => setServiceSpecialty(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="HVAC & AC Service">HVAC & AC Technician</option>
                      <option value="Electrician">Master Electrician</option>
                      <option value="Plumber">Plumbing & Sanitary Specialist</option>
                      <option value="Deep Cleaning">Deep Cleaning & Hygiene</option>
                      <option value="Appliance Repair">Home Appliance Repair</option>
                    </select>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <span>Sending Code...</span> : <><span>Get 6-Digit OTP</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCompleteSignup} className="space-y-4 text-xs">
                <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between">
                  <span className="text-brand-800 font-medium">OTP sent to {phone}</span>
                  <button
                    type="button"
                    onClick={() => setOtpStage(false)}
                    className="text-brand-600 font-bold underline text-[11px]"
                  >
                    Edit
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
                  <p className="text-[11px] text-slate-400 mt-1 text-center">Use <strong>123456</strong> for testing</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <span>Activating Account...</span> : <><span>Confirm & Complete Signup</span><CheckCircle2 className="w-4 h-4" /></>}
                </button>
              </form>
            )}

            <div className="text-center pt-2 text-xs text-slate-500">
              Already registered?{" "}
              <Link href="/auth/login" className="font-bold text-brand-600 hover:underline">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
