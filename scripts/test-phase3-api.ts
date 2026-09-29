import "dotenv/config";
import * as settingsRoute from "../src/app/api/admin/cms/settings/route";
import * as slidesRoute from "../src/app/api/admin/cms/hero-slides/route";
import * as partnersRoute from "../src/app/api/admin/cms/partners/route";
import * as promotionsRoute from "../src/app/api/admin/cms/promotions/route";
import * as featuresRoute from "../src/app/api/admin/cms/features/route";
import * as socialRoute from "../src/app/api/admin/cms/social-links/route";
import * as uploadRoute from "../src/app/api/admin/cms/upload/route";
import { db } from "../src/lib/db";

async function runPhase3Tests() {
  console.log("\n=======================================================");
  console.log("       Testing Phase 3: Secure CMS API Route Handlers");
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

  // 1. Verify Route Handler Exports
  console.log("1. Verifying Route Handler Method Signatures:");
  assert(typeof settingsRoute.GET === "function" && typeof settingsRoute.PUT === "function", "Settings route exports GET & PUT");
  assert(
    typeof slidesRoute.GET === "function" &&
      typeof slidesRoute.POST === "function" &&
      typeof slidesRoute.PUT === "function" &&
      typeof slidesRoute.DELETE === "function" &&
      typeof slidesRoute.PATCH === "function",
    "Hero Slides route exports GET, POST, PUT, DELETE, PATCH"
  );
  assert(
    typeof partnersRoute.GET === "function" &&
      typeof partnersRoute.POST === "function" &&
      typeof partnersRoute.PUT === "function" &&
      typeof partnersRoute.DELETE === "function" &&
      typeof partnersRoute.PATCH === "function",
    "Partners route exports GET, POST, PUT, DELETE, PATCH"
  );
  assert(typeof promotionsRoute.GET === "function" && typeof promotionsRoute.PUT === "function", "Promotions route exports GET & PUT");
  assert(
    typeof featuresRoute.GET === "function" &&
      typeof featuresRoute.POST === "function" &&
      typeof featuresRoute.PUT === "function" &&
      typeof featuresRoute.DELETE === "function" &&
      typeof featuresRoute.PATCH === "function",
    "Features route exports GET, POST, PUT, DELETE, PATCH"
  );
  assert(
    typeof socialRoute.GET === "function" &&
      typeof socialRoute.POST === "function" &&
      typeof socialRoute.PUT === "function" &&
      typeof socialRoute.DELETE === "function" &&
      typeof socialRoute.PATCH === "function",
    "Social Links route exports GET, POST, PUT, DELETE, PATCH"
  );
  assert(typeof uploadRoute.POST === "function", "Upload route exports POST");

  // 2. Test Unauthenticated Access Protection
  console.log("\n2. Testing Server-Side Unauthenticated Protection:");
  const unauthSettings = await settingsRoute.GET();
  const unauthSettingsJson = await unauthSettings.json();
  assert(
    unauthSettings.status === 401 && !unauthSettingsJson.success,
    "GET /api/admin/cms/settings blocks unauthenticated caller with HTTP 401"
  );

  const unauthSlides = await slidesRoute.GET();
  const unauthSlidesJson = await unauthSlides.json();
  assert(
    unauthSlides.status === 401 && !unauthSlidesJson.success,
    "GET /api/admin/cms/hero-slides blocks unauthenticated caller with HTTP 401"
  );

  const unauthPartners = await partnersRoute.GET();
  const unauthPartnersJson = await unauthPartners.json();
  assert(
    unauthPartners.status === 401 && !unauthPartnersJson.success,
    "GET /api/admin/cms/partners blocks unauthenticated caller with HTTP 401"
  );

  const unauthUploadReq = new Request("http://localhost/api/admin/cms/upload", { method: "POST" });
  const unauthUpload = await uploadRoute.POST(unauthUploadReq as any);
  const unauthUploadJson = await unauthUpload.json();
  assert(
    unauthUpload.status === 401 && !unauthUploadJson.success,
    "POST /api/admin/cms/upload blocks unauthenticated caller with HTTP 401"
  );

  // 3. Database Integrity & Model CRUD Handlers Verification
  console.log("\n3. Testing Direct Database CRUD Capability for APIs:");
  // Create a temporary hero slide
  const testSlide = await db.cmsHeroSlide.create({
    data: {
      title: "Temporary Test Slide",
      subtitle: "API Verification",
      imageUrl: "https://images.unsplash.com/photo-1551836022",
      linkUrl: "/register",
      displayOrder: 999,
      isActive: true,
    },
  });
  assert(!!testSlide.id, "Slide creation through DB layer succeeds");

  // Read the slide
  const foundSlide = await db.cmsHeroSlide.findUnique({ where: { id: testSlide.id } });
  assert(foundSlide?.title === "Temporary Test Slide", "Slide lookup retrieves exact data");

  // Update the slide
  const updatedSlide = await db.cmsHeroSlide.update({
    where: { id: testSlide.id },
    data: { title: "Updated Test Slide", isActive: false },
  });
  assert(updatedSlide.title === "Updated Test Slide" && !updatedSlide.isActive, "Slide update mutates fields correctly");

  // Delete the slide
  await db.cmsHeroSlide.delete({ where: { id: testSlide.id } });
  const checkDeleted = await db.cmsHeroSlide.findUnique({ where: { id: testSlide.id } });
  assert(checkDeleted === null, "Slide deletion removes row from DB");

  // 4. Partner Model CRUD Handlers Verification
  console.log("\n4. Testing Partner CRUD Operations:");
  const testPartner = await db.cmsPartner.create({
    data: {
      name: "Test Partner Brand",
      websiteUrl: "https://testpartner.com",
      displayOrder: 999,
      isActive: true,
    },
  });
  assert(!!testPartner.id, "Partner creation succeeds");

  await db.cmsPartner.delete({ where: { id: testPartner.id } });
  const checkPartnerDeleted = await db.cmsPartner.findUnique({ where: { id: testPartner.id } });
  assert(checkPartnerDeleted === null, "Partner deletion removes record");

  console.log("\n=======================================================");
  console.log(`Phase 3 Results: ${passed} Passed, ${failed} Failed`);
  console.log("=======================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase3Tests();
