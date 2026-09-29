import React from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { ROLES } from "@/lib/constants/roles";
import CmsManagerClient from "@/components/admin/cms/CmsManagerClient";

export const metadata = {
  title: "Enterprise CMS & Content Manager | Felna Admin Console",
  description: "Manage public website content, hero banners, partners, features, and site settings.",
};

export default async function AdminCmsPage() {
  try {
    await requireRole(ROLES.ADMIN);
  } catch {
    redirect("/forbidden");
  }

  // Fetch initial content state directly from live Neon DB
  const [
    settings,
    heroSlides,
    partners,
    promotions,
    features,
    socialLinks,
    auditLogs,
  ] = await Promise.all([
    db.cmsSiteSettings.findFirst(),
    db.cmsHeroSlide.findMany({ orderBy: { displayOrder: "asc" } }),
    db.cmsPartner.findMany({ orderBy: { displayOrder: "asc" } }),
    db.cmsPromotionalSection.findMany({ orderBy: { sectionKey: "asc" } }),
    db.cmsFeatureItem.findMany({ orderBy: { displayOrder: "asc" } }),
    db.cmsSocialLink.findMany({ orderBy: { displayOrder: "asc" } }),
    db.cmsAuditLog.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
  ]);

  return (
    <CmsManagerClient
      initialSettings={settings}
      initialHeroSlides={heroSlides}
      initialPartners={partners}
      initialPromotions={promotions}
      initialFeatures={features}
      initialSocialLinks={socialLinks}
      initialAuditLogs={auditLogs}
    />
  );
}
