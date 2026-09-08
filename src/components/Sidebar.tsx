"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Users2,
  Wrench,
  UserCheck,
  Star,
  BarChart3,
  ShieldCheck,
  Building2,
  FileCheck2,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const getNavLinks = () => {
    switch (role) {
      case "ADMIN":
        return [
          {
            href: "/admin",
            label: "Analytics Dashboard",
            icon: BarChart3,
            exact: true,
          },
          {
            href: "/admin/requests",
            label: "All Service Requests",
            icon: ClipboardList,
          },
          {
            href: "/admin/providers",
            label: "Manage Providers",
            icon: ShieldCheck,
          },
          {
            href: "/admin/members",
            label: "Member Directory",
            icon: Building2,
          },
        ];
      case "PROVIDER":
        return [
          {
            href: "/provider",
            label: "Assigned Requests",
            icon: ClipboardList,
            exact: true,
          },
          {
            href: "/provider/profile",
            label: "Professional Profile",
            icon: Wrench,
          },
          {
            href: "/provider/ratings",
            label: "Ratings & Reviews",
            icon: Star,
          },
        ];
      default: // MEMBER
        return [
          {
            href: "/member",
            label: "Member Dashboard",
            icon: LayoutDashboard,
            exact: true,
          },
          {
            href: "/member/requests/new",
            label: "Create Service Request",
            icon: PlusCircle,
            highlight: true,
          },
          {
            href: "/member/requests",
            label: "My Requests",
            icon: ClipboardList,
            exact: true,
          },
          {
            href: "/member/community",
            label: "Community Feed",
            icon: Users2,
          },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex md:flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.highlight
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : isActive
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  item.highlight
                    ? "text-white"
                    : isActive
                    ? "text-blue-600"
                    : "text-slate-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-800">Cooperative Dispatch</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Community-owned cooperative gig workflow. Personal & neighborhood service dispatch.
          </p>
        </div>
      </div>
    </aside>
  );
}
