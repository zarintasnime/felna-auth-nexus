"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Building,
  Globe,
  Clock,
  Headphones,
  ShieldCheck,
  RefreshCw,
  Eye,
} from "lucide-react";
import CmsImageUploader from "../cms/CmsImageUploader";

export default function AdminSettingsClient() {
  const [formData, setFormData] = useState({
    siteName: "Felna.com",
    siteTagline: "Carrier-Grade Bulk SMS & OTP Gateway",
    logoUrl: "",
    announcementText: "Fast & Reliable Bulk SMS Services.",
    announcementLinkText: "Join Now",
    announcementLinkUrl: "/register",
    scheduleText: "9 am to 6 pm [mon-sat]",
    primaryPhone: "+880-1958-666999",
    supportEmail: "support@iglweb.com",
    officeAddress: "Felna HQ, Dhaka, Bangladesh",
    officeHours: "Sat - Thu: 9:00 AM - 6:00 PM",
    footerAboutText:
      "Felna.com is Bangladesh's premier telecom-grade Bulk SMS & OTP verification platform delivering 99.98% carrier delivery with instant REST API integration.",
    copyrightText: "© Copyright 2007- 2026 Felna.com",
  });

  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function showToast(type: "success" | "error", text: string) {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4500);
  }

  async function loadSettings() {
    try {
      setIsLoading(true);
      const res = await fetch("/api/admin/settings");
      const json = await res.json();

      if (json.success && json.data) {
        if (json.data.settings) {
          setFormData((prev) => ({
            ...prev,
            ...json.data.settings,
            logoUrl: json.data.settings.logoUrl || "",
          }));
        }
        if (json.data.systemInfo) {
          setSystemInfo(json.data.systemInfo);
        }
      } else {
        showToast("error", json.error || "Failed to load settings.");
      }
    } catch {
      showToast("error", "Network error loading system settings.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        showToast("error", json.error || "Failed to update settings.");
        return;
      }

      showToast("success", "System & site settings saved successfully!");
    } catch {
      showToast("error", "Network error saving settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-sm shadow-sm ${
            toast.type === "success"
              ? "bg-emerald-100/90 border-emerald-200 text-emerald-800"
              : "bg-rose-100/90 border-rose-200 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-sky-600" />
            <span>System Settings</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure global website parameters, brand assets, contact points, and security policies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadSettings}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 shadow-xs transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 text-[#F5B83D]" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F5B83D]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Live Preview: Top Utility Bar &amp; Navbar Header
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Updates dynamically</span>
        </div>

        {/* Top utility bar preview */}
        <div className="bg-[#0e0c0a] text-neutral-400 text-[13px] px-6 py-2.5 border-b border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F5B83D]" />
                <span>{formData.scheduleText}</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-[#F5B83D]" />
                <span className="text-neutral-300 font-medium">{formData.primaryPhone}</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-400">{formData.supportEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-300">{formData.announcementText}</span>
              <span className="text-[#F5B83D] font-bold underline cursor-pointer">
                {formData.announcementLinkText} &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Navbar brand preview */}
        <div className="bg-[#12100E] px-6 py-3.5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            {formData.logoUrl ? (
              <img
                src={formData.logoUrl}
                alt="Logo Preview"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5B83D] to-[#d99b26] flex items-center justify-center font-bold text-slate-950 text-base shadow-md">
                {formData.siteName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="font-bold text-white text-sm tracking-tight">
                {formData.siteName}
                <span className="text-[#F5B83D]">.</span>
              </div>
              <div className="text-[10px] text-neutral-400 font-medium tracking-wide">
                {formData.siteTagline}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400">Public Navbar Brand Header</span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Brand & Logo */}
        <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Brand Identity &amp; Logo</h3>
              <p className="text-xs text-slate-500">Configure public site title, slogan, and custom logo image</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Site Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.siteName}
                onChange={(e) => handleChange("siteName", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Brand Tagline
              </label>
              <input
                type="text"
                value={formData.siteTagline}
                onChange={(e) => handleChange("siteTagline", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div className="md:col-span-2">
              <CmsImageUploader
                label="Custom Logo Image"
                value={formData.logoUrl}
                onChange={(url) => handleChange("logoUrl", url)}
                placeholder="Upload logo file or paste image URL"
                helperText="Upload your custom logo image. If left blank, the website automatically displays the sleek CSS Amber monogram 'F'."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Top Utility Bar */}
        <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Utility Bar &amp; Announcement</h3>
              <p className="text-xs text-slate-500">Notice text, action link, and operating schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Announcement Message <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.announcementText}
                onChange={(e) => handleChange("announcementText", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Action Link Text <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.announcementLinkText}
                onChange={(e) => handleChange("announcementLinkText", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Action Link Destination <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.announcementLinkUrl}
                onChange={(e) => handleChange("announcementLinkUrl", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Schedule Display <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.scheduleText}
                onChange={(e) => handleChange("scheduleText", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Contact & HQ Operations */}
        <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Contact &amp; Operations</h3>
              <p className="text-xs text-slate-500">Customer care lines, official email, and corporate location</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Direct Phone Hotline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.primaryPhone}
                onChange={(e) => handleChange("primaryPhone", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Support Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.supportEmail}
                onChange={(e) => handleChange("supportEmail", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Office Address
              </label>
              <input
                type="text"
                value={formData.officeAddress}
                onChange={(e) => handleChange("officeAddress", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Working Hours
              </label>
              <input
                type="text"
                value={formData.officeHours}
                onChange={(e) => handleChange("officeHours", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Security Architecture Specifications */}
        {systemInfo && (
          <div className="bg-white rounded-2xl border border-slate-300/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Security Architecture &amp; Controls</h3>
                <p className="text-xs text-slate-500">Live operational runtime defenses</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Database Architecture</span>
                <p className="font-semibold text-slate-800">{systemInfo.databaseProvider}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">JWT Session Lifetime</span>
                <p className="font-semibold text-slate-800">{systemInfo.jwtExpiry}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">OTP Token Expiration</span>
                <p className="font-semibold text-slate-800">{systemInfo.otpExpiry}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Max Failed Attempts Before Lock</span>
                <p className="font-semibold text-slate-800">{systemInfo.maxAttempts} Attempts</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Anti-Spam Rate Limit</span>
                <p className="font-semibold text-slate-800">{systemInfo.rateLimitWindow}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Environment Runtime</span>
                <p className="font-semibold text-slate-800 uppercase">{systemInfo.nodeEnv}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-[#F5B83D]" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
