import {
  RawNavItem,
  RawHeroBanner,
  RawBulkSmsOffer,
  RawMarketingSection,
  RawBenefitItem,
  RawWhyChooseUsItem,
  RawHomePagePayload,
  NavItem,
  HeroSlide,
  BulkSmsOfferData,
  MarketingSectionData,
  BenefitItem,
  ServiceFeatureItem,
  HomePagePayload,
} from "@/types/homepage";

// Default placeholder images if backend values are missing or broken
export const DEFAULT_FALLBACK_IMAGES = {
  heroBanner:
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
  bulkOffer:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
  marketing:
    "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?auto=format&fit=crop&w=1200&q=80",
  feature:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=400&q=80",
};

/**
 * Safely parses and normalizes a navigation item.
 */
export function normalizeNavItem(raw: RawNavItem, index: number): NavItem {
  const id = String(raw.Id ?? raw.id ?? `nav-${index + 1}`).trim();
  const label = (raw.nav_nm ?? "Menu").trim();
  const url = (raw.nav_url ?? "#").trim();
  const isExternal =
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    raw.target === "_blank";

  return {
    id,
    label: label || "Menu",
    url: url || "#",
    isExternal,
  };
}

/**
 * Safely parses and normalizes a hero slider banner.
 */
export function normalizeHeroSlide(raw: RawHeroBanner, index: number): HeroSlide {
  const id = String(raw.Id ?? raw.id ?? `slide-${index + 1}`).trim();
  const title = (raw.S_name ?? "Felna Bulk SMS Platform").trim();
  const imageUrl = (raw.S_image ?? "").trim() || DEFAULT_FALLBACK_IMAGES.heroBanner;

  return {
    id,
    title: title || "Felna Bulk SMS Platform",
    imageUrl,
    subtitle: raw.subtitle ? raw.subtitle.trim() : undefined,
    linkUrl: raw.link_url ? raw.link_url.trim() : undefined,
    badge: raw.badge ? raw.badge.trim() : undefined,
  };
}

/**
 * Safely parses and normalizes the Bulk SMS promotional offer block.
 */
export function normalizeBulkSmsOffer(
  raw?: RawBulkSmsOffer | null
): BulkSmsOfferData | null {
  if (!raw) return null;

  const title = (raw.Title ?? raw.title ?? "").trim();
  const description = (raw.Description ?? raw.description ?? "").trim();
  const imageUrl =
    (raw.Image ?? raw.image ?? "").trim() || DEFAULT_FALLBACK_IMAGES.bulkOffer;

  if (!title && !description) {
    return null;
  }

  return {
    title: title || "Special Bulk SMS Package",
    description:
      description ||
      "Accelerate your business with Bangladesh's most reliable Bulk SMS route at the lowest per-SMS rate.",
    imageUrl,
    badge: raw.badge ? raw.badge.trim() : undefined,
    ctaText: raw.ctaText ? raw.ctaText.trim() : undefined,
    ctaUrl: raw.ctaUrl ? raw.ctaUrl.trim() : undefined,
  };
}

/**
 * Safely parses and normalizes the Marketing highlight section.
 */
export function normalizeMarketingSection(
  raw?: RawMarketingSection | null
): MarketingSectionData | null {
  if (!raw) return null;

  const title = (raw.Title ?? raw.title ?? "").trim();
  const imageUrl =
    (raw.Image ?? raw.image ?? "").trim() || DEFAULT_FALLBACK_IMAGES.marketing;

  if (!title && !imageUrl) {
    return null;
  }

  return {
    title: title || "Empower Your Business Communication",
    imageUrl,
    subtitle: raw.subtitle ? raw.subtitle.trim() : undefined,
    ctaText: raw.ctaText ? raw.ctaText.trim() : undefined,
    ctaUrl: raw.ctaUrl ? raw.ctaUrl.trim() : undefined,
  };
}

/**
 * Safely parses and normalizes an individual SMS marketing benefit item.
 */
export function normalizeBenefitItem(
  raw: RawBenefitItem,
  index: number
): BenefitItem {
  const id = String(raw.Id ?? raw.id ?? `benefit-${index + 1}`).trim();
  const title = (raw.Title ?? raw.title ?? `Advantage ${index + 1}`).trim();
  const description = (raw.Description ?? raw.description ?? "").trim();
  const iconName = raw.icon ? raw.icon.trim() : undefined;

  return {
    id,
    title: title || `Advantage ${index + 1}`,
    description:
      description ||
      "Direct carrier connections guarantee maximum throughput and zero delivery drop-offs.",
    iconName,
  };
}

/**
 * Safely parses and normalizes a 'Why Choose Us' feature item.
 */
export function normalizeWhyChooseUsItem(
  raw: RawWhyChooseUsItem,
  index: number
): ServiceFeatureItem {
  const id = String(raw.Id ?? raw.id ?? `feature-${index + 1}`).trim();
  const title = (raw.Title ?? raw.title ?? `Feature ${index + 1}`).trim();
  const description = (raw.Description ?? raw.description ?? "").trim();
  const iconName = (raw.Icon ?? raw.icon ?? "").trim() || undefined;
  const imageUrl = (raw.Image ?? raw.image ?? "").trim() || undefined;

  return {
    id,
    title: title || `Feature ${index + 1}`,
    description:
      description ||
      "Engineered for high-volume enterprise transactions with transparent billing and real-time logs.",
    iconName,
    imageUrl,
  };
}

/**
 * Composite adapter function: safely normalizes raw backend payload into a clean HomePagePayload.
 */
export function normalizeHomePageData(
  raw?: RawHomePagePayload | null
): HomePagePayload {
  if (!raw) {
    return {
      navItems: [],
      heroSlides: [],
      offer: null,
      marketing: null,
      benefits: [],
      features: [],
    };
  }

  // 1. Navigation items
  const rawNav = raw.navItems ?? raw.nav_items ?? [];
  const navItems = Array.isArray(rawNav)
    ? rawNav
        .filter((item): item is RawNavItem => item !== null && typeof item === "object")
        .map(normalizeNavItem)
    : [];

  // 2. Hero banners
  const rawBanners = raw.heroBanners ?? raw.sliders ?? [];
  const heroSlides = Array.isArray(rawBanners)
    ? rawBanners
        .filter((b): b is RawHeroBanner => b !== null && typeof b === "object")
        .map(normalizeHeroSlide)
    : [];

  // 3. Bulk SMS offer
  const offer = normalizeBulkSmsOffer(raw.bulkSmsOffer ?? raw.offer);

  // 4. Marketing section
  const marketing = normalizeMarketingSection(
    raw.marketingSection ?? raw.marketing
  );

  // 5. SMS marketing benefits
  const rawBenefits = raw.benefits ?? [];
  const benefits = Array.isArray(rawBenefits)
    ? rawBenefits
        .filter((b): b is RawBenefitItem => b !== null && typeof b === "object")
        .map(normalizeBenefitItem)
    : [];

  // 6. Why choose us
  const rawFeatures = raw.whyChooseUs ?? raw.features ?? [];
  const features = Array.isArray(rawFeatures)
    ? rawFeatures
        .filter((f): f is RawWhyChooseUsItem => f !== null && typeof f === "object")
        .map(normalizeWhyChooseUsItem)
    : [];

  return {
    navItems,
    heroSlides,
    offer,
    marketing,
    benefits,
    features,
  };
}
