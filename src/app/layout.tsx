import type { Metadata } from "next";
import "./globals.css";
import HomeBuddyWidget from "@/components/ai/HomeBuddyWidget";

export const metadata: Metadata = {
  title: "CoopServe - Professional Home Services & Maintenance",
  description: "Community-driven service request and dispatch platform for household and local services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full w-full max-w-full overflow-x-hidden">
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col antialiased bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        {children}
        {/* Global Native AI Assistant: Home Buddy */}
        <HomeBuddyWidget />
      </body>
    </html>
  );
}
