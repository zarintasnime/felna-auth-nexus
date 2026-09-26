"use client";

import React, { Suspense } from "react";
import UnifiedAuthPage from "@/components/auth/UnifiedAuthPage";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <UnifiedAuthPage initialTab="login" />
    </Suspense>
  );
}
