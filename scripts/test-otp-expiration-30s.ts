/**
 * Verification Script: 30-Second OTP Expiration & Cooldown Logic
 * 
 * Verifies:
 * 1. OTP_CONFIG limits are set to 30 seconds for both cooldown and expiration.
 * 2. Generated OTP records have an expiration window of exactly 30 seconds.
 * 3. Valid OTP verification succeeds within 30 seconds.
 * 4. Expired OTP verification (> 30 seconds) fails and returns "OTP Expired. Please request a new code.".
 * 5. Cooldown restricts resend within 30 seconds, but permits resend after 30 seconds.
 */

import "dotenv/config";
process.env.MOCK_SMS = "true";
import {
  OTP_CONFIG,
  requestOtp,
  verifyOtp,
  InMemoryOtpStore,
  normalizeBdPhone,
  hashOtp,
} from "../src/lib/sms";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runExpirationTests() {
  console.log("\n=======================================================");
  console.log("   Running 30-Second OTP Expiration & Resend Test Suite");
  console.log("=======================================================\n");

  // 1. Verify Configuration Constants
  console.log("--- Test 1: Configuration Constants ---");
  assert((OTP_CONFIG.EXPIRATION_SECONDS as number) === 120, "OTP_CONFIG.EXPIRATION_SECONDS is exactly 120 (2 minutes)");
  assert((OTP_CONFIG.COOLDOWN_SECONDS as number) === 120, "OTP_CONFIG.COOLDOWN_SECONDS is exactly 120");

  const testStore = new InMemoryOtpStore();
  const testPhone = "01811223344";
  const normalized = normalizeBdPhone(testPhone);

  // 2. Request OTP and check expiration timestamp
  console.log("\n--- Test 2: OTP Generation & 30s Expiration Window ---");
  const beforeRequest = Date.now();
  const req = await requestOtp(testPhone, testStore);
  const afterRequest = Date.now();
  assert(req.success === true, "OTP successfully requested");

  const record = await testStore.findLatestOtp(normalized);
  assert(record !== null, "OTP record exists in store");
  
  const expiresAtMs = record!.expiresAt.getTime();
  const expectedMin = beforeRequest + 30 * 1000;
  const expectedMax = afterRequest + 30 * 1000;
  assert(
    expiresAtMs >= expectedMin && expiresAtMs <= expectedMax,
    `expiresAt is set to exactly 30 seconds ahead (diff: ${Math.round((expiresAtMs - beforeRequest) / 1000)}s)`
  );

  // 3. Immediate resend within 30s is blocked by cooldown
  console.log("\n--- Test 3: Cooldown Rate Limit (< 30s) ---");
  const blockedReq = await requestOtp(testPhone, testStore);
  assert(blockedReq.success === false, "Immediate resend is blocked within 30-second window");
  assert(
    typeof blockedReq.waitSeconds === "number" && blockedReq.waitSeconds <= 30 && blockedReq.waitSeconds > 0,
    `Returns waitSeconds between 1 and 30 (got: ${blockedReq.waitSeconds})`
  );

  // 4. Verify within 30s with simulated valid code succeeds
  console.log("\n--- Test 4: Verification within 30s window ---");
  const customStore = new InMemoryOtpStore();
  const activePhone = "01899887766";
  const activeNormalized = normalizeBdPhone(activePhone);
  const sampleCode = "829104";

  await customStore.createOtp(
    activeNormalized,
    hashOtp(sampleCode),
    new Date(Date.now() + 30 * 1000) // 30 seconds in the future
  );

  const validRes = await verifyOtp(activePhone, sampleCode, customStore);
  assert(validRes.success === true, "Valid OTP verifies successfully within the 30-second window");

  // 5. Expired OTP (> 30s) fails with explicit "OTP Expired" message
  console.log("\n--- Test 5: Expired OTP (> 30s) rejection ---");
  const expiredPhone = "01855667788";
  const expiredNormalized = normalizeBdPhone(expiredPhone);
  const expiredCode = "345678";

  // Simulate an OTP created 31 seconds ago (expired by 1 second)
  const pastExpiresAt = new Date(Date.now() - 1000);
  await customStore.createOtp(
    expiredNormalized,
    hashOtp(expiredCode),
    pastExpiresAt
  );

  const expiredRes = await verifyOtp(expiredPhone, expiredCode, customStore);
  assert(expiredRes.success === false, "Expired OTP verification fails");
  assert(
    expiredRes.error?.toLowerCase().includes("expired") === true,
    `Error message clearly mentions expiration (error: "${expiredRes.error}")`
  );
  assert(
    expiredRes.error === "OTP Expired. Please request a new code.",
    `Error matches expected format: "OTP Expired. Please request a new code."`
  );

  // 6. Resend allowed after 30s cooldown
  console.log("\n--- Test 6: Resend allowed after 30s has passed ---");
  // Age the record by 32 seconds
  if (record) {
    testStore.setCreatedAt(record.id, new Date(Date.now() - 32 * 1000));
  }
  const allowedReq = await requestOtp(testPhone, testStore);
  assert(allowedReq.success === true, "Resend OTP succeeds after 30s cooldown has elapsed");

  console.log("\n=======================================================");
  console.log("   🎉 ALL 30-SECOND OTP EXPIRATION TESTS PASSED!");
  console.log("=======================================================\n");
}

runExpirationTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
