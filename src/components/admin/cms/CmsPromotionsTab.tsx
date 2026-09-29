"use client";

import React, { useState } from "react";
import { CmsPromotionalSection } from "@prisma/client";
import {
  Save,
  Loader2,
  Sparkles,
  Eye,
  Megaphone,
  Radio,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import CmsImageUploader from "./CmsImageUploader";

interface CmsPromotionsTabProps {
  initialPromotions: CmsPromotionalSection[];
  onShowToast: (type: "success" | "error", message: string) => void;
}

export default function CmsPromotionsTab({
  initialPromotions,
  onShowToast,
}: CmsPromotionsTabProps) {
  const [promotions, setPromotions] = useState<CmsPromotionalSection[]>(initialPromotions);

  // Active section key: "bulk_sms_offer" | "marketing_section"
  const [activeKey, setActiveKey] = useState<string>("bulk_sms_offer");
  const [isSaving, setIsSaving] = useState(false);

  const currentSection =
    promotions.find((p) => p.sectionKey === activeKey) || {
      id: "temp",
      sectionKey: activeKey,
      badge: activeKey === "bulk_sms_offer" ? "BULK SMS OFFER" : "GROWTH STRATEGY",
      title: "",
      subtitle: "",
      description: "",
      imageUrl: "",
      ctaText: "Learn More",
      ctaUrl: "#",
      isActive: true,
      updatedAt: new Date(),
    };

  const [formData, setFormData] = useState({
    badge: currentSection.badge || "",
    title: currentSection.title,
    subtitle: currentSection.subtitle || "",
    description: currentSection.description || "",
    imageUrl: currentSection.imageUrl || "",
    ctaText: currentSection.ctaText || "Learn More",
    ctaUrl: currentSection.ctaUrl || "#",
    isActive: currentSection.isActive,
  });

  // Switch between tabs
  function handleSelectSection(key: string) {
    setActiveKey(key);
    const target = promotions.find((p) => p.sectionKey === key);
    if (target) {
      setFormData({
        badge: target.badge || "",
        title: target.title,
        subtitle: target.subtitle || "",
        description: target.description || "",
        imageUrl: target.imageUrl || "",
        ctaText: target.ctaText || "Learn More",
        ctaUrl: target.ctaUrl || "#",
        isActive: target.isActive,
      });
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        sectionKey: activeKey,
        ...formData,
      };

      const res = await fetch("/api/admin/cms/promotions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        onShowToast("error", json.error || "Failed to update promotional block.");
        return;
      }

      setPromotions((prev) =>
        prev.map((p) => (p.sectionKey === activeKey ? json.data : p))
      );
      onShowToast("success", `Section "${activeKey}" updated & ISR cache refreshed!`);
    } catch {
      onShowToast("error", "Error saving promotional section.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. SECTION SELECTOR PILLS                                                 */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleSelectSection("bulk_sms_offer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeKey === "bulk_sms_offer"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-[#F5B83D]" />
          <span>Section 1: Bulk SMS Offer Block</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectSection("marketing_section")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeKey === "marketing_section"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Megaphone className="w-3.5 h-3.5 text-sky-400" />
          <span>Section 2: Marketing & Growth Strategy</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE SECTION PREVIEW                                                   */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F5B83D]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Live Preview: {activeKey === "bulk_sms_offer" ? "Bulk SMS Offer" : "Marketing Section"}
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Public visual preview</span>
        </div>

        {/* Mock Section Container */}
        <div className="bg-slate-950 p-6 sm:p-8 text-white">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-3 text-left">
              {formData.badge && (
                <span className="inline-block px-3 py-1 rounded-full bg-[#F5B83D]/15 border border-[#F5B83D]/30 text-[#F5B83D] text-[10px] font-bold tracking-wider uppercase">
                  {formData.badge}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                {formData.title || "Section Title Goes Here"}
              </h3>
              {formData.subtitle && (
                <p className="text-xs font-semibold text-neutral-300">
                  {formData.subtitle}
                </p>
              )}
              <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                {formData.description || "Description preview goes here..."}
              </p>
              {formData.ctaText && (
                <button
                  type="button"
                  className="mt-2 px-4 py-2 rounded-xl bg-[#F5B83D] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <span>{formData.ctaText}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {formData.imageUrl && (
              <div className="w-full md:w-64 h-44 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0">
                <img
                  src={formData.imageUrl}
                  alt="Section preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PROMOTIONAL BLOCK FORM                                                 */}
      {/* ========================================================================= */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Editing: {activeKey === "bulk_sms_offer" ? "Bulk SMS Offer Block" : "Marketing Section"}
            </h4>
            <p className="text-xs text-slate-500">Edit badges, headings, marketing copy, and media</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="promo-is-active"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
            />
            <label htmlFor="promo-is-active" className="text-xs font-semibold text-slate-700">
              Section Active
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Badge Tagline
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="e.g. BULK SMS OFFER"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Primary Heading <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">{formData.title.length} chars</span>
            </div>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="e.g. Fast & Reliable Bulk SMS Services In Bangladesh"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subtitle / Lead-in Text
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Lead tagline..."
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Main Body Copy / Description
              </label>
              <span className="text-[11px] text-slate-400">
                {formData.description.length} characters
              </span>
            </div>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Detailed marketing narrative..."
            />
          </div>

          <div className="md:col-span-2">
            <CmsImageUploader
              label="Accompanying Section Image / Illustration"
              value={formData.imageUrl}
              onChange={(url) => setFormData((prev) => ({ ...prev, imageUrl: url }))}
              placeholder="https://... or upload PNG/JPG"
              helperText="Image displayed alongside or as background for this promotional block."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              CTA Button Label
            </label>
            <input
              type="text"
              value={formData.ctaText}
              onChange={(e) => setFormData((prev) => ({ ...prev, ctaText: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="Learn More"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              CTA Button Destination (URL / Anchor)
            </label>
            <input
              type="text"
              value={formData.ctaUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, ctaUrl: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
              placeholder="#pricing or /register"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#F5B83D] hover:bg-[#e0a42e] text-slate-950 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Section Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
