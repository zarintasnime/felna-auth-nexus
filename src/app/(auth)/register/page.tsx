"use client";

import React, { Suspense } from "react";
import UnifiedAuthPage from "@/components/auth/UnifiedAuthPage";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f0e6] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4a3b32]" />
        </div>
      }
    >
      <UnifiedAuthPage initialTab="register" />
    </Suspense>
  );
}
