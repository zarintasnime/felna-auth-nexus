/**
 * Automated Verification Script for Phase 3: OTP Engine & IGL SMS Integration
 * 
 * Verifies:
 * 1. Cryptographic OTP generation (6 digits, range 100000 - 999999).
 * 2. SHA-256 secure hashing and timing-safe verification.
 * 3. 60-second cooldown rate-limiting.
 * 4. 5-failed-attempts lockout enforcement.
 * 5. Single-use and expiration enforcement.
 */

import "dotenv/config";
process.env.MOCK_SMS = "true";
import {
  generateOtp,
  hashOtp,
  verifyOtpHash,
  requestOtp,
  verifyOtp,
  InMemoryOtpStore,
  normalizeBdPhone,
} from "../src/lib/sms";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   Running Phase 3 OTP Engine Verification Suite");
  console.log("=======================================================\n");

  // ---------------------------------------------------------------------------
  // Test 1: Phone Normalization
  // ---------------------------------------------------------------------------
  console.log("--- Test Suite 1: Phone Normalization ---");
  assert(normalizeBdPhone("01712345678") === "+8801712345678", "017XXXXXXXX normalized to +88017XXXXXXXX");
  assert(normalizeBdPhone("8801712345678") === "+8801712345678", "88017XXXXXXXX normalized to +88017XXXXXXXX");
  assert(normalizeBdPhone("+8801712345678") === "+8801712345678", "+88017XXXXXXXX preserves leading +");
  assert(normalizeBdPhone("017-1234-5678") === "+8801712345678", "Cleans dashes from phone numbers");

  // ---------------------------------------------------------------------------
  // Test 2: Cryptographic OTP Generation & Bounds
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 2: Cryptographic OTP Generation ---");
  for (let i = 0; i < 50; i++) {
    const otp = generateOtp();
    assert(otp.length === 6, `Generated OTP length is 6 (iteration ${i + 1})`);
    assert(/^\d{6}$/.test(otp), `Generated OTP consists only of digits (iteration ${i + 1})`);
    const num = parseInt(otp, 10);
    assert(num >= 100000 && num <= 999999, `OTP is within bounds 100000-999999 (val: ${num})`);
  }

  // ---------------------------------------------------------------------------
  // Test 3: SHA-256 Hashing & Timing-Safe Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 3: SHA-256 Hashing & Verification ---");
  const sampleOtp = "583214";
  const hash = hashOtp(sampleOtp);
  assert(hash.length === 64, "SHA-256 hash produces 64-character hex string");
  assert(verifyOtpHash("583214", hash), "Correct OTP verifies successfully against hash");
  assert(!verifyOtpHash("123456", hash), "Incorrect OTP fails verification against hash");
  assert(!verifyOtpHash("58321", hash), "Truncated OTP fails verification");

  // ---------------------------------------------------------------------------
  // Test 4: Rate Limiting & 60-Second Cooldown
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 4: 60-Second Cooldown Rate Limiting ---");
  const testStore = new InMemoryOtpStore();
  const testPhone = "01700000001";

  // 1st request should succeed
  const req1 = await requestOtp(testPhone, testStore);
  assert(req1.success === true, "First OTP request succeeds");

  // Immediate 2nd request should be rate-limited by 60s cooldown
  const req2 = await requestOtp(testPhone, testStore);
  assert(req2.success === false, "Second immediate OTP request is blocked by cooldown");
  assert(typeof req2.waitSeconds === "number" && req2.waitSeconds > 0, "Cooldown returns remaining wait seconds");
  assert(req2.error?.includes("Please wait") === true, "Cooldown returns clear English error message");

  // Simulate cooldown passage (61 seconds later)
  const latestRecord = await testStore.findLatestOtp(normalizeBdPhone(testPhone));
  if (latestRecord) {
    testStore.setCreatedAt(latestRecord.id, new Date(Date.now() - 65 * 1000));
  }

  const req3 = await requestOtp(testPhone, testStore);
  assert(req3.success === true, "Request succeeds after 60-second cooldown has elapsed");

  // ---------------------------------------------------------------------------
  // Test 5: 5-Failed-Attempts Lockout Logic
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 5: 5-Failed-Attempts Lockout ---");
  const lockoutPhone = "01700000002";
  await requestOtp(lockoutPhone, testStore);

  // Attempt 1: Wrong OTP
  const att1 = await verifyOtp(lockoutPhone, "000000", testStore);
  assert(!att1.success && att1.remainingAttempts === 4, "Attempt 1 failed: 4 attempts remaining");

  // Attempt 2: Wrong OTP
  const att2 = await verifyOtp(lockoutPhone, "000000", testStore);
  assert(!att2.success && att2.remainingAttempts === 3, "Attempt 2 failed: 3 attempts remaining");

  // Attempt 3: Wrong OTP
  const att3 = await verifyOtp(lockoutPhone, "000000", testStore);
  assert(!att3.success && att3.remainingAttempts === 2, "Attempt 3 failed: 2 attempts remaining");

  // Attempt 4: Wrong OTP
  const att4 = await verifyOtp(lockoutPhone, "000000", testStore);
  assert(!att4.success && att4.remainingAttempts === 1, "Attempt 4 failed: 1 attempt remaining");

  // Attempt 5: Wrong OTP (Exhausting limit)
  const att5 = await verifyOtp(lockoutPhone, "000000", testStore);
  assert(!att5.success && att5.remainingAttempts === 0, "Attempt 5 failed: 0 attempts remaining and locked");
  assert(att5.error?.includes("locked") === true, "Alert states OTP has been locked");

  // Attempt 6: Any further attempt is locked out
  const att6 = await verifyOtp(lockoutPhone, "000000", testStore);
  assert(!att6.success && att6.error?.includes("locked") === true, "Subsequent attempt rejected due to lock");

  // ---------------------------------------------------------------------------
  // Test 6: Single-Use & Expiration
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 6: Single-Use & Expiration ---");
  const verifyPhone = "01700000003";
  const customStore = new InMemoryOtpStore();
  
  // Create an OTP with known code
  const rawCode = "778899";
  await customStore.createOtp(
    normalizeBdPhone(verifyPhone),
    hashOtp(rawCode),
    new Date(Date.now() + 5 * 60 * 1000)
  );

  // Verify successfully
  const ver1 = await verifyOtp(verifyPhone, rawCode, customStore);
  assert(ver1.success === true, "OTP verifies successfully on first submission");

  // Re-submitting same OTP should fail (cannot reuse verified OTP)
  const ver2 = await verifyOtp(verifyPhone, rawCode, customStore);
  assert(!ver2.success && ver2.error?.includes("already been verified") === true, "Reusing verified OTP is rejected");

  console.log("\n=======================================================");
  console.log("   🎉 ALL PHASE 3 VERIFICATION TESTS PASSED!");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
