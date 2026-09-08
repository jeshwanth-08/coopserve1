import React from "react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Star, MessageSquare, ThumbsUp, ShieldCheck } from "lucide-react";
import StatCard from "@/components/StatCard";

export default async function ProviderRatingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const profile = await prisma.providerProfile.findUnique({
    where: { userId: user.userId },
  });

  const ratings = await prisma.rating.findMany({
    where: { providerId: user.userId },
    include: {
      member: { select: { name: true, locality: true } },
      request: { select: { category: true, description: true, resolvedAt: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate star counts
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratings.forEach((r) => {
    starCounts[r.stars] = (starCounts[r.stars] || 0) + 1;
  });

  const totalReviews = ratings.length;
  const avg = profile?.avgRating || 0.0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ratings & Customer Reviews</h1>
        <p className="text-xs text-slate-500">
          Transparent cooperative feedback from neighborhood members you serviced
        </p>
      </div>

      {/* Summary Scorecard */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Big Avg Rating */}
        <div className="text-center md:border-r border-slate-100 md:pr-6">
          <p className="text-5xl font-black text-slate-900">{avg.toFixed(1)}</p>
          <div className="flex items-center justify-center gap-1 text-amber-500 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-slate-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Based on <strong>{totalReviews}</strong> customer reviews
          </p>
        </div>

        {/* Breakdown Bars (2 Cols) */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((s) => {
            const count = starCounts[s] || 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={s} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-slate-600 font-semibold">{s} stars</span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-slate-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3">
          Customer Feedback History ({ratings.length})
        </h2>

        {ratings.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No reviews received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{r.member.name}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      • {r.member.locality}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px]">
                      {r.request.category}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {r.comment && (
                  <p className="text-slate-700 italic bg-white p-3 rounded-lg border border-slate-200/60">
                    "{r.comment}"
                  </p>
                )}

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Task: {r.request.description.slice(0, 70)}...</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
