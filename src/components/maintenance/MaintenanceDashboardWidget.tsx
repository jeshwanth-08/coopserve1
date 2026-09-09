"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Wrench,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bell,
  ShieldCheck,
  ArrowRight,
  X,
  Sparkles,
  Zap,
  Info,
  CalendarClock,
} from "lucide-react";
import {
  calculateMaintenanceSchedule,
  ScheduledMaintenanceItem,
  COOP_AMC_PLANS,
  AmcPlan,
} from "@/lib/maintenanceScheduler";

interface MaintenanceDashboardWidgetProps {
  completedRequests: any[];
}

export default function MaintenanceDashboardWidget({
  completedRequests,
}: MaintenanceDashboardWidgetProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [schedule, setSchedule] = useState<ScheduledMaintenanceItem[]>(() =>
    calculateMaintenanceSchedule(completedRequests)
  );
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [snoozedIds, setSnoozedIds] = useState<Record<string, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"schedule" | "amc">("schedule");

  useEffect(() => {
    setMounted(true);
    // Load dismissed & snoozed states from localStorage
    try {
      const savedDismissed = JSON.parse(
        localStorage.getItem("coop_dismissed_reminders") || "[]"
      );
      setDismissedIds(savedDismissed);

      const savedSnoozed = JSON.parse(
        localStorage.getItem("coop_snoozed_reminders") || "{}"
      );
      setSnoozedIds(savedSnoozed);
    } catch {
      // Ignore localStorage read errors
    }

    const calculated = calculateMaintenanceSchedule(completedRequests);
    setSchedule(calculated);
  }, [completedRequests]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      localStorage.setItem("coop_dismissed_reminders", JSON.stringify(updated));
    } catch {}
    showToast("Reminder dismissed. You can still view it in your maintenance schedule.");
  };

  const handleRemindLater = (id: string) => {
    const snoozeUntil = Date.now() + 14 * 24 * 60 * 60 * 1000; // Snooze 14 days
    const updated = { ...snoozedIds, [id]: snoozeUntil };
    setSnoozedIds(updated);
    try {
      localStorage.setItem("coop_snoozed_reminders", JSON.stringify(updated));
    } catch {}
    showToast("Snoozed for 14 days. We'll remind you then!");
  };

  const now = Date.now();

  // Filter active smart reminders only when mounted on client to prevent SSR hydration mismatch:
  // Must be Due Now or Due Soon, not dismissed, and not currently snoozed
  const activeReminders = mounted
    ? schedule.filter((item) => {
        if (dismissedIds.includes(item.id)) return false;
        const snoozedUntil = snoozedIds[item.id];
        if (snoozedUntil && snoozedUntil > now) return false;
        return item.dueStatus === "DUE_NOW" || item.dueStatus === "DUE_SOON";
      })
    : [];

  const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const formatDate = (d: Date | string) => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    if (!dateObj || isNaN(dateObj.getTime())) return "";
    return `${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Smart Household Reminders (Actionable Banner) */}
      {activeReminders.length > 0 && (
        <div className="space-y-3">
          {activeReminders.map((reminder) => {
            const isDueNow = reminder.dueStatus === "DUE_NOW";

            return (
              <div
                key={reminder.id}
                className={`rounded-2xl p-5 border transition-all shadow-sm ${
                  isDueNow
                    ? "bg-amber-50/70 border-amber-200/80 text-amber-950"
                    : "bg-blue-50/70 border-blue-200/80 text-blue-950"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isDueNow
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      }`}
                    >
                      <Bell className="w-5 h-5 animate-pulse" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isDueNow
                              ? "bg-amber-200/80 text-amber-900"
                              : "bg-blue-200/80 text-blue-900"
                          }`}
                        >
                          {isDueNow ? "Maintenance Due" : "Upcoming Window"}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Interval: every {reminder.intervalMonths} months
                        </span>
                        {reminder.seasonalNote && (
                          <span className="text-[10px] bg-white border border-amber-300 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                            {reminder.seasonalNote}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {reminder.reminderHeadline}
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                        {reminder.reason}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Book Now, Remind Me Later, Dismiss */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleDismiss(reminder.id)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                      title="Dismiss this reminder"
                    >
                      Dismiss
                    </button>

                    <button
                      onClick={() => handleRemindLater(reminder.id)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm transition-all"
                    >
                      Remind Me Later
                    </button>

                    <button
                      onClick={() => router.push(reminder.bookUrl)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Main Household Maintenance Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Section Header with Tabs */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CalendarClock className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Smart Household Maintenance & Revisit Scheduler
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated preventive upkeep intervals computed from your completed service history
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "schedule"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              My Maintenance ({schedule.length})
            </button>
            <button
              onClick={() => setActiveTab("amc")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === "amc"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>AMC Plans</span>
            </button>
          </div>
        </div>

        {/* Tab 1: My Maintenance Schedule Table */}
        {activeTab === "schedule" && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                    <th className="pb-3 pl-2">Service</th>
                    <th className="pb-3 px-3">Last Service</th>
                    <th className="pb-3 px-3">Next Reminder</th>
                    <th className="pb-3 px-3">Cycle Interval</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                  {schedule.map((item) => {
                    const isDueNow = item.dueStatus === "DUE_NOW";
                    const isDueSoon = item.dueStatus === "DUE_SOON";

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Service name */}
                        <td className="py-4 pl-2 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>{item.serviceName}</span>
                          </div>
                        </td>

                        {/* Last service */}
                        <td className="py-4 px-3 text-slate-600">
                          {formatDate(item.lastServiceDate)}
                        </td>

                        {/* Next reminder */}
                        <td className="py-4 px-3">
                          <div className="font-semibold text-slate-900">
                            {formatDate(item.nextReminderDate)}
                          </div>
                          {item.seasonalNote && (
                            <span className="text-[10px] text-amber-800 font-bold block">
                              {item.seasonalNote}
                            </span>
                          )}
                        </td>

                        {/* Cycle interval */}
                        <td className="py-4 px-3 text-slate-500">
                          Every {item.intervalMonths} months
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-3">
                          {isDueNow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertCircle className="w-3 h-3 text-amber-700" />
                              <span>Due Now</span>
                            </span>
                          ) : isDueSoon ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                              <Clock className="w-3 h-3 text-blue-600" />
                              <span>Due Soon</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Scheduled</span>
                            </span>
                          )}
                        </td>

                        {/* Action Button */}
                        <td className="py-4 pr-2 text-right">
                          <button
                            onClick={() => router.push(item.bookUrl)}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-blue-600 transition-all shadow-sm active:scale-95"
                          >
                            <span>Book</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Explanatory footer info */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between flex-col sm:flex-row gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>
                  Dates are dynamically projected: <em>Completed Date + Trade Interval = Next Revisit</em>.
                  No bookings are created automatically.
                </span>
              </div>
              <span className="font-semibold text-slate-700">100% Fixed Rates • 30-Day Warranty</span>
            </div>
          </div>
        )}

        {/* Tab 2: Maintenance / AMC Plans Section */}
        {activeTab === "amc" && (
          <div className="p-6 space-y-6">
            <div className="max-w-xl">
              <h3 className="text-base font-bold text-slate-900">
                Cooperative Annual Maintenance Contracts (AMC)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Lock in zero inspection fees, scheduled periodic visits, and guaranteed technician priority all year round.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {COOP_AMC_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                    plan.popular
                      ? "border-blue-500 bg-gradient-to-b from-blue-50/50 to-white shadow-md shadow-blue-500/10"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{plan.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">₹{plan.pricePerYear}</span>
                      <span className="text-xs text-slate-500 font-medium">{plan.billingFrequency}</span>
                    </div>

                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
                      {plan.savings}
                    </span>

                    <ul className="space-y-2 pt-2 text-xs text-slate-600">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    <button
                      onClick={() => router.push(`/book/${plan.serviceId}?amc=${plan.id}`)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                        plan.popular
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
                          : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      <span>Opt for AMC Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center justify-between flex-col sm:flex-row gap-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                AMC plans link directly with CoopServe certified technicians. No automated deductions.
              </span>
              <span className="font-bold text-blue-600">30-Day Money-Back Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
