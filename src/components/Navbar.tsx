"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, LogOut, MapPin, Wrench } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import DemoAccountSwitcher from "./DemoAccountSwitcher";

interface NavbarProps {
  user: {
    id?: string;
    userId?: string;
    name: string;
    email: string;
    role: string;
    locality?: string;
  };
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "Coop Coordinator",
          bg: "bg-purple-100 text-purple-800 border-purple-200",
        };
      case "PROVIDER":
        return {
          label: "Service Provider",
          bg: "bg-blue-100 text-blue-800 border-blue-200",
        };
      default:
        return {
          label: "Community Member",
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
        };
    }
  };

  const roleInfo = getRoleBadge(user.role);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[4rem] h-auto py-1 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <Link
            href={
              user.role === "ADMIN"
                ? "/admin"
                : user.role === "PROVIDER"
                ? "/provider"
                : "/member"
            }
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-900 leading-tight block">
                Coop Gig Services
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block">
                Community Cooperative
              </span>
            </div>
          </Link>

          {/* Locality Tag */}
          {user.locality && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.locality}</span>
            </div>
          )}
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Switcher */}
          <DemoAccountSwitcher />

          {/* In-App Notifications */}
          <NotificationDropdown />

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Role & Profile */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-slate-900 block truncate max-w-[140px]">
                {user.name}
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${roleInfo.bg}`}
              >
                {roleInfo.label}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
