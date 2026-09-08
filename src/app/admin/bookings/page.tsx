"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminBookingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin?tab=bookings");
  }, [router]);
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Bookings...</div>;
}
