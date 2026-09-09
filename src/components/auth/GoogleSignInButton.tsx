"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";

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

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const callbackUrl =
        returnUrl && !returnUrl.startsWith("/login") && !returnUrl.startsWith("/register")
          ? returnUrl
          : "/member";

      await signIn("google", {
        callbackUrl,
      });
    } catch (err) {
      console.error("[GoogleSignIn] Error initiating Google sign in:", err);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
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
          {/* Blue */}
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          {/* Green */}
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          {/* Yellow */}
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
          />
          {/* Red */}
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
  );
}
