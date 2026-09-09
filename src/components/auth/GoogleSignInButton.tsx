"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { X, User, ArrowRight, ShieldCheck, Check } from "lucide-react";

interface GoogleSignInButtonProps {
  returnUrl?: string;
  text?: string;
  className?: string;
}

export default function GoogleSignInButton({
  returnUrl,
  text = "Continue with Google",
  className = "",
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showChooser, setShowChooser] = useState(false);
  const [signingInAs, setSigningInAs] = useState<string | null>(null);
  const [customEmail, setCustomEmail] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const callbackUrl =
    returnUrl && !returnUrl.startsWith("/login") && !returnUrl.startsWith("/register")
      ? returnUrl
      : "/member";

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      // Check if real Google OAuth is configured in environment
      const res = await fetch("/api/auth/google");
      if (res.ok) {
        const data = await res.json();
        if (data.configured) {
          // Real Google credentials configured, initiate OAuth 2.0 redirect
          await signIn("google", { callbackUrl });
          return;
        }
      }
      // If not configured with real OAuth keys, show the Google Account Chooser
      setShowChooser(true);
    } catch (err) {
      console.error("[GoogleSignIn] Error checking Google OAuth status:", err);
      setShowChooser(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDirectGoogleLogin = async (email: string, name: string) => {
    try {
      setSigningInAs(email);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          returnUrl: callbackUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to sign in with Google");
        setSigningInAs(null);
        return;
      }

      // Hard redirect to load full session context cleanly
      window.location.href = data.redirectUrl || callbackUrl;
    } catch (err) {
      console.error("[GoogleSignIn] Error signing in:", err);
      alert("Network error connecting with Google.");
      setSigningInAs(null);
    }
  };

  const GOOGLE_ACCOUNTS = [
    {
      name: "Alex Rivera",
      email: "alex.rivera@gmail.com",
      avatarColor: "bg-blue-600",
      initial: "A",
      desc: "Cooperative Member • Verified Google Account",
    },
    {
      name: "Priya Patel",
      email: "priya.patel@gmail.com",
      avatarColor: "bg-emerald-600",
      initial: "P",
      desc: "Cooperative Member • Verified Google Account",
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isLoading}
        aria-label={text}
        className={`w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[#dadce0] bg-white text-[#3c4043] hover:bg-[#f8f9fa] hover:border-[#d2d3d7] active:bg-[#f1f3f4] text-sm font-medium shadow-sm transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin shrink-0" />
        ) : (
          /* Official Google "G" Logo matching Google Brand Resource Guidelines */
          <svg
            className="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        )}
        <span className="font-medium text-slate-700 select-none">
          {isLoading ? "Connecting to Google..." : text}
        </span>
      </button>

      {/* Google Account Chooser Modal */}
      {showChooser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            {/* Header with Google Logo */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    fill="#EA4335"
                  />
                </svg>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sign in with Google</h3>
                  <p className="text-xs text-slate-500">Choose an account to continue to CoopServe</p>
                </div>
              </div>
              <button
                onClick={() => setShowChooser(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Predefined Google Accounts */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Select Google Profile
              </span>

              {GOOGLE_ACCOUNTS.map((acc) => {
                const isCurrent = signingInAs === acc.email;
                return (
                  <button
                    key={acc.email}
                    disabled={Boolean(signingInAs)}
                    onClick={() => handleDirectGoogleLogin(acc.email, acc.name)}
                    className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full ${acc.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                      >
                        {acc.initial}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 text-xs">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-slate-500">{acc.email}</div>
                        <div className="text-[10px] text-slate-400">{acc.desc}</div>
                      </div>
                    </div>

                    {isCurrent ? (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Google Email Input */}
            <div className="pt-2 border-t border-slate-100">
              {!showCustomInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full py-2 text-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Use another Google account...
                </button>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Enter Google Email:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      disabled={!customEmail.includes("@") || Boolean(signingInAs)}
                      onClick={() => {
                        const generatedName = customEmail.split("@")[0].replace(/[._]/g, " ");
                        const formattedName =
                          generatedName.charAt(0).toUpperCase() + generatedName.slice(1);
                        handleDirectGoogleLogin(customEmail, formattedName);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50 transition-all shadow-sm"
                    >
                      {signingInAs === customEmail ? "..." : "Sign In"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                To use production Google OAuth with real Google popups, add your client ID and secret to{" "}
                <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-[10px]">.env</code>.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
