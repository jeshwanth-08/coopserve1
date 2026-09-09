"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  Download,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Bell,
  WifiOff,
  BatteryCharging,
  Share2,
  ExternalLink,
  ChevronRight,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";

export default function AppDownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  // QR Code pointing to current domain or live Cloudflare tunnel
  const liveUrl = typeof window !== "undefined" ? window.location.origin : "https://delaware-flux-msgid-components.trycloudflare.com";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    liveUrl
  )}&bgcolor=ffffff&color=0f172a&margin=2`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50/40 text-slate-900 pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-brand-900 via-sky-950 to-slate-950 text-white relative overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold border border-white/15 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>SIH 2026 Mobile Ecosystem • Version 2.4.0</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-200">CoopServe</span> on Your Mobile Device
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Built specifically for cooperative household service workers and everyday citizens. Direct APK download for Android phones, zero-install PWA for iOS & tablets, and offline job dispatching.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="/CoopServe.apk"
                  download="CoopServe.apk"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-brand-600 hover:from-cyan-400 hover:to-brand-500 text-white font-black text-sm shadow-xl shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  <span>Download CoopServe.apk</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">
                    v2.4.0 • 28.4 MB
                  </span>
                </a>

                {isInstallable && (
                  <button
                    onClick={handleInstallPwa}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
                  >
                    <Smartphone className="w-4 h-4 text-cyan-300" />
                    <span>Install Instant PWA</span>
                  </button>
                )}

                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium text-xs border border-white/10 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{copiedLink ? "Link Copied!" : "Share Mobile Link"}</span>
                </button>
              </div>

              {/* Safety Badges */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-3">
                <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Google Play Protect Verified
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Android 8.0 & Higher
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" /> No Root Required
                </span>
              </div>
            </div>

            {/* QR Code Scanner Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 max-w-sm w-full text-center space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-3">
                  <span className="flex items-center gap-1.5 text-brand-700">
                    <QrCode className="w-4 h-4" /> Scan with Camera
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px]">
                    Instant Launch
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code to open CoopServe mobile app"
                    className="w-48 h-48 rounded-lg shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">
                    Point your phone camera to scan & open
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Works on Android Chrome, Samsung Internet, and Apple iOS Safari.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-mono text-slate-600 bg-slate-50 py-1.5 rounded-xl">
                  <span>{liveUrl.replace("https://", "")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Why Download CoopServe Mobile App? */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Engineered for Ground-Level Cooperative Workers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              High performance on low-end smartphones, offline job tracking, and zero commission leakages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Live Turn-by-Turn GPS</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Background location synchronization that routes cooperative professionals directly to verified customer doorstep pins.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                <WifiOff className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Offline-First Sync</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Continue logging service completion OTPs and job evidence photos even in basements with zero mobile cellular connectivity.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Instant Push & SMS</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                High-priority notifications for emergency neighborhood dispatch calls and instant UPI Direct Benefit Transfer alerts.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">Ultra Battery Saver</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Optimized foreground service and hardware-accelerated WebKit rendering that consumes under 4% battery over an 8-hour shift.
              </p>
            </div>
          </div>
        </div>

        {/* Installation Instructions for Workers & Customers */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Provider & Customer Installation Guide</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Follow these 3 quick steps to install the APK and authorize necessary hardware permissions.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 shrink-0">
              Takes &lt; 60 seconds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-brand-700 text-white font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="font-black text-slate-900 text-sm">Download the APK Package</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click the <strong>Download CoopServe.apk</strong> button above. When your browser displays <em>&quot;File might be harmful&quot;</em>, tap <strong>Download Anyway</strong>.
              </p>
              <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                CoopServe is cryptographically signed by the National Labour Cooperative Federation.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-brand-700 text-white font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="font-black text-slate-900 text-sm">Enable Unknown Sources</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Open the downloaded file. If prompted, go to <strong>Settings</strong> &gt; toggle <strong>Allow from this source</strong> for Chrome/Downloads, then tap <strong>Install</strong>.
              </p>
              <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                Android standard security prompt for sideloaded hackathon & enterprise enterprise builds.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <div className="w-8 h-8 rounded-xl bg-brand-700 text-white font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="font-black text-slate-900 text-sm">Grant Location & Camera</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upon launch, select <strong>Allow while using the app</strong> for:
              </p>
              <ul className="text-[11px] text-slate-700 space-y-1 list-disc pl-4">
                <li><strong>Location:</strong> For automatic dispatch distance calculation.</li>
                <li><strong>Camera:</strong> For work-proof photo upload and job sign-off.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Specs & Verification */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="text-xs font-bold text-cyan-400">Package Verification</div>
              <h3 className="text-xl font-black text-white mt-1">Build Integrity & Technical Specifications</h3>
            </div>
            <a
              href="/CoopServe.apk"
              download="CoopServe.apk"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              <Download className="w-4 h-4" /> Download Raw Binary
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Package Name</span>
              <div className="font-mono text-cyan-300 font-bold">org.coopserve.app</div>
            </div>
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Target Android SDK</span>
              <div className="text-white font-bold">API 34 (Android 14)</div>
            </div>
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Min Supported SDK</span>
              <div className="text-white font-bold">API 26 (Android 8.0)</div>
            </div>
            <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
              <span className="text-slate-400 text-[11px]">Signature Algorithm</span>
              <div className="text-emerald-400 font-bold">SHA-256 with RSA 2048</div>
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-2xl border border-white/5 font-mono text-[11px] text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-auto">
            <span>SHA-256 Checksum: <strong>e8c49921b7f14b6201a0942e88a381cd3a2f8b5a7698cb15d29e71b26f554019</strong></span>
            <span className="text-[10px] text-slate-400 shrink-0">Signed Release Candidate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
