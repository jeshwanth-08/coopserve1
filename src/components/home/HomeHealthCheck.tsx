"use client";

import React, { useState } from "react";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplet,
  Zap,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { POPULAR_SERVICES, ServiceItem } from "@/lib/homeData";

interface HomeHealthCheckProps {
  onOpenBooking: (service: ServiceItem) => void;
}

interface HealthMetric {
  id: string;
  category: string;
  name: string;
  status: "good" | "warning" | "critical";
  statusText: string;
  detail: string;
  recommendedServiceId: string;
  icon: React.ReactNode;
  lastChecked: string;
}

export default function HomeHealthCheck({ onOpenBooking }: HomeHealthCheckProps) {
  const [selectedMetricId, setSelectedMetricId] = useState<string>("plumbing");

  const [metrics, setMetrics] = useState<HealthMetric[]>([
    {
      id: "ac",
      category: "AC & Appliances",
      name: "Air Conditioning",
      status: "good",
      statusText: "✓ Good",
      detail: "Jet pump coil wash done recently. Compressor amp draw is normal.",
      recommendedServiceId: "serv-1",
      icon: <Flame className="w-5 h-5 text-emerald-600" />,
      lastChecked: "Last serviced 60 days ago",
    },
    {
      id: "plumbing",
      category: "Plumbing",
      name: "Taps & Drainage",
      status: "warning",
      statusText: "⚠ Needs attention",
      detail: "Hard water scaling detected on aerators. High risk of drain trap backflow.",
      recommendedServiceId: "serv-6",
      icon: <Droplet className="w-5 h-5 text-amber-500" />,
      lastChecked: "Audit recommended",
    },
    {
      id: "electrical",
      category: "Electrical",
      name: "Wiring & Breakers",
      status: "good",
      statusText: "✓ Good",
      detail: "Earthing voltage is balanced and MCB trips are within safe thresholds.",
      recommendedServiceId: "serv-3",
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      lastChecked: "Checked 3 months ago",
    },
    {
      id: "pest",
      category: "Pest Control",
      name: "Pest Defense",
      status: "warning",
      statusText: "⚠ Needs attention",
      detail: "Quarterly herbal gel shield is overdue. Monsoon moisture fosters kitchen roaches.",
      recommendedServiceId: "serv-4",
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />,
      lastChecked: "120 days since last shield",
    },
    {
      id: "cleaning",
      category: "Cleaning",
      name: "Sanitization & Floor Buff",
      status: "good",
      statusText: "✓ Good",
      detail: "Grout cleanliness is optimal and bathroom scale levels are low.",
      recommendedServiceId: "serv-2",
      icon: <Sparkles className="w-5 h-5 text-emerald-600" />,
      lastChecked: "Deep cleaned 4 weeks ago",
    },
  ]);

  const selectedMetric = metrics.find((m) => m.id === selectedMetricId) || metrics[0];
  const recommendedService =
    POPULAR_SERVICES.find((s) => s.id === selectedMetric.recommendedServiceId) ||
    POPULAR_SERVICES[0];

  const overallHealthScore = Math.round(
    (metrics.filter((m) => m.status === "good").length / metrics.length) * 100
  );

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Smart Preventive Maintenance</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How’s your home doing?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Prevent expensive repairs before they happen with real-time home health diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Overall Home Score
              </span>
              <span className="text-base font-black text-slate-900">
                {overallHealthScore}% Healthy
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm">
              A
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Metrics List */}
          <div className="lg:col-span-6 space-y-3">
            {metrics.map((metric) => {
              const isSelected = selectedMetricId === metric.id;
              const isGood = metric.status === "good";
              return (
                <div
                  key={metric.id}
                  onClick={() => setSelectedMetricId(metric.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 card-hover-effect ${
                    isSelected
                      ? "bg-brand-50/80 border-brand-500 shadow-md"
                      : "bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      {metric.icon}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                        {metric.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{metric.lastChecked}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                        isGood
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-800 border-amber-200 animate-pulse"
                      }`}
                    >
                      {metric.statusText}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Diagnostic Card & Recommended Action */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-slate-900 to-brand-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                    Diagnostic Analysis
                  </span>
                  <h3 className="text-xl font-black text-white">{selectedMetric.name}</h3>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-brand-400" />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedMetric.detail}
                </p>

                <div className="bg-white/5 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Recommended Action:</span>
                  <span className="font-bold text-white text-right truncate max-w-[200px]">
                    {recommendedService.name}
                  </span>
                </div>
              </div>

              {/* Service Quick Card */}
              <div className="bg-white text-slate-900 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={recommendedService.image}
                    alt={recommendedService.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 leading-tight">
                      {recommendedService.name}
                    </h5>
                    <span className="text-xs font-black text-brand-600 block mt-0.5">
                      ₹{recommendedService.price}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenBooking(recommendedService)}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all shrink-0"
                >
                  Book Fix
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
