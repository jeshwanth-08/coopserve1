"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountReviewsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/account");
  }, [router]);
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Reviews...</div>;
}
