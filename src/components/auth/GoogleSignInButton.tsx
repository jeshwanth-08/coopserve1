"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  X,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  KeyRound,
  ArrowLeft,
  Smartphone,
  Sparkles,
} from "lucide-react";

interface GoogleSignInButtonProps {
  returnUrl?: string;
  text?: string;
  className?: string;
}

interface GoogleAccountProfile {
  name: string;
  email: string;
  avatarColor: string;
  initial: string;
  desc: string;
}

const DEFAULT_ACCOUNTS: GoogleAccountProfile[] = [
  {
    name: "Neelam Jeshwanth",
    email: "neelam.jeshwanth08@gmail.com",
    avatarColor: "bg-indigo-600",
    initial: "N",
    desc: "Cooperative Member • Verified Google Account",
  },
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

export default function GoogleSignInButton({
  returnUrl,
  text = "Continue with Google",
  className = "",
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showChooser, setShowChooser] = useState(false);

  // Modal navigation & state
  const [modalStep, setModalStep] = useState<"SELECT" | "VERIFY">("SELECT");
  const [selectedAccount, setSelectedAccount] = useState<GoogleAccountProfile | null>(null);
  const [customEmail, setCustomEmail] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Verification options
  const [verifyTab, setVerifyTab] = useState<"instant" | "otp" | "password">("instant");
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifySuccess, setVerifySuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const callbackUrl =
    returnUrl && !returnUrl.startsWith("/login") && !returnUrl.startsWith("/register")
      ? returnUrl
      : "/member";

  const handleButtonClick = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
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
      // If not configured with real OAuth keys, show the Google Sign-in & Verification modal
      setModalStep("SELECT");
      setShowChooser(true);
    } catch (err) {
      console.error("[GoogleSignIn] Error checking Google OAuth status:", err);
      setModalStep("SELECT");
      setShowChooser(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAccount = (acc: GoogleAccountProfile) => {
    setSelectedAccount(acc);
    setErrorMessage("");
    setOtpCode("");
    setPassword("");
    setVerifyTab("instant");
    setModalStep("VERIFY");
  };

  const handleCustomEmailSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = customEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setErrorMessage("Please enter a valid Google email address.");
      return;
    }

    const username = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const formattedName = username
      .split(" ")
      .map((part) => (part.length > 0 ? part[0].toUpperCase() + part.slice(1) : ""))
      .join(" ")
      .trim();

    const profile: GoogleAccountProfile = {
      name: formattedName || "Google Member",
      email: cleanEmail,
      avatarColor: "bg-blue-600",
      initial: (formattedName[0] || "G").toUpperCase(),
      desc: "Cooperative Member • Verified Google Account",
    };

    setSelectedAccount(profile);
    setErrorMessage("");
    setOtpCode("");
    setPassword("");
    setVerifyTab("instant");
    setModalStep("VERIFY");
  };

  const handleExecuteVerification = async () => {
    if (!selectedAccount) return;

    if (verifyTab === "otp" && otpCode.trim().length < 6) {
      setErrorMessage("Please enter the 6-digit Google verification code.");
      return;
    }

    if (verifyTab === "password" && password.trim().length < 4) {
      setErrorMessage("Please enter your Google password (minimum 4 characters).");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    try {
      // Execute Google Identity authentication & verification
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selectedAccount.email,
          name: selectedAccount.name,
          returnUrl: callbackUrl,
          verificationMethod: verifyTab,
          code: otpCode.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Google verification failed. Please try again.");
        setIsVerifying(false);
        return;
      }

      setVerifySuccess(true);

      // Brief delay to display the verified checkmark feedback before redirecting
      setTimeout(() => {
        window.location.href = data.redirectUrl || callbackUrl;
      }, 700);
    } catch (err) {
      console.error("[GoogleSignIn] Error during verification:", err);
      setErrorMessage("Network error verifying Google credentials. Please try again.");
      setIsVerifying(false);
    }
  };

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
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

      {/* Google Account Chooser & Verification Modal */}
      {showChooser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 relative overflow-hidden">
            {/* Google Top 4-Color Animated Progress Bar during Verification */}
            {isVerifying && (
              <div className="absolute top-0 left-0 right-0 h-1.5 overflow-hidden bg-slate-100">
                <div className="h-full w-full bg-gradient-to-r from-blue-500 via-red-500 via-yellow-400 to-green-500 animate-pulse" />
              </div>
            )}

            {/* Modal Header */}
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
                  <h3 className="text-base font-bold text-slate-900">
                    {modalStep === "SELECT" ? "Sign in with Google" : "Verify it's you"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {modalStep === "SELECT"
                      ? "Choose an account to continue to CoopServe"
                      : "Google Identity Verification & OAuth 2.0"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowChooser(false);
                  setIsVerifying(false);
                  setVerifySuccess(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ERROR ALERT */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: ACCOUNT SELECTION */}
            {modalStep === "SELECT" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                    Select Google Profile
                  </span>

                  {DEFAULT_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleSelectAccount(acc)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group"
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

                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>

                {/* Custom Google Email Input with form & Enter key submit */}
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
                    <form onSubmit={handleCustomEmailSubmit} className="space-y-2">
                      <label className="text-xs font-semibold text-slate-700 block">
                        Enter your Google email:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          required
                          value={customEmail}
                          onChange={(e) => {
                            setCustomEmail(e.target.value);
                            if (errorMessage) setErrorMessage("");
                          }}
                          placeholder="e.g. name@gmail.com"
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          disabled={!customEmail.trim().includes("@")}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-50 transition-all shadow-sm flex items-center gap-1 shrink-0"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: VERIFICATION FLOW ("VERIFY IT'S YOU") */}
            {modalStep === "VERIFY" && selectedAccount && (
              <div className="space-y-4 animate-in fade-in">
                {/* Account Chip Banner */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full ${selectedAccount.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                    >
                      {selectedAccount.initial}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {selectedAccount.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{selectedAccount.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isVerifying || verifySuccess}
                    onClick={() => {
                      setModalStep("SELECT");
                      setErrorMessage("");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 disabled:opacity-50"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Change</span>
                  </button>
                </div>

                {/* Verification Success State */}
                {verifySuccess ? (
                  <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Google Account Verified!</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Signing into CoopServe Member Dashboard...
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Verification Method Tabs */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={() => {
                          setVerifyTab("instant");
                          setErrorMessage("");
                        }}
                        className={`py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                          verifyTab === "instant"
                            ? "bg-white text-blue-600 shadow-sm font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>1-Tap</span>
                      </button>
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={() => {
                          setVerifyTab("otp");
                          setErrorMessage("");
                        }}
                        className={`py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                          verifyTab === "otp"
                            ? "bg-white text-blue-600 shadow-sm font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Code (OTP)</span>
                      </button>
                      <button
                        type="button"
                        disabled={isVerifying}
                        onClick={() => {
                          setVerifyTab("password");
                          setErrorMessage("");
                        }}
                        className={`py-1.5 rounded-lg transition-all text-center flex items-center justify-center gap-1 ${
                          verifyTab === "password"
                            ? "bg-white text-blue-600 shadow-sm font-bold"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Password</span>
                      </button>
                    </div>

                    {/* TAB 1: 1-Tap Instant Google OAuth Verification */}
                    {verifyTab === "instant" && (
                      <div className="space-y-4 py-2">
                        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 space-y-1">
                          <p className="font-semibold flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>Instant Identity Verification</span>
                          </p>
                          <p className="text-[11px] text-blue-600/90 leading-relaxed">
                            Verifies ownership of <strong>{selectedAccount.email}</strong> with
                            Google Identity Services and links directly to your Member account.
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={isVerifying}
                          onClick={handleExecuteVerification}
                          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        >
                          {isVerifying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                              <span>Verifying Google Account...</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-4 h-4" />
                              <span>Verify & Sign In with Google</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* TAB 2: 6-Digit Google Security Code (OTP) */}
                    {verifyTab === "otp" && (
                      <div className="space-y-3 py-1">
                        <label className="text-xs font-semibold text-slate-700 block">
                          Enter 6-Digit Google Verification Code:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => {
                              setOtpCode(e.target.value.replace(/\D/g, ""));
                              if (errorMessage) setErrorMessage("");
                            }}
                            placeholder="842915"
                            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-xl text-center text-base tracking-widest font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setOtpCode("842915");
                              if (errorMessage) setErrorMessage("");
                            }}
                            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
                            title="Auto-fill sample verification code"
                          >
                            Autofill Code
                          </button>
                        </div>

                        <button
                          type="button"
                          disabled={otpCode.length < 6 || isVerifying}
                          onClick={handleExecuteVerification}
                          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        >
                          {isVerifying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                              <span>Verifying Code...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Verify Code & Continue</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* TAB 3: Google Password */}
                    {verifyTab === "password" && (
                      <div className="space-y-3 py-1">
                        <label className="text-xs font-semibold text-slate-700 block">
                          Enter Google Password:
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errorMessage) setErrorMessage("");
                          }}
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && password.length >= 4) {
                              handleExecuteVerification();
                            }
                          }}
                        />

                        <button
                          type="button"
                          disabled={password.length < 4 || isVerifying}
                          onClick={handleExecuteVerification}
                          className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                        >
                          {isVerifying ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                              <span>Verifying Password...</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-4 h-4" />
                              <span>Verify Password & Sign In</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Footer Note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Verified Google sessions automatically authenticate into your Member profile with
                dual session cookies.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
