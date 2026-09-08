"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPaymentsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin?tab=payments");
  }, [router]);
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Payments...</div>;
}
