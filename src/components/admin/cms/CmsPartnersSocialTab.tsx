"use client";

import React, { useState } from "react";
import { CmsPartner, CmsSocialLink } from "@prisma/client";
import { Handshake, Share2 } from "lucide-react";
import CmsPartnersTab from "./CmsPartnersTab";
import CmsSocialTab from "./CmsSocialTab";

interface CmsPartnersSocialTabProps {
  initialPartners: CmsPartner[];
  initialSocialLinks: CmsSocialLink[];
  onShowToast: (type: "success" | "error", message: string) => void;
}

export default function CmsPartnersSocialTab({
  initialPartners,
  initialSocialLinks,
  onShowToast,
}: CmsPartnersSocialTabProps) {
  const [subTab, setSubTab] = useState<"partners" | "social">("partners");

  const activePartnersCount = initialPartners.filter((p) => p.isActive).length;
  const activeSocialCount = initialSocialLinks.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switcher */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/90 p-2.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSubTab("partners")}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === "partners"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Handshake className="w-4 h-4 text-[#F5B83D]" />
          <span>Trusted Brand Logos &amp; Concerns</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              subTab === "partners"
                ? "bg-white/20 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {activePartnersCount} Active
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("social")}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === "social"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Share2 className="w-4 h-4 text-sky-400" />
          <span>Official Social Media Channels</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              subTab === "social"
                ? "bg-white/20 text-white"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {activeSocialCount} Active
          </span>
        </button>
      </div>

      {/* Render Active Subsection */}
      {subTab === "partners" ? (
        <CmsPartnersTab initialPartners={initialPartners} onShowToast={onShowToast} />
      ) : (
        <CmsSocialTab initialLinks={initialSocialLinks} onShowToast={onShowToast} />
      )}
    </div>
  );
}
