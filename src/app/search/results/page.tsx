'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { services } from '@/data/services';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { useSearchParams } from 'next/navigation';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase() || '';
  const [results, setResults] = useState<typeof services>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    const timeout = setTimeout(() => {
      const filtered = services.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
      );
      setResults(filtered);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [query]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-8 w-64 bg-slate-200 dark:bg-gray-700 animate-pulse rounded-lg mb-8" />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
              <div className="w-full h-44 bg-slate-200 animate-pulse rounded-xl" />
              <div className="h-5 w-3/4 bg-slate-200 animate-pulse rounded" />
              <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
              <div className="h-10 w-full bg-slate-200 animate-pulse rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-3xl font-black">
          👀
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Nothing useful came up for "{query}"
        </h2>
        <p className="text-sm text-slate-500">
          Try another search term like "AC", "Cleaning", "Plumbing", or explore our popular categories.
        </p>
        <a
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm shadow-md shadow-brand-500/20 hover:bg-brand-700 transition"
        >
          Explore All Services
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-8 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-brand-600">Search Results</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            "{query}"
          </h1>
        </div>
        <span className="text-xs text-slate-400 font-semibold">
          Found {results.length} verified service{results.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-8 w-64 bg-slate-200 animate-pulse rounded-lg mb-8" />
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-slate-200 rounded-2xl p-4 bg-white space-y-3">
                <div className="w-full h-44 bg-slate-200 animate-pulse rounded-xl" />
                <div className="h-5 w-3/4 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-full bg-slate-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <SearchResultsContent />
    </Suspense>
  );
}
