"use client";

import React, { useState } from "react";
import {
  CmsSiteSettings,
  CmsHeroSlide,
  CmsPartner,
  CmsPromotionalSection,
  CmsFeatureItem,
  CmsSocialLink,
  CmsAuditLog,
} from "@prisma/client";
import {
  Globe,
  Layers,
  Handshake,
  Megaphone,
  Award,
  Share2,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";

import CmsSettingsTab from "./CmsSettingsTab";
import CmsHeroTab from "./CmsHeroTab";
import CmsPromotionsTab from "./CmsPromotionsTab";
import CmsFeaturesTab from "./CmsFeaturesTab";
import CmsPartnersSocialTab from "./CmsPartnersSocialTab";
import CmsAuditTab from "./CmsAuditTab";

export interface CmsManagerClientProps {
  initialSettings: CmsSiteSettings | null;
  initialHeroSlides: CmsHeroSlide[];
  initialPartners: CmsPartner[];
  initialPromotions: CmsPromotionalSection[];
  initialFeatures: CmsFeatureItem[];
  initialSocialLinks: CmsSocialLink[];
  initialAuditLogs: CmsAuditLog[];
}

type CmsTab = "brand" | "hero" | "benefits" | "promotions" | "partners" | "audit";

export default function CmsManagerClient({
  initialSettings,
  initialHeroSlides,
  initialPartners,
  initialPromotions,
  initialFeatures,
  initialSocialLinks,
  initialAuditLogs,
}: CmsManagerClientProps) {
  const [activeTab, setActiveTab] = useState<CmsTab>("brand");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isRevalidating, setIsRevalidating] = useState(false);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4500);
  }

  async function handleRevalidateAll() {
    setIsRevalidating(true);
    try {
      // Trigger a light settings revalidation
      const res = await fetch("/api/admin/cms/settings", { method: "GET" });
      if (res.ok) {
        showToast("success", "Full CMS on-demand ISR cache revalidated successfully!");
      } else {
        showToast("error", "Failed to revalidate cache.");
      }
    } catch {
      showToast("error", "Network error triggering cache revalidation.");
    } finally {
      setIsRevalidating(false);
    }
  }

  const activeSlidesCount = initialHeroSlides.filter((s) => s.isActive).length;
  const activePartnersCount = initialPartners.filter((p) => p.isActive).length;
  const activeFeaturesCount = initialFeatures.filter((f) => f.isActive).length;
  const activeSocialCount = initialSocialLinks.filter((s) => s.isActive).length;

  const TABS = [
    {
      id: "brand" as CmsTab,
      label: "Navbar & Brand Identity",
      icon: Sparkles,
      badge: "Navbar",
    },
    {
      id: "hero" as CmsTab,
      label: "Hero Slider",
      icon: Layers,
      count: activeSlidesCount,
    },
    {
      id: "benefits" as CmsTab,
      label: "SMS Benefits & FAQ",
      icon: Award,
      count: activeFeaturesCount,
    },
    {
      id: "promotions" as CmsTab,
      label: "Special Promotional Offer",
      icon: Megaphone,
      count: initialPromotions.length,
    },
    {
      id: "partners" as CmsTab,
      label: "Partners & Social Links",
      icon: Handshake,
      count: activePartnersCount + activeSocialCount,
    },
    {
      id: "audit" as CmsTab,
      label: "Audit Trail",
      icon: History,
      badge: `${initialAuditLogs.length}`,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* FLOATING TOAST NOTIFICATION                                               */}
      {/* ========================================================================= */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/30"
                : "bg-rose-950/90 text-rose-200 border-rose-500/30"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="max-w-xs">{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CMS HEADER & METRICS BAR                                                  */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 text-white flex items-center justify-center shadow-md">
                <Globe className="w-5 h-5 text-[#F5B83D]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Enterprise Content Management System
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Neon Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish announcements, manage hero banners, configure partner logos & update features with zero downtime
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleRevalidateAll}
              disabled={isRevalidating}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRevalidating ? "animate-spin text-sky-600" : ""}`} />
              <span>{isRevalidating ? "Purging Cache..." : "Purge & Revalidate ISR"}</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 transition shadow-xs"
            >
              <span>View Public Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F5B83D]" />
            </a>
          </div>
        </div>

        {/* Quick Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{activeSlidesCount} / {initialHeroSlides.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">Active Hero Slides</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-xs">
              <Handshake className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{activePartnersCount} / {initialPartners.length}</div>
              <div className="text-[10px] text-slate-400 font-medium">Partner Companies</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold text-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{activeFeaturesCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Live Feature Items</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{activeSocialCount}</div>
              <div className="text-[10px] text-slate-400 font-medium">Social Channels</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB NAVIGATION PILLS                                                      */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-[#F5B83D]" : "text-slate-400"
                }`}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                    isActive
                      ? "bg-white/15 text-slate-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[9px] font-bold ${
                    isActive
                      ? "bg-[#F5B83D] text-slate-950 font-extrabold"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ACTIVE TAB CONTENT SURFACE                                                */}
      {/* ========================================================================= */}
      <div className="transition-all duration-200">
        {activeTab === "brand" && (
          <CmsSettingsTab
            initialSettings={initialSettings}
            onShowToast={showToast}
          />
        )}
        {activeTab === "hero" && (
          <CmsHeroTab
            initialSlides={initialHeroSlides}
            onShowToast={showToast}
          />
        )}
        {activeTab === "benefits" && (
          <CmsFeaturesTab
            initialFeatures={initialFeatures}
            onShowToast={showToast}
          />
        )}
        {activeTab === "promotions" && (
          <CmsPromotionsTab
            initialPromotions={initialPromotions}
            onShowToast={showToast}
          />
        )}
        {activeTab === "partners" && (
          <CmsPartnersSocialTab
            initialPartners={initialPartners}
            initialSocialLinks={initialSocialLinks}
            onShowToast={showToast}
          />
        )}
        {activeTab === "audit" && (
          <CmsAuditTab initialAuditLogs={initialAuditLogs} />
        )}
      </div>
    </div>
  );
}
