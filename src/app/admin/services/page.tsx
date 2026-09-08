"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminServicesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin?tab=services");
  }, [router]);
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Services...</div>;
}
