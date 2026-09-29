"use client";

import React, { useState } from "react";
import { CmsSiteSettings } from "@prisma/client";
import {
  Save,
  Loader2,
  Clock,
  Headphones,
  Sparkles,
  ExternalLink,
  Building,
  Globe,
  FileText,
  Mail,
  Phone,
  MapPin,
  Eye,
} from "lucide-react";
import CmsImageUploader from "./CmsImageUploader";

interface CmsSettingsTabProps {
  initialSettings: CmsSiteSettings | null;
  onShowToast: (type: "success" | "error", message: string) => void;
}

export default function CmsSettingsTab({ initialSettings, onShowToast }: CmsSettingsTabProps) {
  const [formData, setFormData] = useState({
    siteName: initialSettings?.siteName || "Felna.com",
    siteTagline: initialSettings?.siteTagline || "Carrier-Grade Bulk SMS & OTP Gateway",
    logoUrl: initialSettings?.logoUrl || "",
    announcementText: initialSettings?.announcementText || "Fast & Reliable Bulk SMS Services.",
    announcementLinkText: initialSettings?.announcementLinkText || "Join Now",
    announcementLinkUrl: initialSettings?.announcementLinkUrl || "/register",
    scheduleText: initialSettings?.scheduleText || "9 am to 6 pm [mon-sat]",
    primaryPhone: initialSettings?.primaryPhone || "+880-1958-666999",
    supportEmail: initialSettings?.supportEmail || "support@iglweb.com",
    officeAddress: initialSettings?.officeAddress || "Felna HQ, Dhaka, Bangladesh",
    officeHours: initialSettings?.officeHours || "Sat - Thu: 9:00 AM - 6:00 PM",
    footerAboutText:
      initialSettings?.footerAboutText ||
      "Felna.com is Bangladesh's premier telecom-grade Bulk SMS & OTP verification platform delivering 99.98% carrier delivery with instant REST API integration.",
    copyrightText: initialSettings?.copyrightText || "© Copyright 2007- 2026 Felna.com",
  });

  const [isSaving, setIsSaving] = useState(false);

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/cms/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update site settings.");
        return;
      }

      onShowToast("success", "Site settings updated and cache revalidated successfully!");
    } catch (err) {
      console.error("Save settings error:", err);
      onShowToast("error", "Network error occurred while saving settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ========================================================================= */}
      {/* LIVE TOPBAR & HEADER PREVIEW                                              */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F5B83D]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Live Preview: Public Top Utility Bar & Brand
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Updates live as you type</span>
        </div>

        {/* The Exact Dark TopBar Preview */}
        <div className="bg-[#0e0c0a] text-neutral-400 text-[13px] px-6 py-2.5 border-b border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            {/* Left: Schedule & Support */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F5B83D]" />
                <span>{formData.scheduleText || "9 am to 6 pm [mon-sat]"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-[#F5B83D]" />
                <span className="text-neutral-300 font-medium">
                  {formData.primaryPhone || "+880-1958-666999"}
                </span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-400">{formData.supportEmail || "support@iglweb.com"}</span>
              </div>
            </div>

            {/* Right: Announcement & Link */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-300">{formData.announcementText}</span>
              <span className="text-[#F5B83D] font-bold underline cursor-pointer">
                {formData.announcementLinkText} &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Mini Brand preview */}
        <div className="bg-[#12100E] px-6 py-3 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            {formData.logoUrl ? (
              <div className="h-9 max-w-[160px] flex items-center shrink-0 bg-white/5 p-1 rounded-lg border border-white/10">
                <img
                  src={formData.logoUrl}
                  alt={formData.siteName}
                  className="h-7 w-auto max-h-8 object-contain"
                />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F5B83D] to-[#d99b26] flex items-center justify-center font-bold text-slate-950 text-base shadow-md">
                {formData.siteName ? formData.siteName.charAt(0).toUpperCase() : "F"}
              </div>
            )}
            <div>
              <div className="font-bold text-white text-sm tracking-tight">
                {formData.siteName}
              </div>
              <div className="text-[10px] text-neutral-400 font-medium tracking-wide">
                {formData.siteTagline}
              </div>
            </div>
          </div>
          <span className="text-[11px] text-neutral-400">Live Navbar Brand Header</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: BRAND IDENTITY & LOGO                                          */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Brand Identity</h4>
            <p className="text-xs text-slate-500">Configure public site title and branding tagline</p>
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
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Felna.com"
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
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Carrier-Grade Bulk SMS & OTP Gateway"
            />
          </div>

          <div className="md:col-span-2">
            <CmsImageUploader
              label="Custom Logo Image (Optional)"
              value={formData.logoUrl}
              onChange={(url) => handleChange("logoUrl", url)}
              placeholder="Leave empty to use the sleek CSS-based monogram F"
              helperText="If omitted, the navbar will display the modern Amber monogram 'F' logo."
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: TOP UTILITY BAR & ANNOUNCEMENT                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Top Utility Bar & Notice</h4>
            <p className="text-xs text-slate-500">
              Manage the top utility banner announcement message and support schedule
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Announcement Message <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.announcementText.length} / 250 characters
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={250}
              value={formData.announcementText}
              onChange={(e) => handleChange("announcementText", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Fast & Reliable Bulk SMS Services."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Action Link Text
            </label>
            <input
              type="text"
              value={formData.announcementLinkText}
              onChange={(e) => handleChange("announcementLinkText", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Join Now"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Action Link Destination (URL)
            </label>
            <input
              type="text"
              value={formData.announcementLinkUrl}
              onChange={(e) => handleChange("announcementLinkUrl", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="/register or https://..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Operating Schedule Text
            </label>
            <input
              type="text"
              value={formData.scheduleText}
              onChange={(e) => handleChange("scheduleText", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="9 am to 6 pm [mon-sat]"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: CONTACT & OFFICE DETAILS                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Contact & Support Details</h4>
            <p className="text-xs text-slate-500">Public phone number, email hotline, and headquarters address</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Hotline Phone <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.primaryPhone}
              onChange={(e) => handleChange("primaryPhone", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="+880-1958-666999"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Support Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.supportEmail}
              onChange={(e) => handleChange("supportEmail", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="support@iglweb.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Headquarters / Office Address
            </label>
            <input
              type="text"
              value={formData.officeAddress}
              onChange={(e) => handleChange("officeAddress", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Felna HQ, Dhaka, Bangladesh"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Office Hours
            </label>
            <input
              type="text"
              value={formData.officeHours}
              onChange={(e) => handleChange("officeHours", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Sat - Thu: 9:00 AM - 6:00 PM"
            />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: FOOTER ABOUT & COPYRIGHT                                       */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Footer Content & Copyright</h4>
            <p className="text-xs text-slate-500">Overview narrative for footer and copyright disclaimer</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Footer "About Company" Narrative <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.footerAboutText.length} characters
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={formData.footerAboutText}
              onChange={(e) => handleChange("footerAboutText", e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition resize-y"
              placeholder="Enter comprehensive company description for the footer..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Copyright Text <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.copyrightText}
              onChange={(e) => handleChange("copyrightText", e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="© Copyright 2007- 2026 Felna.com"
            />
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="sticky bottom-4 z-20 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-[#F5B83D]" />
          <span>Publishing revalidates on-demand ISR cache instantly for all users.</span>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F5B83D] hover:bg-[#e0a42e] text-slate-950 flex items-center gap-2 transition shadow-md disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Publish Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
