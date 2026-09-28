"use client";

import React, { Suspense } from "react";
import UnifiedAuthPage from "@/components/auth/UnifiedAuthPage";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full py-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <UnifiedAuthPage initialTab="login" />
    </Suspense>
  );
}
