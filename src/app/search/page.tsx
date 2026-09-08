'use client';
import React, { useState } from 'react';
import { SearchModal } from '@/components/ui/SearchModal';

export default function SearchPage() {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Search Services</h1>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition"
      >
        Open Search
      </button>
      {open && <SearchModal onClose={() => setOpen(false)} />}
    </div>
  );
}
