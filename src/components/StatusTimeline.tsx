import React from "react";
import { CheckCircle2, Circle, Clock, XCircle, ArrowRight } from "lucide-react";
import { STATUS_CONFIG, RequestStatus } from "@/lib/constants";

interface HistoryEntry {
  id: string;
  status: string;
  changedBy: {
    name: string;
    role: string;
  };
  changedAt: string | Date;
  note?: string | null;
}

interface StatusTimelineProps {
  currentStatus: string;
  history: HistoryEntry[];
}

export default function StatusTimeline({ currentStatus, history }: StatusTimelineProps) {
  const isTerminalNegative = currentStatus === "CANCELLED" || currentStatus === "DECLINED";

  const standardSteps: { key: RequestStatus; label: string }[] = [
    { key: "PENDING", label: "Requested" },
    { key: "ASSIGNED", label: "Assigned" },
    { key: "ACCEPTED", label: "Accepted" },
    { key: "ON_THE_WAY", label: "On The Way" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "RESOLVED", label: "Resolved" },
  ];

  const currentConfig = STATUS_CONFIG[currentStatus as RequestStatus];
  const currentStepNum = currentConfig ? currentConfig.step : 0;

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Request Progress & History</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-source-of-truth status tracking and immutable cooperative audit trail
          </p>
        </div>
        <div className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-700">
          Status: <span className="font-bold">{currentStatus}</span>
        </div>
      </div>

      {/* Visual horizontal stepper for desktop */}
      {!isTerminalNegative ? (
        <div className="hidden md:flex items-center justify-between relative px-2 py-4">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 -translate-y-1/2 bg-slate-200 -z-0" />
          {standardSteps.map((step) => {
            const stepConfig = STATUS_CONFIG[step.key];
            const isCompleted = currentStepNum >= stepConfig.step;
            const isCurrent = currentStatus === step.key;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-slate-400 border-2 border-slate-300"
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4 animate-spin-slow" />
                  ) : (
                    <Circle className="w-3 h-3 text-slate-300" />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 text-center font-medium ${
                    isCurrent
                      ? "text-blue-600 font-bold"
                      : isCompleted
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="text-sm">
            <span className="font-semibold text-rose-900">
              Request {currentStatus === "CANCELLED" ? "Cancelled" : "Declined"}
            </span>
            <p className="text-rose-700 text-xs mt-0.5">
              {currentStatus === "CANCELLED"
                ? "This request was cancelled by the member before assignment."
                : "The assigned provider was unable to accept this call. The coordinator will reassign shortly."}
            </p>
          </div>
        </div>
      )}

      {/* Detailed Chronological Audit Log */}
      <div className="mt-4 pt-2">
        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Audit Activity Log
        </h4>
        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {history.map((entry) => (
            <div key={entry.id} className="relative pl-8 text-sm">
              <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs px-2 py-0.5 rounded bg-white border border-slate-200">
                      {entry.status}
                    </span>
                    <span className="text-xs text-slate-600">
                      by <strong className="text-slate-800">{entry.changedBy?.name}</strong>{" "}
                      <span className="text-slate-400 font-mono">({entry.changedBy?.role})</span>
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(entry.changedAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {entry.note && (
                  <p className="text-xs text-slate-600 mt-1 bg-white p-2 rounded border border-slate-100">
                    "{entry.note}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
