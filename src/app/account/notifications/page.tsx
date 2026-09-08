"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AccountNotificationsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/notifications");
  }, [router]);
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Redirecting to Notifications...</div>;
}
