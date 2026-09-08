"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Star,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building,
  HeartHandshake,
} from "lucide-react";
import StatCard from "@/components/StatCard";

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/analytics");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-slate-500">Compiling cooperative platform analytics...</p>
      </div>
    );
  }

  const { metrics, statusChartData, categoryChartData, visibilitySplit, topProviders } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Cooperative Analytics Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Coordinator HQ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time operations, dispatch metrics, workload distributions, and service performance
          </p>
        </div>

        <Link
          href="/admin/requests"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          <span>Dispatch & Manage Requests</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Service Volume"
          value={metrics.totalRequests}
          subtitle="Requests logged to date"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active Dispatch Queue"
          value={metrics.activeCount}
          subtitle="Pending, assigned, or in work"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Emergency Flags"
          value={metrics.emergencyCount}
          subtitle="Priority emergency calls"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Avg. Resolution Time"
          value={`${metrics.avgResolutionHours} hrs`}
          subtitle="End-to-end service cycle"
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Middle Grid: Category Breakdown & Visibility Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests by Category (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Requests by Service Category</h2>
              <p className="text-xs text-slate-500">Volume distribution across trade disciplines</p>
            </div>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
              {categoryChartData.length} Trades
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryChartData.map((cat: any) => {
              const pct = metrics.totalRequests > 0 ? (cat.count / metrics.totalRequests) * 100 : 0;
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cat.category}</span>
                    <span className="font-mono text-slate-500">
                      {cat.count} requests ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visibility Split (Personal vs Community) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Request Scope Split</h2>
              <p className="text-xs text-slate-500">Personal home repairs vs. society-wide community calls</p>
            </div>

            <div className="py-6 space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">Personal Requests</span>
                  <span className="text-sm font-black text-blue-950">{metrics.personalCount}</span>
                </div>
                <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{
                      width: `${(metrics.personalCount / (metrics.totalRequests || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-blue-700 mt-1 block">
                  {((metrics.personalCount / (metrics.totalRequests || 1)) * 100).toFixed(0)}% of cooperative load
                </span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">Community Requests</span>
                  <span className="text-sm font-black text-emerald-950">{metrics.communityCount}</span>
                </div>
                <div className="mt-2 h-2 bg-emerald-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{
                      width: `${(metrics.communityCount / (metrics.totalRequests || 1)) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[11px] text-emerald-700 mt-1 block">
                  {((metrics.communityCount / (metrics.totalRequests || 1)) * 100).toFixed(0)}% collaborative calls
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
            💡 <strong>Cooperative Insight:</strong> Community requests generate 3.4x more engagement through neighbor co-signing and shared contractor dispatch.
          </div>
        </div>
      </div>

      {/* Bottom Grid: Status Lifecycle Pipeline & Top Rated Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Lifecycle Counts */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Lifecycle Status Breakdown</h2>
            <p className="text-xs text-slate-500">Live operational counts across the state machine</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statusChartData.map((st: any) => (
              <div
                key={st.status}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-center"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {st.status}
                </span>
                <span className="text-xl font-black text-slate-900 mt-1 block">
                  {st.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Providers Leaderboard */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top-Rated Cooperative Specialists</h2>
              <p className="text-xs text-slate-500">Based on verified member reviews & job resolution</p>
            </div>
            <Link
              href="/admin/providers"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              All Providers →
            </Link>
          </div>

          <div className="space-y-2.5">
            {topProviders.map((p: any, idx: number) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">{p.name}</span>
                    <span className="text-[11px] text-slate-400">
                      {p.categories.slice(0, 2).join(", ")} • {p.locality}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{p.avgRating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {p.totalReviews} reviews ({p.totalJobs} jobs)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
