"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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
  Calendar,
  Clock,
  Wallet,
  HelpCircle,
  Users,
  Tag,
  MapPin,
  AlertCircle,
  RotateCcw,
  Megaphone,
} from "lucide-react";

interface SidebarProps {
  role: string;
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const effectiveRole = pathname.startsWith("/admin")
    ? "ADMIN"
    : pathname.startsWith("/provider")
    ? "PROVIDER"
    : role || "MEMBER";

  const getNavLinks = () => {
    switch (effectiveRole) {
      case "ADMIN":
        return [
          {
            href: "/admin?tab=overview",
            label: "Dashboard Analytics",
            icon: BarChart3,
          },
          {
            href: "/admin/requests",
            label: "View All Requests",
            icon: ClipboardList,
            highlight: true,
          },
          {
            href: "/admin/providers",
            label: "Manage Providers",
            icon: ShieldCheck,
          },
          {
            href: "/admin?tab=bookings",
            label: "Bookings Management",
            icon: Calendar,
          },
          {
            href: "/admin?tab=customers",
            label: "Customer Users",
            icon: Users,
          },
          {
            href: "/admin?tab=coupons",
            label: "Coupons & Offers",
            icon: Tag,
          },
          {
            href: "/admin?tab=services",
            label: "Services & Catalog",
            icon: Wrench,
          },
          {
            href: "/admin?tab=payments",
            label: "Payments & Gateway",
            icon: Wallet,
          },
          {
            href: "/admin?tab=reviews",
            label: "Reviews Moderation",
            icon: Star,
          },
          {
            href: "/admin?tab=complaints",
            label: "Complaints & Disputes",
            icon: AlertCircle,
          },
        ];
      case "PROVIDER":
        return [
          {
            href: "/provider/requests",
            label: "View Assigned Requests",
            icon: ClipboardList,
            highlight: true,
          },
          {
            href: "/provider/ratings",
            label: "View Ratings",
            icon: Star,
          },
          {
            href: "/provider?tab=overview",
            label: "Provider Overview",
            icon: LayoutDashboard,
          },
          {
            href: "/provider?tab=today",
            label: "Today's Jobs",
            icon: Calendar,
          },
          {
            href: "/provider?tab=earnings",
            label: "Earnings",
            icon: Wallet,
          },
          {
            href: "/provider?tab=performance",
            label: "Performance",
            icon: BarChart3,
          },
          {
            href: "/provider?tab=availability",
            label: "Availability",
            icon: Clock,
          },
          {
            href: "/provider?tab=services",
            label: "Services & Skills",
            icon: Wrench,
          },
          {
            href: "/provider?tab=profile",
            label: "Profile",
            icon: UserCheck,
          },
          {
            href: "/provider?tab=support",
            label: "Support",
            icon: HelpCircle,
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
            href: "/member/maintenance",
            label: "Maintenance & AMC",
            icon: Calendar,
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
  const searchParams = useSearchParams();
  const currentTab = searchParams ? searchParams.get("tab") || "overview" : "overview";

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex md:flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const itemTab = item.href.includes("?tab=") ? item.href.split("?tab=")[1] : null;
          const isActive = itemTab
            ? (pathname === "/admin" || pathname === "/provider") && currentTab === itemTab
            : item.exact
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
