import { z } from "zod";

/**
 * URL Safeguard: Blocks XSS vectors (javascript:, vbscript:, data:)
 * Allows relative paths (/..., #...), http(s) URLs, tel:, and mailto:.
 */
export const safeUrlSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      if (!val || val === "") return true;
      const lower = val.toLowerCase();
      // Block unsafe protocols
      if (
        lower.startsWith("javascript:") ||
        lower.startsWith("vbscript:") ||
        lower.startsWith("data:")
      ) {
        return false;
      }
      // Allow internal paths, hashes, web URLs, mailto, tel
      return (
        val.startsWith("/") ||
        val.startsWith("#") ||
        val.startsWith("http://") ||
        val.startsWith("https://") ||
        val.startsWith("tel:") ||
        val.startsWith("mailto:")
      );
    },
    {
      message:
        "Please provide a valid and secure URL (must start with http://, https://, /, #, tel:, or mailto:).",
    }
  );

/**
 * CmsSiteSettings Schema
 */
export const siteSettingsSchema = z.object({
  siteName: z
    .string()
    .trim()
    .min(2, "Site name must be at least 2 characters.")
    .max(100, "Site name cannot exceed 100 characters."),
  siteTagline: z
    .string()
    .trim()
    .min(2, "Tagline must be at least 2 characters.")
    .max(255, "Tagline cannot exceed 255 characters."),
  logoUrl: safeUrlSchema.optional().nullable(),
  announcementText: z
    .string()
    .trim()
    .min(2, "Announcement text must be at least 2 characters.")
    .max(300, "Announcement text cannot exceed 300 characters."),
  announcementLinkText: z
    .string()
    .trim()
    .min(1, "Link text is required.")
    .max(50, "Link text cannot exceed 50 characters."),
  announcementLinkUrl: safeUrlSchema,
  scheduleText: z
    .string()
    .trim()
    .min(2, "Schedule text must be at least 2 characters.")
    .max(100, "Schedule text cannot exceed 100 characters."),
  primaryPhone: z
    .string()
    .trim()
    .min(5, "Phone number must be at least 5 characters.")
    .max(30, "Phone number cannot exceed 30 characters."),
  supportEmail: z
    .string()
    .trim()
    .email("Please provide a valid support email address."),
  officeAddress: z
    .string()
    .trim()
    .min(2, "Office address is required.")
    .max(300, "Office address cannot exceed 300 characters."),
  officeHours: z
    .string()
    .trim()
    .min(2, "Office hours are required.")
    .max(100, "Office hours cannot exceed 100 characters."),
  footerAboutText: z
    .string()
    .trim()
    .min(10, "About text must be at least 10 characters.")
    .max(3000, "About text cannot exceed 3000 characters."),
  copyrightText: z
    .string()
    .trim()
    .min(5, "Copyright text is required.")
    .max(200, "Copyright text cannot exceed 200 characters."),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

/**
 * CmsHeroSlide Schema
 */
export const heroSlideSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Slide title must be at least 3 characters.")
    .max(300, "Slide title cannot exceed 300 characters."),
  subtitle: z
    .string()
    .trim()
    .max(600, "Subtitle cannot exceed 600 characters.")
    .optional()
    .nullable(),
  badge: z
    .string()
    .trim()
    .max(100, "Badge cannot exceed 100 characters.")
    .optional()
    .nullable(),
  imageUrl: safeUrlSchema.refine((val) => !!val && val.length > 0, {
    message: "Image URL is required.",
  }),
  linkUrl: safeUrlSchema.optional().nullable(),
  ctaText: z
    .string()
    .trim()
    .max(50, "Button text cannot exceed 50 characters.")
    .optional()
    .nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type HeroSlideInput = z.infer<typeof heroSlideSchema>;

/**
 * CmsPartner Schema
 */
export const partnerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Partner name must be at least 2 characters.")
    .max(100, "Partner name cannot exceed 100 characters."),
  logoUrl: safeUrlSchema.optional().nullable(),
  websiteUrl: safeUrlSchema.optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type PartnerInput = z.infer<typeof partnerSchema>;

/**
 * CmsPromotionalSection Schema
 */
export const promotionalSectionSchema = z.object({
  sectionKey: z
    .string()
    .trim()
    .min(2, "Section key must be at least 2 characters.")
    .max(50, "Section key cannot exceed 50 characters.")
    .regex(
      /^[a-z0-9_]+$/,
      "Section key must contain only lowercase letters, numbers, and underscores."
    ),
  badge: z
    .string()
    .trim()
    .max(100, "Badge cannot exceed 100 characters.")
    .optional()
    .nullable(),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(300, "Title cannot exceed 300 characters."),
  subtitle: z
    .string()
    .trim()
    .max(600, "Subtitle cannot exceed 600 characters.")
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(3000, "Description cannot exceed 3000 characters.")
    .optional()
    .nullable(),
  imageUrl: safeUrlSchema.optional().nullable(),
  ctaText: z
    .string()
    .trim()
    .max(50, "CTA button text cannot exceed 50 characters.")
    .optional()
    .nullable(),
  ctaUrl: safeUrlSchema.optional().nullable(),
  isActive: z.boolean().default(true),
});

export type PromotionalSectionInput = z.infer<typeof promotionalSectionSchema>;

/**
 * CmsFeatureItem Schema
 */
export const featureItemSchema = z.object({
  section: z.enum(["BENEFIT", "WHY_CHOOSE_US"], {
    message: "Section must be either 'BENEFIT' or 'WHY_CHOOSE_US'.",
  }),
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(300, "Title cannot exceed 300 characters."),
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),
  iconName: z
    .string()
    .trim()
    .max(50, "Icon name cannot exceed 50 characters.")
    .optional()
    .nullable(),
  imageUrl: safeUrlSchema.optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type FeatureItemInput = z.infer<typeof featureItemSchema>;

/**
 * CmsSocialLink Schema
 */
export const socialLinkSchema = z.object({
  platform: z
    .string()
    .trim()
    .min(2, "Platform name is required.")
    .max(50, "Platform name cannot exceed 50 characters."),
  label: z
    .string()
    .trim()
    .max(50, "Label cannot exceed 50 characters.")
    .optional()
    .nullable(),
  url: safeUrlSchema.refine((val) => !!val && val.length > 0, {
    message: "Valid URL is required for social link.",
  }),
  displayOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

/**
 * Reorder Items Schema
 */
export const reorderItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1, "Item ID is required."),
      displayOrder: z.coerce.number().int().min(0),
    })
  ),
});

export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>;

// Aliases for convenience and backward compatibility
export const cmsSiteSettingsSchema = siteSettingsSchema;
export const cmsHeroSlideSchema = heroSlideSchema;
export const cmsPartnerSchema = partnerSchema;
export const cmsPromotionalSectionSchema = promotionalSectionSchema;
export const cmsFeatureItemSchema = featureItemSchema;
export const cmsSocialLinkSchema = socialLinkSchema;
