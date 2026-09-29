import { db } from "../src/lib/db";
import { getPublicCmsData, revalidateCmsCache, logCmsAction } from "../src/lib/services/cms-service";
import { getHomePageData } from "../src/lib/services/homepage-service";
import { canManageCMS, hasPermission } from "../src/lib/rbac";
import { ROLES } from "../src/lib/constants/roles";
import { PERMISSIONS } from "../src/lib/constants/permissions";
import { safeUrlSchema, cmsHeroSlideSchema, cmsSiteSettingsSchema } from "../src/lib/validations/cms";

async function runEndToEndVerification() {
  console.log("\n==================================================================");
  console.log("🚀 STARTING CMS PHASE 6: END-TO-END VERIFICATION & SECURITY AUDIT");
  console.log("==================================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: Neon Database Connection & Table Row Counts
    // -------------------------------------------------------------------------
    console.log("--- 1. Live Neon Database Data Verification ---");
    const [settingsCount, slideCount, partnerCount, promoCount, featCount, socialCount, auditCount] =
      await Promise.all([
        db.cmsSiteSettings.count(),
        db.cmsHeroSlide.count(),
        db.cmsPartner.count(),
        db.cmsPromotionalSection.count(),
        db.cmsFeatureItem.count(),
        db.cmsSocialLink.count(),
        db.cmsAuditLog.count(),
      ]);

    assert(settingsCount >= 1, `CmsSiteSettings exists (Count: ${settingsCount})`);
    assert(slideCount >= 3, `CmsHeroSlide populated (Count: ${slideCount})`);
    assert(partnerCount >= 5, `CmsPartner populated (Count: ${partnerCount})`);
    assert(promoCount >= 2, `CmsPromotionalSection populated (Count: ${promoCount})`);
    assert(featCount >= 5, `CmsFeatureItem populated (Count: ${featCount})`);
    assert(socialCount >= 3, `CmsSocialLink populated (Count: ${socialCount})`);
    console.log(`  ℹ️ Total CMS Audit Logs in DB: ${auditCount}`);

    // -------------------------------------------------------------------------
    // TEST SUITE 2: Public CMS Service Data Integrity
    // -------------------------------------------------------------------------
    console.log("\n--- 2. Public CMS Service (getPublicCmsData) ---");
    const cmsData = await getPublicCmsData();

    assert(Boolean(cmsData.settings), "getPublicCmsData() returns valid site settings");
    assert(cmsData.settings.siteName.length > 0, `Site name is '${cmsData.settings.siteName}'`);
    assert(cmsData.heroSlides.length >= 1, `Hero slides returned (${cmsData.heroSlides.length} active slides)`);
    assert(cmsData.partners.length >= 1, `Partners returned (${cmsData.partners.length} active partners)`);
    assert(Boolean(cmsData.bulkSmsOffer), "Bulk SMS promotional section loaded");
    assert(Boolean(cmsData.marketingSection), "Marketing promotional section loaded");
    assert(cmsData.benefits.length >= 1, `Accordion benefits loaded (${cmsData.benefits.length} items)`);
    assert(cmsData.whyChooseUs.length >= 1, `Why Choose Us cards loaded (${cmsData.whyChooseUs.length} items)`);
    assert(cmsData.socialLinks.length >= 1, `Social links loaded (${cmsData.socialLinks.length} items)`);

    // -------------------------------------------------------------------------
    // TEST SUITE 3: Dynamic Frontend Homepage Data Service
    // -------------------------------------------------------------------------
    console.log("\n--- 3. Dynamic Homepage Service (getHomePageData) ---");
    const homeData = await getHomePageData();

    assert(Array.isArray(homeData.navItems) && homeData.navItems.length > 0, `Nav items normalized (${homeData.navItems.length})`);
    assert(Array.isArray(homeData.heroSlides) && homeData.heroSlides.length > 0, `Hero slides mapped (${homeData.heroSlides.length})`);
    assert(Boolean(homeData.offer), "Offer object normalized");
    assert(Boolean(homeData.marketing), "Marketing object normalized");
    assert(homeData.benefits.length >= 4, `Benefits normalized (${homeData.benefits.length} items)`);
    assert(homeData.features.length >= 4, `Features normalized (${homeData.features.length} items)`);

    // -------------------------------------------------------------------------
    // TEST SUITE 4: Security & URL Validation (XSS Defenses)
    // -------------------------------------------------------------------------
    console.log("\n--- 4. Security & URL Validation (Anti-XSS Defenses) ---");

    const validHttps = safeUrlSchema.safeParse("https://felna.com/pricing");
    assert(validHttps.success, "Valid HTTPS URL passes safeUrlSchema");

    const validRelative = safeUrlSchema.safeParse("/register");
    assert(validRelative.success, "Valid relative path passes safeUrlSchema");

    const validAnchor = safeUrlSchema.safeParse("#pricing");
    assert(validAnchor.success, "Valid anchor tag passes safeUrlSchema");

    const xssScript = safeUrlSchema.safeParse("javascript:alert('XSS')");
    assert(!xssScript.success, "javascript: URL is strictly blocked");

    const xssData = safeUrlSchema.safeParse("data:text/html,<script>alert(1)</script>");
    assert(!xssData.success, "data: URI is strictly blocked");

    const vbScript = safeUrlSchema.safeParse("vbscript:msgbox(1)");
    assert(!vbScript.success, "vbscript: URI is strictly blocked");

    // -------------------------------------------------------------------------
    // TEST SUITE 5: RBAC Role & Permission Enforcements
    // -------------------------------------------------------------------------
    console.log("\n--- 5. RBAC Permission Enforcements ---");
    assert(canManageCMS(ROLES.SUPER_ADMIN), "SUPER_ADMIN can manage CMS");
    assert(canManageCMS(ROLES.ADMIN), "ADMIN can manage CMS");
    assert(!canManageCMS(ROLES.USER), "USER cannot manage CMS");
    assert(hasPermission(ROLES.ADMIN, PERMISSIONS.CMS_PUBLISH), "ADMIN has CMS_PUBLISH permission");
    assert(!hasPermission(ROLES.USER, PERMISSIONS.CMS_READ), "USER does not have CMS_READ permission");

    // -------------------------------------------------------------------------
    // TEST SUITE 6: Audit Logging & Cache Revalidation
    // -------------------------------------------------------------------------
    console.log("\n--- 6. Enterprise Audit Logging & Cache Invalidation ---");

    const auditEntry = await logCmsAction({
      userId: "test-verifier",
      action: "UPDATE",
      entity: "SiteSettings",
      entityId: cmsData.settings.id,
      changes: { testKey: "Phase 6 Verification Run" },
    });

    assert(Boolean(auditEntry && auditEntry.id), "logCmsAction() creates immutable audit entry");

    // Clean up test audit entry
    if (auditEntry?.id) {
      await db.cmsAuditLog.delete({ where: { id: auditEntry.id } });
      console.log("  ℹ️ Cleaned up test audit log successfully.");
    }

    try {
      revalidateCmsCache();
      assert(true, "revalidateCmsCache() executes without unhandled errors");
    } catch (e: any) {
      assert(false, `revalidateCmsCache() failed: ${e.message}`);
    }

    console.log("\n==================================================================");
    console.log(`🏁 VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
    console.log("==================================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("Critical test execution error:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

runEndToEndVerification();
