import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home, LogOut } from "lucide-react";
import LogoutButton from "@/components/common/LogoutButton";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
            HTTP 403 Forbidden
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">Access Denied</h1>
          <p className="text-sm text-slate-500 max-w-xs mx-auto">
            You do not possess the required administrator privileges to view this section.
          </p>
        </div>

        <div className="pt-2 space-y-2.5">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to User Dashboard</span>
          </Link>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>

            <LogoutButton
              variant="compact"
              label="Switch Account"
              redirectTo="/login"
              className="w-full justify-center py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
