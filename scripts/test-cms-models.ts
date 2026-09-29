import "dotenv/config";
import { db } from "../src/lib/db";

async function runTests() {
  console.log("\n=======================================================");
  console.log("       Testing CMS Models in Neon PostgreSQL");
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

  try {
    // Test 1: CmsSiteSettings
    console.log("1. Testing CmsSiteSettings Model:");
    const settings = await db.cmsSiteSettings.findUnique({
      where: { id: "default" },
    });
    assert(!!settings, "CmsSiteSettings default record exists");
    assert(settings?.siteName === "Felna.com", "Site name is Felna.com", `Got: ${settings?.siteName}`);
    assert(
      settings?.primaryPhone === "+880-1958-666999",
      "Support phone matches production",
      `Got: ${settings?.primaryPhone}`
    );
    assert(
      settings?.announcementLinkText === "Join Now",
      "Announcement action text is Join Now"
    );

    // Test 2: CmsHeroSlide
    console.log("\n2. Testing CmsHeroSlide Model:");
    const slides = await db.cmsHeroSlide.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    assert(slides.length === 3, "Found exactly 3 active Hero Slides", `Found: ${slides.length}`);
    assert(
      slides[0]?.title.includes("Bulk SMS & OTP Gateway"),
      "First slide contains Bulk SMS & OTP Gateway headline"
    );
    assert(
      slides.every((s: { imageUrl?: string }) => s.imageUrl && s.imageUrl.startsWith("http")),
      "All slides have valid remote image URLs"
    );

    // Test 3: CmsPartner
    console.log("\n3. Testing CmsPartner Model:");
    const partners = await db.cmsPartner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    assert(partners.length === 12, "Found 12 trusted partner brands", `Found: ${partners.length}`);
    assert(
      partners.some((p: { name: string }) => p.name === "Grameenphone"),
      "Grameenphone partner exists"
    );
    assert(
      partners.some((p: { name: string }) => p.name === "Felna Tech"),
      "Felna Tech partner exists"
    );

    // Test 4: CmsPromotionalSection
    console.log("\n4. Testing CmsPromotionalSection Model:");
    const bulkSmsOffer = await db.cmsPromotionalSection.findUnique({
      where: { sectionKey: "bulk_sms_offer" },
    });
    assert(!!bulkSmsOffer, "bulk_sms_offer promotional section exists");
    assert(
      bulkSmsOffer?.badge === "Special Promotional Offer",
      "bulk_sms_offer badge is accurate"
    );

    const marketingSection = await db.cmsPromotionalSection.findUnique({
      where: { sectionKey: "marketing_section" },
    });
    assert(!!marketingSection, "marketing_section promotional section exists");
    assert(
      marketingSection?.ctaText === "Launch Campaign",
      "marketing_section CTA button is Launch Campaign"
    );

    // Test 5: CmsFeatureItem
    console.log("\n5. Testing CmsFeatureItem Model:");
    const benefits = await db.cmsFeatureItem.findMany({
      where: { section: "BENEFIT", isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    assert(benefits.length === 5, "Found 5 active Benefit accordion items", `Found: ${benefits.length}`);

    const whyChooseUs = await db.cmsFeatureItem.findMany({
      where: { section: "WHY_CHOOSE_US", isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    assert(
      whyChooseUs.length === 4,
      "Found 4 active Why Choose Us cards",
      `Found: ${whyChooseUs.length}`
    );
    assert(
      whyChooseUs[0]?.iconName === "Wallet",
      "First card has Wallet icon",
      `Got: ${whyChooseUs[0]?.iconName}`
    );

    // Test 6: CmsSocialLink
    console.log("\n6. Testing CmsSocialLink Model:");
    const socialLinks = await db.cmsSocialLink.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    assert(socialLinks.length === 4, "Found 4 active social links", `Found: ${socialLinks.length}`);
    assert(
      socialLinks.some((s: { platform: string }) => s.platform === "facebook"),
      "Facebook social link exists"
    );

    // Test 7: CmsAuditLog
    console.log("\n7. Testing CmsAuditLog Model:");
    const auditLogs = await db.cmsAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    assert(auditLogs.length >= 1, "At least 1 audit log entry exists", `Found: ${auditLogs.length}`);
    assert(
      auditLogs[0]?.action === "INITIAL_SEED",
      "Initial seed action was logged",
      `Got: ${auditLogs[0]?.action}`
    );

    // Test 8: Non-destructive Update & Mutability
    console.log("\n8. Testing Mutability & Update Capabilities:");
    const updatedSettings = await db.cmsSiteSettings.update({
      where: { id: "default" },
      data: { announcementLinkText: "Join Now" },
    });
    assert(
      updatedSettings.announcementLinkText === "Join Now",
      "CmsSiteSettings update executes successfully"
    );

    console.log("\n=======================================================");
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log("=======================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("❌ Test Execution Error:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runTests();
