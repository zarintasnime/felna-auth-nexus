import { unstable_cache, revalidatePath, revalidateTag } from "next/cache";
import { db } from "@/lib/db";
import {
  CmsSiteSettings,
  CmsHeroSlide,
  CmsPartner,
  CmsPromotionalSection,
  CmsFeatureItem,
  CmsSocialLink,
} from "@prisma/client";

// =============================================================================
// Resilient Production Fallback Datasets
// Ensures public pages NEVER crash if database is temporarily unreachable
// =============================================================================

export const FALLBACK_SITE_SETTINGS: CmsSiteSettings = {
  id: "default",
  siteName: "Felna.com",
  siteTagline: "Carrier-Grade Bulk SMS & OTP Gateway",
  logoUrl: null,
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
  updatedAt: new Date(),
};

export const FALLBACK_HERO_SLIDES: CmsHeroSlide[] = [
  {
    id: "fallback-slide-1",
    title: "Carrier-Grade Bulk SMS & OTP Gateway in Bangladesh",
    subtitle:
      "Direct operator routing across Grameenphone, Banglalink, Robi & Teletalk with 99.98% delivery rate.",
    badge: "BTRC Approved Route",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
    linkUrl: "/register",
    ctaText: "Get Started",
    displayOrder: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fallback-slide-2",
    title: "Lowest SMS Rate in Bangladesh — Only 23 Paisa per SMS",
    subtitle:
      "Both Masking (Brand Name) and Non-Masking routes with instant automated recharge via bKash & Nagad.",
    badge: "Starting from ৳0.23 / SMS",
    imageUrl:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
    linkUrl: "/register",
    ctaText: "Claim 23 Paisa Rate",
    displayOrder: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "fallback-slide-3",
    title: "Developer-First REST API & Real-Time Webhooks",
    subtitle:
      "Integrate 2-second OTP verification, transactional alerts, and customer notifications in less than 5 minutes.",
    badge: "99.9% Uptime SLA",
    imageUrl:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    linkUrl: "/register",
    ctaText: "Explore API Docs",
    displayOrder: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const FALLBACK_PARTNERS: CmsPartner[] = [
  "Grameenphone",
  "Banglalink",
  "Robi",
  "Airtel",
  "Teletalk",
  "IGL Group",
  "IGL Network™ Ltd.",
  "Unicode Converter",
  "iNews24 Ltd.",
  "RamBD Ltd.",
  "Student Visa BD",
  "Felna Tech",
].map((name, i) => ({
  id: `fallback-partner-${i + 1}`,
  name,
  logoUrl: null,
  websiteUrl: "https://felna.com",
  displayOrder: i + 1,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export const FALLBACK_BULK_SMS_OFFER: CmsPromotionalSection = {
  id: "fallback-promo-1",
  sectionKey: "bulk_sms_offer",
  badge: "Special Promotional Offer",
  title: "Mega Ramadan & Eid Special Bulk SMS Package — Starting at 23 Paisa",
  subtitle: "Fastest Carrier Delivery Across All BD Telcos",
  description:
    "Supercharge your business promotional campaigns with Bangladesh's most reliable high-throughput SMS route. Enjoy instant sender-ID approval, automated phone normalization (+880), real-time operator DLR, and dedicated 24/7 technical support.",
  imageUrl:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80",
  ctaText: "Claim 23 Paisa Rate",
  ctaUrl: "/register",
  isActive: true,
  updatedAt: new Date(),
};

export const FALLBACK_MARKETING_SECTION: CmsPromotionalSection = {
  id: "fallback-promo-2",
  sectionKey: "marketing_section",
  badge: "Targeted Customer Communication",
  title: "Data-Driven SMS Marketing to Reach Every Customer Mobile Instantly",
  subtitle:
    "Connect directly with your customers across Bangladesh. High open rates, zero spam filtering, and instant operator delivery make SMS the highest-ROI marketing channel.",
  description:
    "With direct connectivity to all telecom operators in Bangladesh, Felna ensures that your promotional and transactional broadcasts hit customer inboxes in seconds, driving maximum engagement and conversion.",
  imageUrl:
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1000&q=80",
  ctaText: "Launch Campaign",
  ctaUrl: "/register",
  isActive: true,
  updatedAt: new Date(),
};

// =============================================================================
// Smart Cache Wrapper: Uses Next.js unstable_cache inside App Router runtime,
// and transparently falls back to direct query when running outside Next.js
// =============================================================================

function safeCache<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  keyParts: string[],
  options: { tags: string[]; revalidate: number }
): (...args: Args) => Promise<T> {
  const cached = unstable_cache(fn, keyParts, options);
  return async (...args: Args): Promise<T> => {
    try {
      return await cached(...args);
    } catch (err: any) {
      if (err?.message?.includes("incrementalCache missing")) {
        return await fn(...args);
      }
      throw err;
    }
  };
}

// =============================================================================
// Cached Read Queries with Next.js ISR Tags
// =============================================================================

/**
 * Fetch singleton site settings (cached with tag 'cms-settings')
 */
export const getCmsSiteSettings = safeCache(
  async (): Promise<CmsSiteSettings> => {
    try {
      const settings = await db.cmsSiteSettings.findUnique({
        where: { id: "default" },
      });
      return settings || FALLBACK_SITE_SETTINGS;
    } catch (error) {
      console.warn("[CMS_SERVICE] Failed to query CmsSiteSettings, using fallback:", error);
      return FALLBACK_SITE_SETTINGS;
    }
  },
  ["cms-site-settings"],
  { tags: ["cms-settings", "cms-all"], revalidate: 60 }
);

/**
 * Fetch hero slides with ordering (cached with tag 'cms-slides')
 */
export const getCmsHeroSlides = safeCache(
  async (onlyActive = true): Promise<CmsHeroSlide[]> => {
    try {
      const slides = await db.cmsHeroSlide.findMany({
        where: onlyActive ? { isActive: true } : undefined,
        orderBy: { displayOrder: "asc" },
      });
      return slides.length > 0 ? slides : FALLBACK_HERO_SLIDES;
    } catch (error) {
      console.warn("[CMS_SERVICE] Failed to query CmsHeroSlide, using fallback:", error);
      return FALLBACK_HERO_SLIDES;
    }
  },
  ["cms-hero-slides"],
  { tags: ["cms-slides", "cms-all"], revalidate: 60 }
);

/**
 * Fetch trusted partners (cached with tag 'cms-partners')
 */
export const getCmsPartners = safeCache(
  async (onlyActive = true): Promise<CmsPartner[]> => {
    try {
      const partners = await db.cmsPartner.findMany({
        where: onlyActive ? { isActive: true } : undefined,
        orderBy: { displayOrder: "asc" },
      });
      return partners.length > 0 ? partners : FALLBACK_PARTNERS;
    } catch (error) {
      console.warn("[CMS_SERVICE] Failed to query CmsPartner, using fallback:", error);
      return FALLBACK_PARTNERS;
    }
  },
  ["cms-partners"],
  { tags: ["cms-partners", "cms-all"], revalidate: 60 }
);

/**
 * Fetch promotional section by key (cached with tag 'cms-promos')
 */
export const getCmsPromotionByKey = safeCache(
  async (sectionKey: string): Promise<CmsPromotionalSection | null> => {
    try {
      const promo = await db.cmsPromotionalSection.findUnique({
        where: { sectionKey },
      });
      if (promo) return promo;
      if (sectionKey === "bulk_sms_offer") return FALLBACK_BULK_SMS_OFFER;
      if (sectionKey === "marketing_section") return FALLBACK_MARKETING_SECTION;
      return null;
    } catch (error) {
      console.warn(`[CMS_SERVICE] Failed to query promo ${sectionKey}, using fallback:`, error);
      if (sectionKey === "bulk_sms_offer") return FALLBACK_BULK_SMS_OFFER;
      if (sectionKey === "marketing_section") return FALLBACK_MARKETING_SECTION;
      return null;
    }
  },
  ["cms-promotion-by-key"],
  { tags: ["cms-promos", "cms-all"], revalidate: 60 }
);

/**
 * Fetch all promotional sections
 */
export const getCmsPromotions = safeCache(
  async (): Promise<CmsPromotionalSection[]> => {
    try {
      const promos = await db.cmsPromotionalSection.findMany({
        orderBy: { sectionKey: "asc" },
      });
      return promos;
    } catch (error) {
      console.warn("[CMS_SERVICE] Failed to query CmsPromotionalSection, using fallback:", error);
      return [FALLBACK_BULK_SMS_OFFER, FALLBACK_MARKETING_SECTION];
    }
  },
  ["cms-all-promotions"],
  { tags: ["cms-promos", "cms-all"], revalidate: 60 }
);

/**
 * Fetch feature items (BENEFIT or WHY_CHOOSE_US)
 */
export const getCmsFeatures = safeCache(
  async (
    section?: "BENEFIT" | "WHY_CHOOSE_US",
    onlyActive = true
  ): Promise<CmsFeatureItem[]> => {
    try {
      const features = await db.cmsFeatureItem.findMany({
        where: {
          ...(section ? { section } : {}),
          ...(onlyActive ? { isActive: true } : {}),
        },
        orderBy: { displayOrder: "asc" },
      });
      return features;
    } catch (error) {
      console.warn("[CMS_SERVICE] Failed to query CmsFeatureItem:", error);
      return [];
    }
  },
  ["cms-features"],
  { tags: ["cms-features", "cms-all"], revalidate: 60 }
);

/**
 * Fetch social media links
 */
export const getCmsSocialLinks = safeCache(
  async (onlyActive = true): Promise<CmsSocialLink[]> => {
    try {
      const links = await db.cmsSocialLink.findMany({
        where: onlyActive ? { isActive: true } : undefined,
        orderBy: { displayOrder: "asc" },
      });
      return links;
    } catch (error) {
      console.warn("[CMS_SERVICE] Failed to query CmsSocialLink:", error);
      return [];
    }
  },
  ["cms-social-links"],
  { tags: ["cms-social", "cms-all"], revalidate: 60 }
);

// =============================================================================
// Consolidated Public Data Loader for Homepage
// =============================================================================

export interface PublicCmsPayload {
  settings: CmsSiteSettings;
  heroSlides: CmsHeroSlide[];
  partners: CmsPartner[];
  bulkSmsOffer: CmsPromotionalSection;
  marketingSection: CmsPromotionalSection;
  benefits: CmsFeatureItem[];
  whyChooseUs: CmsFeatureItem[];
  socialLinks: CmsSocialLink[];
}

export async function getPublicCmsData(): Promise<PublicCmsPayload> {
  const [
    settings,
    heroSlides,
    partners,
    bulkSmsOffer,
    marketingSection,
    benefits,
    whyChooseUs,
    socialLinks,
  ] = await Promise.all([
    getCmsSiteSettings(),
    getCmsHeroSlides(true),
    getCmsPartners(true),
    getCmsPromotionByKey("bulk_sms_offer").then((res) => res || FALLBACK_BULK_SMS_OFFER),
    getCmsPromotionByKey("marketing_section").then((res) => res || FALLBACK_MARKETING_SECTION),
    getCmsFeatures("BENEFIT", true),
    getCmsFeatures("WHY_CHOOSE_US", true),
    getCmsSocialLinks(true),
  ]);

  return {
    settings,
    heroSlides,
    partners,
    bulkSmsOffer,
    marketingSection,
    benefits,
    whyChooseUs,
    socialLinks,
  };
}

// =============================================================================
// Cache Invalidation & Revalidation Triggers
// =============================================================================

/**
 * Triggers instant on-demand cache revalidation across public surfaces
 */
export function revalidateCmsCache(tag?: string) {
  try {
    const expireImmediate = { expire: 0 };
    if (tag) {
      revalidateTag(tag, expireImmediate);
    }
    revalidateTag("cms-all", expireImmediate);
    revalidateTag("cms-settings", expireImmediate);
    revalidateTag("cms-slides", expireImmediate);
    revalidateTag("cms-partners", expireImmediate);
    revalidateTag("cms-promos", expireImmediate);
    revalidateTag("cms-features", expireImmediate);
    revalidateTag("cms-social", expireImmediate);

    // Revalidate primary pages and root layout
    revalidatePath("/", "layout");
    revalidatePath("/", "page");
    revalidatePath("/about", "page");
    revalidatePath("/contact", "page");
    revalidatePath("/address", "page");
    revalidatePath("/feedback", "page");
  } catch (error) {
    console.warn("[REVALIDATE_CMS_CACHE_WARNING]", error);
  }
}

// =============================================================================
// Audit Logging Helper
// =============================================================================

export interface LogCmsActionParams {
  userId: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "TOGGLE_STATUS" | "REORDER" | string;
  entity: "SiteSettings" | "HeroSlide" | "Partner" | "PromotionalSection" | "FeatureItem" | "SocialLink" | string;
  entityId: string;
  changes?: Record<string, any> | string;
}

export async function logCmsAction(params: LogCmsActionParams) {
  try {
    const changesStr =
      typeof params.changes === "string"
        ? params.changes
        : params.changes
        ? JSON.stringify(params.changes)
        : null;

    return await db.cmsAuditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        changes: changesStr,
      },
    });
  } catch (error) {
    console.error("[CMS_SERVICE] Failed to record audit log:", error);
    return null;
  }
}
