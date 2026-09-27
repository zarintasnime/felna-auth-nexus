// =============================================================================
// Felna Portal — Homepage Data Contracts & Type Definitions
// =============================================================================

// -----------------------------------------------------------------------------
// 1. Raw Backend DTOs (Mirroring Existing Backend Admin Panel Keys)
// -----------------------------------------------------------------------------

export interface RawNavItem {
  Id?: string | number | null;
  id?: string | number | null;
  nav_nm?: string | null;
  nav_url?: string | null;
  order?: number | null;
  target?: "_self" | "_blank" | null;
}

export interface RawHeroBanner {
  Id?: string | number | null;
  id?: string | number | null;
  S_name?: string | null;
  S_image?: string | null;
  link_url?: string | null;
  subtitle?: string | null;
  badge?: string | null;
}

export interface RawBulkSmsOffer {
  Title?: string | null;
  title?: string | null;
  Description?: string | null;
  description?: string | null;
  Image?: string | null;
  image?: string | null;
  badge?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

export interface RawMarketingSection {
  Title?: string | null;
  title?: string | null;
  Image?: string | null;
  image?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
}

export interface RawBenefitItem {
  Id?: string | number | null;
  id?: string | number | null;
  Title?: string | null;
  title?: string | null;
  Description?: string | null;
  description?: string | null;
  icon?: string | null;
}

export interface RawWhyChooseUsItem {
  Id?: string | number | null;
  id?: string | number | null;
  Title?: string | null;
  title?: string | null;
  Description?: string | null;
  description?: string | null;
  Icon?: string | null;
  icon?: string | null;
  Image?: string | null;
  image?: string | null;
}

/**
 * Composite raw response representation from the backend API / Admin CMS.
 */
export interface RawHomePagePayload {
  navItems?: RawNavItem[] | null;
  nav_items?: RawNavItem[] | null;
  heroBanners?: RawHeroBanner[] | null;
  sliders?: RawHeroBanner[] | null;
  bulkSmsOffer?: RawBulkSmsOffer | null;
  offer?: RawBulkSmsOffer | null;
  marketingSection?: RawMarketingSection | null;
  marketing?: RawMarketingSection | null;
  benefits?: RawBenefitItem[] | null;
  whyChooseUs?: RawWhyChooseUsItem[] | null;
  features?: RawWhyChooseUsItem[] | null;
}

// -----------------------------------------------------------------------------
// 2. Normalized UI Domain Models (Clean, Strongly Typed Frontend Contracts)
// -----------------------------------------------------------------------------

export interface NavItem {
  id: string;
  label: string;
  url: string;
  isExternal: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  imageUrl: string;
  subtitle?: string;
  linkUrl?: string;
  badge?: string;
}

export interface BulkSmsOfferData {
  title: string;
  description: string;
  imageUrl: string;
  badge?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface MarketingSectionData {
  title: string;
  imageUrl: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface BenefitItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
}

export interface ServiceFeatureItem {
  id: string;
  title: string;
  description: string;
  iconName?: string;
  imageUrl?: string;
}

/**
 * Unified normalized payload ready to be passed to homepage UI components.
 */
export interface HomePagePayload {
  navItems: NavItem[];
  heroSlides: HeroSlide[];
  offer: BulkSmsOfferData | null;
  marketing: MarketingSectionData | null;
  benefits: BenefitItem[];
  features: ServiceFeatureItem[];
}
