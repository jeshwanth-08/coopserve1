import React from "react";
import { AlertTriangle } from "lucide-react";

interface UrgencyBadgeProps {
  isEmergency: boolean;
  size?: "sm" | "md";
}

export default function UrgencyBadge({ isEmergency, size = "md" }: UrgencyBadgeProps) {
  if (!isEmergency) {
    return (
      <span
        className={`inline-flex items-center rounded-md font-medium text-slate-600 bg-slate-100 border border-slate-200 ${
          size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-0.5 text-xs"
        }`}
      >
        Normal
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-bold text-red-700 bg-red-50 border border-red-200 shadow-sm animate-pulse-subtle ${
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      }`}
    >
      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
      EMERGENCY
    </span>
  );
}
