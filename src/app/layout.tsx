import type { Metadata } from "next";
import "./globals.css";
import HomeBuddyWidget from "@/components/ai/HomeBuddyWidget";
import AuthProvider from "@/components/providers/AuthProvider";
import { LanguageProvider } from "@/lib/i18nContext";

export const metadata: Metadata = {
  title: "CoopServe - Professional Home Services & Maintenance",
  description: "Community-driven service request and dispatch platform for household and local services",
  icons: {
    icon: "/logo-icon.png",
    shortcut: "/logo-icon.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full max-w-full overflow-x-hidden">
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col antialiased bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <LanguageProvider>
          <AuthProvider>
            {children}
            {/* Global Native AI Assistant: Home Buddy */}
            <HomeBuddyWidget />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
