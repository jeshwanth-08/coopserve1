'use client';
import React, { useState, useEffect } from 'react';
import { services } from '@/data/services';

interface SearchModalProps {
  onClose: () => void;
}

const recentSearchesKey = 'coopserve_recent_searches';

export const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<typeof services[0]>>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(recentSearchesKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setRecent(parsed);
      }
    } catch {
      setRecent([]);
    }
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const matches = services.filter(
      s => s.name.toLowerCase().includes(val.toLowerCase()) ||
           s.description.toLowerCase().includes(val.toLowerCase())
    ).slice(0, 6);
    setSuggestions(matches);
  };

  const selectSuggestion = (service: typeof services[0]) => {
    const newRecent = [service.name, ...recent.filter(r => r !== service.name)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem(recentSearchesKey, JSON.stringify(newRecent));
    window.location.href = `/search/results?q=${encodeURIComponent(service.name)}`;
  };

  const hardSuggestions = [
    'AC not cooling',
    'Bathroom cleaning',
    'Tap leaking',
    'Fan not working',
    'Sofa cleaning',
    'Laptop repair',
    'Haircut at home',
    'Deep cleaning',
    'Pest problem',
    'Washing machine repair',
  ];

  const popularSearches = hardSuggestions.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl mx-4 p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">What can we help you with?</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <input
          type="text"
          placeholder="Search services…"
          value={query}
          onChange={handleInput}
          className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {query && suggestions.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Matching Services</h3>
            <ul className="grid grid-cols-1 gap-2.5">
              {suggestions.map(s => (
                <li
                  key={s.id}
                  onClick={() => selectSuggestion(s)}
                  className="cursor-pointer p-3 border border-slate-200 dark:border-gray-700 rounded-xl hover:border-brand-500 hover:bg-brand-50/40 dark:hover:bg-gray-700/60 transition-all flex items-center gap-3.5 group"
                >
                  {s.imageUrl && (
                    <img
                      src={s.imageUrl}
                      alt={s.name}
                      className="w-16 h-16 rounded-lg object-cover shrink-0 shadow-sm group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                        {s.name}
                      </span>
                      <span className="text-sm font-extrabold text-brand-600 shrink-0">
                        ₹{s.price}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                      {s.description}
                    </p>
                    <div className="flex items-center gap-2.5 text-[11px] text-slate-400 mt-1">
                      <span className="text-amber-500 font-bold">★ {s.rating}</span>
                      <span>•</span>
                      <span>{s.duration}</span>
                      <span>•</span>
                      <span>{s.bookings.toLocaleString()}+ bookings</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <section>
            <h3 className="font-medium mb-2">Recent searches</h3>
            {recent.length === 0 ? (
              <p className="text-gray-500">No recent searches</p>
            ) : (
              <ul className="list-disc list-inside">
                {recent.map((r, i) => (
                  <li key={i} className="cursor-pointer hover:underline" onClick={() => window.location.href = `/search/results?q=${encodeURIComponent(r)}`}>{r}</li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h3 className="font-medium mb-2">Popular searches</h3>
            <ul className="list-disc list-inside">
              {popularSearches.map((p, i) => (
                <li key={i} className="cursor-pointer hover:underline" onClick={() => window.location.href = `/search/results?q=${encodeURIComponent(p)}`}>{p}</li>
              ))}
            </ul>
          </section>
        </div>
        <div className="mt-6">
          <h3 className="font-medium mb-2">Category shortcuts</h3>
          <div className="flex flex-wrap gap-2">
            {['AC Repair', 'Home Cleaning', 'Plumbing', 'Electrician', 'Beauty', 'Moving'].map(cat => (
              <button key={cat} onClick={() => window.location.href = `/services/${cat.toLowerCase().replace(/ /g, '-')}`} className="px-3 py-1 bg-brand-600 text-white rounded hover:bg-brand-700 transition">{cat}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
