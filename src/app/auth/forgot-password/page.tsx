"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar
        selectedCity="Bengaluru"
        selectedLocality="Indiranagar"
        onSelectLocation={() => {}}
        onOpenSearch={() => {}}
        onOpenBooking={() => {}}
      />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            {!submitted ? (
              <>
                <div className="space-y-2 text-center">
                  <h1 className="text-xl font-black text-slate-900">Reset Your Password</h1>
                  <p className="text-xs text-slate-500">
                    Enter your registered email address and we'll send you recovery instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Send Reset Instructions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Recovery Email Dispatched</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folders.
                </p>
              </div>
            )}

            <div className="pt-2 text-center">
              <Link
                href="/auth/login"
                className="text-xs font-bold text-brand-600 hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
