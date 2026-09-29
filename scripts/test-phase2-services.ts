import "dotenv/config";
import { PERMISSIONS, ROLE_PERMISSIONS } from "../src/lib/constants/permissions";
import { hasPermission, canManageCMS } from "../src/lib/rbac";
import {
  safeUrlSchema,
  siteSettingsSchema,
  heroSlideSchema,
  partnerSchema,
  promotionalSectionSchema,
  featureItemSchema,
  socialLinkSchema,
} from "../src/lib/validations/cms";
import {
  getCmsSiteSettings,
  getCmsHeroSlides,
  getCmsPartners,
  getCmsPromotionByKey,
  getCmsFeatures,
  getCmsSocialLinks,
  getPublicCmsData,
} from "../src/lib/services/cms-service";

async function runPhase2Tests() {
  console.log("\n=======================================================");
  console.log("       Testing Phase 2: Validation, RBAC & Services");
  console.log("=======================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
      failed++;
    }
  }

  // 1. RBAC & Permissions Matrix Tests
  console.log("1. Testing RBAC Capabilities & Permissions Matrix:");
  assert(
    hasPermission("ADMIN", PERMISSIONS.CMS_WRITE),
    "ADMIN has 'cms:write' permission"
  );
  assert(
    hasPermission("ADMIN", PERMISSIONS.CMS_DELETE),
    "ADMIN has 'cms:delete' permission"
  );
  assert(
    hasPermission("SUPER_ADMIN", PERMISSIONS.SETTINGS_MANAGE),
    "SUPER_ADMIN has 'settings:manage' permission"
  );
  assert(
    hasPermission("EDITOR", PERMISSIONS.CMS_PUBLISH),
    "EDITOR has 'cms:publish' permission"
  );
  assert(
    !hasPermission("EDITOR", PERMISSIONS.USERS_MANAGE),
    "EDITOR lacks 'users:manage' permission"
  );
  assert(
    !hasPermission("USER", PERMISSIONS.CMS_WRITE),
    "Regular USER has no CMS write permission"
  );
  assert(
    canManageCMS({ userId: "1", name: "Admin", phone: "017", role: "ADMIN" }),
    "canManageCMS returns true for ADMIN"
  );
  assert(
    !canManageCMS({ userId: "2", name: "User", phone: "018", role: "USER" }),
    "canManageCMS returns false for USER"
  );

  // 2. URL Safeguard & Anti-XSS Tests
  console.log("\n2. Testing URL Safeguard & Anti-XSS Validation:");
  const xssUrl1 = safeUrlSchema.safeParse("javascript:alert(document.cookie)");
  assert(!xssUrl1.success, "Blocks 'javascript:' protocol execution");

  const xssUrl2 = safeUrlSchema.safeParse("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==");
  assert(!xssUrl2.success, "Blocks 'data:' protocol XSS injection");

  const safeUrl1 = safeUrlSchema.safeParse("https://felna.com/register");
  assert(safeUrl1.success, "Accepts secure https:// URL");

  const safeUrl2 = safeUrlSchema.safeParse("/#services");
  assert(safeUrl2.success, "Accepts internal anchor path");

  const safeUrl3 = safeUrlSchema.safeParse("tel:+8801958666999");
  assert(safeUrl3.success, "Accepts tel: phone action URL");

  // 3. Schema Validations
  console.log("\n3. Testing Zod Entity Schemas:");
  const validSettings = siteSettingsSchema.safeParse({
    siteName: "Felna.com",
    siteTagline: "Bulk SMS & OTP",
    announcementText: "Fast Bulk SMS",
    announcementLinkText: "Join Now",
    announcementLinkUrl: "/register",
    scheduleText: "9 am - 6 pm",
    primaryPhone: "+880-1958-666999",
    supportEmail: "support@iglweb.com",
    officeAddress: "Dhaka",
    officeHours: "Sat - Thu",
    footerAboutText: "A premier bulk sms provider in Bangladesh.",
    copyrightText: "© 2026 Felna.com",
  });
  assert(validSettings.success, "siteSettingsSchema validates correct payload");

  const invalidSettings = siteSettingsSchema.safeParse({
    siteName: "F", // Too short
    supportEmail: "not-an-email",
  });
  assert(!invalidSettings.success, "siteSettingsSchema catches invalid short name and bad email");

  const validSlide = heroSlideSchema.safeParse({
    title: "Carrier Grade Bulk SMS",
    imageUrl: "https://images.unsplash.com/photo-1557804506",
    linkUrl: "/register",
    ctaText: "Get Started",
    displayOrder: 1,
    isActive: true,
  });
  assert(validSlide.success, "heroSlideSchema validates valid slide");

  const validPromo = promotionalSectionSchema.safeParse({
    sectionKey: "bulk_sms_offer",
    title: "Ramadan Offer",
    badge: "Special Offer",
    description: "Lowest SMS rates in Bangladesh",
    isActive: true,
  });
  assert(validPromo.success, "promotionalSectionSchema validates sectionKey and text");

  // 4. Live CmsService Cache & DB Integration Tests
  console.log("\n4. Testing CmsService Queries:");
  try {
    const settings = await getCmsSiteSettings();
    assert(settings.siteName === "Felna.com", "getCmsSiteSettings returns Felna.com");

    const slides = await getCmsHeroSlides(true);
    assert(slides.length >= 3, `getCmsHeroSlides returns active slides (count: ${slides.length})`);

    const partners = await getCmsPartners(true);
    assert(partners.length >= 10, `getCmsPartners returns partners (count: ${partners.length})`);

    const promo = await getCmsPromotionByKey("bulk_sms_offer");
    assert(!!promo, "getCmsPromotionByKey returns bulk_sms_offer section");

    const benefits = await getCmsFeatures("BENEFIT", true);
    assert(benefits.length === 5, "getCmsFeatures returns 5 benefit items");

    const socialLinks = await getCmsSocialLinks(true);
    assert(socialLinks.length === 4, "getCmsSocialLinks returns 4 social channels");

    const publicPayload = await getPublicCmsData();
    assert(
      !!publicPayload.settings &&
        !!publicPayload.heroSlides &&
        !!publicPayload.partners &&
        !!publicPayload.bulkSmsOffer &&
        !!publicPayload.marketingSection &&
        publicPayload.benefits.length > 0 &&
        publicPayload.whyChooseUs.length > 0,
      "getPublicCmsData aggregates complete consolidated payload"
    );
  } catch (err) {
    console.error("Query test failed:", err);
    assert(false, "CmsService query execution");
  }

  console.log("\n=======================================================");
  console.log(`Phase 2 Results: ${passed} Passed, ${failed} Failed`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase2Tests();
