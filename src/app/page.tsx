"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Shield,
  Wrench,
  User,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Building,
  HeartHandshake,
} from "lucide-react";
import { DEMO_ACCOUNTS } from "@/components/DemoAccountSwitcher";

export default function HomePage() {
  const router = useRouter();

  const handleQuickDemo = async (email: string) => {
    try {
      const res = await fetch("/api/auth/quick-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(data.redirectUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Demo switch failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 leading-tight block">
                CoopServe
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Community Platform
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-500/20 transition-colors"
            >
              Join Platform
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-4">
              <HeartHandshake className="w-4 h-4 text-blue-600" />
              Community-Owned Cooperative Dispatch System
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Fair, Reliable Household & Community Services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Connect members with certified, verified local service professionals. Manage personal
              home repairs or rally neighbors for society-wide community service requests.
            </p>

            {/* Quick 1-Click Persona Launchpad */}
            <div className="mt-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Judge & Evaluator 1-Click Launchpad
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any pre-seeded persona below to jump directly into their fully populated portal:
                  </p>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                  ● Real Seed Data Live
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Admin Launch */}
                <button
                  onClick={() => handleQuickDemo("admin@coop.org")}
                  className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 hover:bg-purple-100/70 hover:border-purple-300 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <Shield className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Admin Coordinator
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                    Eleanor Vance
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage all 32 requests, dispatch providers, and monitor analytics.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-purple-700 flex items-center gap-1">
                    Enter Coordinator Portal <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Provider Launch */}
                <button
                  onClick={() => handleQuickDemo("provider1@coop.org")}
                  className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 hover:border-blue-300 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <Wrench className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Master Electrician
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                    Marcus Thorne
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accept assignments, track status to Resolved, and view customer reviews.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-blue-700 flex items-center gap-1">
                    Enter Provider Portal <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Member Launch */}
                <button
                  onClick={() => handleQuickDemo("member1@coop.org")}
                  className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 hover:border-emerald-300 text-left transition-all group"
                >
                  <div className="flex items-center gap-2 text-emerald-700 mb-2">
                    <User className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      Community Member
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                    Alice Henderson
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Create personal or community requests, track live status, and co-sign.
                  </p>
                  <div className="mt-3 text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    Enter Member Portal <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Emergency Request Priority
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  High-urgency leaks, electrical hazards, and lockouts trigger emergency alerts and
                  are pinned to the top of dispatch queues.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3">
                  <Building className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Community & Society Requests
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Neighbors can co-sign and collaborate on shared infrastructure needs (parks,
                  elevators, pipe leaks) with transparency.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Strict Finite State Machine
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Pending → Assigned → Accepted → On The Way → In Progress → Resolved, backed by
                  immutable server audit logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CoopServe. Community Service Network.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js & Prisma</span>
            <span>•</span>
            <Link href="/login" className="hover:underline text-slate-700">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
