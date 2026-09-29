import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
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
      <body className="min-h-full flex flex-col bg-[#F4F1EA] dark:bg-[#181310] text-[#2C2520] dark:text-[#fcfbf9] selection:bg-[#D49624]/25 dark:selection:bg-[#4a3b32] selection:text-[#2C2520] dark:selection:text-[#fcfbf9]">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
