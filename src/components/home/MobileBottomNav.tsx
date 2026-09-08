"use client";

import React from "react";
import Link from "next/link";
import { Home, Compass, Tag, Calendar, User, Zap } from "lucide-react";

interface MobileBottomNavProps {
  onOpenBooking: () => void;
}

export default function MobileBottomNav({ onOpenBooking }: MobileBottomNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around">
        <Link
          href="/"
          className="flex flex-col items-center py-1 px-2 text-brand-600 font-bold transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 font-bold">Home</span>
        </Link>

        <Link
          href="/services"
          className="flex flex-col items-center py-1 px-2 text-slate-500 hover:text-brand-600 font-medium transition-colors"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Explore</span>
        </Link>

        {/* Floating Quick Book CTA in center */}
        <button
          onClick={onOpenBooking}
          className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-brand-600 to-indigo-600 text-white w-12 h-12 rounded-full shadow-lg shadow-brand-500/35 active:scale-95 transition-transform"
          aria-label="Instant Book"
        >
          <Zap className="w-5 h-5 fill-white text-white" />
        </button>

        <Link
          href="/offers"
          className="flex flex-col items-center py-1 px-2 text-slate-500 hover:text-brand-600 font-medium transition-colors"
        >
          <Tag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Offers</span>
        </Link>

        <Link
          href="/account"
          className="flex flex-col items-center py-1 px-2 text-slate-500 hover:text-brand-600 font-medium transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Profile</span>
        </Link>
      </div>
    </div>
  );
}
