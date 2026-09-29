import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Felna | Identity & Role-Based Access",
  description: "Felna.com - Unified Authentication, RBAC & Administrative Controls",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#F4F1EA] dark:bg-[#181310]`}
    >
      <body className="min-h-full flex flex-col bg-[#181310] text-[#fcfbf9] selection:bg-[#4a3b32] selection:text-[#fcfbf9]">{children}</body>
    </html>
  );
}
