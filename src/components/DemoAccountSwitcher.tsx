"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserCheck, Shield, Wrench, User, ChevronDown } from "lucide-react";

export const DEMO_ACCOUNTS = [
  {
    role: "ADMIN",
    label: "Admin Coordinator",
    name: "Eleanor Vance",
    email: "admin@coop.org",
    detail: "Full system & dispatch control",
    icon: Shield,
    color: "text-purple-600 bg-purple-50 hover:bg-purple-100",
  },
  {
    role: "PROVIDER",
    label: "Professional AC Specialist",
    name: "Rahul",
    email: "provider1@coop.org",
    detail: "Master AC Technician (★ 4.9)",
    icon: Wrench,
    color: "text-teal-600 bg-teal-50 hover:bg-teal-100",
  },
  {
    role: "PROVIDER",
    label: "Electrician Provider",
    name: "Marcus Thorne",
    email: "provider1@coop.org",
    detail: "Master Electrician (Verified)",
    icon: Wrench,
    color: "text-blue-600 bg-blue-50 hover:bg-blue-100",
  },
  {
    role: "PROVIDER",
    label: "Plumber Provider",
    name: "David Chen",
    email: "provider2@coop.org",
    detail: "Journeyman Plumber (Verified)",
    icon: Wrench,
    color: "text-indigo-600 bg-indigo-50 hover:bg-indigo-100",
  },
  {
    role: "MEMBER",
    label: "Community Member",
    name: "Alice Henderson",
    email: "member1@coop.org",
    detail: "Greenwood Heights",
    icon: User,
    color: "text-emerald-600 bg-emerald-50 hover:bg-emerald-100",
  },
  {
    role: "MEMBER",
    label: "Community Member",
    name: "Elena Rostova",
    email: "member5@coop.org",
    detail: "Riverside Society",
    icon: User,
    color: "text-teal-600 bg-teal-50 hover:bg-teal-100",
  },
];

export default function DemoAccountSwitcher() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (email: string) => {
    try {
      setSwitching(true);
      const res = await fetch("/api/auth/quick-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: email }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOpen(false);
        router.push(data.redirectUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to quick switch:", err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        disabled={switching}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <UserCheck className="w-4 h-4 text-amber-600" />
        <span>{switching ? "Switching..." : "Demo Switcher"}</span>
        <ChevronDown className="w-3.5 h-3.5 text-amber-500" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 divide-y divide-slate-100 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="p-3 bg-slate-50 rounded-t-xl">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1-Click Demo Personas
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Switch instantly between coordinator, providers, and members
              </p>
            </div>
            <div className="py-1">
              {DEMO_ACCOUNTS.map((acc) => {
                const IconComponent = acc.icon;
                return (
                  <button
                    key={acc.email}
                    onClick={() => handleSwitch(acc.email)}
                    className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-slate-50 flex items-start gap-3 transition-colors group"
                  >
                    <div className={`p-1.5 rounded-md ${acc.color} shrink-0 mt-0.5`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 group-hover:text-blue-600">
                          {acc.name}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {acc.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {acc.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
