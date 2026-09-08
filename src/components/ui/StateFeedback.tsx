"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CalendarX,
  AlertTriangle,
  CreditCard,
  Tag,
  MapPinOff,
  WifiOff,
  RefreshCw,
  ArrowRight,
  Search,
  Clock,
} from "lucide-react";

export type StateFeedbackVariant =
  | "empty_bookings"
  | "empty_pros"
  | "payment_failed"
  | "invalid_coupon"
  | "service_unavailable"
  | "offline_error"
  | "generic_empty"
  | "generic_error";

interface StateFeedbackProps {
  variant: StateFeedbackVariant;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
  compact?: boolean;
}

export default function StateFeedback({
  variant,
  title,
  description,
  actionText,
  onAction,
  actionHref,
  secondaryActionText,
  onSecondaryAction,
  className = "",
  compact = false,
}: StateFeedbackProps) {
  let defaultIcon = <Sparkles className="w-8 h-8 text-brand-600" />;
  let defaultTitle = "";
  let defaultDescription = "";
  let defaultAction = "";
  let defaultHref: string | undefined = undefined;
  let iconBg = "bg-brand-50 border-brand-200 text-brand-600";

  switch (variant) {
    case "empty_bookings":
      defaultIcon = <CalendarX className="w-8 h-8 text-brand-600" />;
      defaultTitle = "Nothing booked yet 👀";
      defaultDescription = "Your home is waiting. Or perhaps your home is behaving… for now 😌";
      defaultAction = "Let’s fix it";
      defaultHref = "/services";
      iconBg = "bg-brand-50 border-brand-200 text-brand-600";
      break;

    case "empty_pros":
      defaultIcon = <Clock className="w-8 h-8 text-amber-600" />;
      defaultTitle = "No pros nearby right now.";
      defaultDescription = "Try another time or service area to find certified specialists.";
      defaultAction = "Change time";
      iconBg = "bg-amber-50 border-amber-200 text-amber-600";
      break;

    case "payment_failed":
      defaultIcon = <CreditCard className="w-8 h-8 text-rose-600" />;
      defaultTitle = "Your payment didn’t go through.";
      defaultDescription = "Your bank or UPI gateway declined the transaction. No amount was deducted.";
      defaultAction = "Try again";
      iconBg = "bg-rose-50 border-rose-200 text-rose-600";
      break;

    case "invalid_coupon":
      defaultIcon = <Tag className="w-8 h-8 text-amber-600" />;
      defaultTitle = "That code didn’t work.";
      defaultDescription = "The coupon is either expired, already redeemed, or has a minimum order requirement.";
      defaultAction = "Try another coupon";
      defaultHref = "/offers";
      iconBg = "bg-amber-50 border-amber-200 text-amber-600";
      break;

    case "service_unavailable":
      defaultIcon = <MapPinOff className="w-8 h-8 text-violet-600" />;
      defaultTitle = "We’re not serving this area yet.";
      defaultDescription = "We are currently active in 6 Indian metro hubs and expanding rapidly.";
      defaultAction = "Change location";
      iconBg = "bg-violet-50 border-violet-200 text-violet-600";
      break;

    case "offline_error":
      defaultIcon = <WifiOff className="w-8 h-8 text-slate-600" />;
      defaultTitle = "You appear to be offline 📡";
      defaultDescription = "Check your internet connection and retry to restore live availability.";
      defaultAction = "Retry";
      iconBg = "bg-slate-100 border-slate-200 text-slate-700";
      break;

    case "generic_empty":
      defaultIcon = <Search className="w-8 h-8 text-slate-400" />;
      defaultTitle = "No results found";
      defaultDescription = "We couldn't find any items matching your criteria.";
      defaultAction = "Clear filters";
      iconBg = "bg-slate-50 border-slate-200 text-slate-500";
      break;

    case "generic_error":
      defaultIcon = <AlertTriangle className="w-8 h-8 text-rose-600" />;
      defaultTitle = "Something went wrong";
      defaultDescription = "An unexpected error occurred. Please try again or reach out to support.";
      defaultAction = "Reload";
      iconBg = "bg-rose-50 border-rose-200 text-rose-600";
      break;
  }

  const finalTitle = title || defaultTitle;
  const finalDesc = description || defaultDescription;
  const finalAction = actionText || defaultAction;
  const finalHref = actionHref || defaultHref;

  return (
    <div
      className={`rounded-3xl border border-dashed border-slate-200 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center text-center transition-all ${
        compact ? "p-6" : "p-8 sm:p-12"
      } ${className}`}
    >
      <div
        className={`rounded-2xl border flex items-center justify-center mb-4 transition-transform hover:scale-105 ${iconBg} ${
          compact ? "w-12 h-12" : "w-16 h-16"
        }`}
      >
        {defaultIcon}
      </div>

      <h3
        className={`font-black text-slate-900 tracking-tight ${
          compact ? "text-base" : "text-xl sm:text-2xl"
        }`}
      >
        {finalTitle}
      </h3>

      {finalDesc && (
        <p
          className={`text-slate-500 max-w-md mx-auto mt-2 leading-relaxed ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {finalDesc}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        {finalAction &&
          (finalHref ? (
            <Link
              href={finalHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
            >
              <span>{finalAction}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              onClick={onAction}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{finalAction}</span>
            </button>
          ))}

        {secondaryActionText && (
          <button
            onClick={onSecondaryAction}
            type="button"
            className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
}
