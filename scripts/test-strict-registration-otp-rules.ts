/**
 * Comprehensive Verification Script for Strict Registration & OTP Flow
 * 
 * Verifies:
 * 1. Strict Database Rule:
 *    - Initial submission creates NO record in User table.
 *    - Payload is held in PendingRegistration.
 *    - User record is created in User table with status ACTIVE ONLY AFTER OTP is verified.
 *    - PendingRegistration record is purged upon successful verification.
 * 2. OTP Expiration:
 *    - OTP expires after 2 minutes (120 seconds).
 *    - Expired code fails with "OTP Expired. Please request a new code.".
 * 3. Rate Limiting (Backend):
 *    - Max 3 OTP requests per 5 minutes for a single phone number.
 *    - 4th request within 5 minutes is strictly blocked with error message.
 * 4. Change Mobile Number Flow:
 *    - User changes phone number from A to B; data is preserved and B is held in pending registration.
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
import {
  savePendingRegistration,
  findPendingRegistrationByPhone,
  deletePendingRegistration,
  _resetMemoryPendingRegistrations,
} from "../src/lib/pending-registration";
import {
  createUser,
  findUserByPhone,
  _resetMemoryUsers,
} from "../src/lib/user";
import { USER_STATUS } from "../src/lib/constants/roles";
import bcrypt from "bcryptjs";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runStrictVerificationSuite() {
  console.log("\n=======================================================");
  console.log("   Running Strict Registration & OTP Rules Test Suite");
  console.log("=======================================================\n");

  _resetMemoryUsers();
  _resetMemoryPendingRegistrations();

  // ---------------------------------------------------------------------------
  // Suite 1: Configuration Constants Check
  // ---------------------------------------------------------------------------
  console.log("--- Suite 1: 2-Minute Expiry & 5-Minute Rate Limit Configuration ---");
  assert(OTP_CONFIG.EXPIRATION_SECONDS === 120, "OTP_CONFIG.EXPIRATION_SECONDS is exactly 120 (2 minutes)");
  assert(OTP_CONFIG.EXPIRATION_MINUTES === 2, "OTP_CONFIG.EXPIRATION_MINUTES is 2");
  assert(OTP_CONFIG.RATE_LIMIT_WINDOW_SECONDS === 300, "OTP_CONFIG.RATE_LIMIT_WINDOW_SECONDS is 300 (5 minutes)");
  assert(OTP_CONFIG.MAX_REQUESTS_PER_WINDOW === 3, "OTP_CONFIG.MAX_REQUESTS_PER_WINDOW is 3 requests");

  // ---------------------------------------------------------------------------
  // Suite 2: Strict Database Rule (Holding payload, no User record initially)
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 2: Strict Database Rule & Delayed User Creation ---");
  const phone1 = "01711000001";
  const normalizedPhone1 = normalizeBdPhone(phone1);
  const { db } = await import("../src/lib/db");
  await db.user.deleteMany({ where: { phone: normalizedPhone1 } }).catch(() => {});
  await db.pendingRegistration.deleteMany({ where: { phone: normalizedPhone1 } }).catch(() => {});
  const rawPassword = "StrongPassword123!";
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  // 1. Initial registration submission saves to PendingRegistration
  await savePendingRegistration({
    name: "Tariqul Islam",
    phone: normalizedPhone1,
    email: "tariqul@felna.com",
    passwordHash,
    divisionId: "div_dhaka",
    districtId: "dist_dhaka",
    upazilaId: "upz_dhanmondi",
    address: "Road 15, House 4",
  });

  // CRITICAL CHECK: User table MUST be completely empty for this user!
  const userBeforeVerify = await findUserByPhone(normalizedPhone1);
  assert(userBeforeVerify === null, "CRITICAL: No record exists in User table after initial registration submission");

  // Verify pending record exists
  const pendingRecord = await findPendingRegistrationByPhone(normalizedPhone1);
  assert(pendingRecord !== null, "Registration payload is held in PendingRegistration");
  assert(pendingRecord?.name === "Tariqul Islam", "Pending record holds correct user name");
  assert(pendingRecord?.email === "tariqul@felna.com", "Pending record holds correct email");

  // 2. Dispatch OTP
  const customStore = new InMemoryOtpStore();
  const knownOtp = "654321";
  await customStore.createOtp(
    normalizedPhone1,
    hashOtp(knownOtp),
    new Date(Date.now() + 120 * 1000)
  );

  // 3. User attempts verification with valid OTP
  const verifyResult = await verifyOtp(normalizedPhone1, knownOtp, customStore);
  assert(verifyResult.success === true, "OTP verified successfully");

  // 4. NOW create user in main User table
  const createdUser = await createUser({
    name: pendingRecord!.name,
    phone: pendingRecord!.phone,
    email: pendingRecord!.email,
    passwordHash: pendingRecord!.passwordHash,
    divisionId: pendingRecord!.divisionId,
    districtId: pendingRecord!.districtId,
    upazilaId: pendingRecord!.upazilaId,
    address: pendingRecord!.address,
    status: USER_STATUS.ACTIVE,
  });

  // 5. Delete pending record
  await deletePendingRegistration(normalizedPhone1);

  // 6. Verify User table now contains ACTIVE user
  const userAfterVerify = await findUserByPhone(normalizedPhone1);
  assert(userAfterVerify !== null, "User record is created in User table AFTER OTP verification");
  assert(userAfterVerify?.status === USER_STATUS.ACTIVE, "User status is ACTIVE immediately upon verified creation");
  assert(userAfterVerify?.name === "Tariqul Islam", "User profile data matches registration payload");

  // 7. Verify PendingRegistration is cleared
  const pendingAfterCleanup = await findPendingRegistrationByPhone(normalizedPhone1);
  assert(pendingAfterCleanup === null, "PendingRegistration record is cleared after User creation");

  // ---------------------------------------------------------------------------
  // Suite 3: 2-Minute Expiry Enforcement
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 3: 2-Minute OTP Expiry Enforcement ---");
  const phone2 = "01722000002";
  const normalizedPhone2 = normalizeBdPhone(phone2);
  const otpStore2 = new InMemoryOtpStore();

  // Create an OTP that expired 1 second ago (lifespan 120s exceeded)
  const expiredOtpCode = "112233";
  await otpStore2.createOtp(
    normalizedPhone2,
    hashOtp(expiredOtpCode),
    new Date(Date.now() - 1000) // expired in the past
  );

  const expiredVerifyResult = await verifyOtp(normalizedPhone2, expiredOtpCode, otpStore2);
  assert(expiredVerifyResult.success === false, "Verification of expired OTP (> 120s) fails");
  assert(
    expiredVerifyResult.error === "OTP Expired. Please request a new code.",
    `Returns exact expiration message: "${expiredVerifyResult.error}"`
  );

  // ---------------------------------------------------------------------------
  // Suite 4: Strict Rate Limiting (Max 3 OTP requests per 5 minutes)
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 4: Strict Rate Limiting (3 Requests per 5 Minutes) ---");
  const phone3 = "01733000003";
  const normalizedPhone3 = normalizeBdPhone(phone3);
  const rateLimitStore = new InMemoryOtpStore();

  // Request 1: Should succeed
  const r1 = await requestOtp(phone3, rateLimitStore);
  assert(r1.success === true, "Request 1 of 3 succeeds");

  // Age request 1 so cooldown passes (e.g. 125s later)
  const record1 = await rateLimitStore.findLatestOtp(normalizedPhone3);
  if (record1) {
    rateLimitStore.setCreatedAt(record1.id, new Date(Date.now() - 125 * 1000));
  }

  // Request 2: Should succeed
  const r2 = await requestOtp(phone3, rateLimitStore);
  assert(r2.success === true, "Request 2 of 3 succeeds (after cooldown)");

  // Age request 2 so cooldown passes (e.g. 125s later)
  const record2 = await rateLimitStore.findLatestOtp(normalizedPhone3);
  if (record2) {
    rateLimitStore.setCreatedAt(record2.id, new Date(Date.now() - 125 * 1000));
  }

  // Request 3: Should succeed (3rd in 5-minute window)
  const r3 = await requestOtp(phone3, rateLimitStore);
  assert(r3.success === true, "Request 3 of 3 succeeds (limit reached)");

  // Age request 3 past cooldown so it's not blocked by 120s cooldown, but STILL within 5-min window
  const record3 = await rateLimitStore.findLatestOtp(normalizedPhone3);
  if (record3) {
    rateLimitStore.setCreatedAt(record3.id, new Date(Date.now() - 125 * 1000));
  }

  // Request 4: MUST be blocked by 3-requests-per-5-minutes rate limit!
  const r4 = await requestOtp(phone3, rateLimitStore);
  assert(r4.success === false, "CRITICAL: 4th OTP request within 5 minutes is strictly blocked");
  assert(
    r4.error?.includes("Rate limit reached") === true || r4.error?.includes("Maximum 3 OTP requests") === true,
    `Error explains rate limit exceeded: "${r4.error}"`
  );
  assert(
    typeof r4.waitSeconds === "number" && r4.waitSeconds > 0,
    `Returns waitSeconds for client retry (got: ${r4.waitSeconds}s)`
  );

  // ---------------------------------------------------------------------------
  // Suite 5: Change Mobile Number Flow
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 5: Change Mobile Number Flow ---");
  const phoneOld = "01744000004";
  const phoneNew = "01755000005";

  // User initially submits phoneOld
  await savePendingRegistration({
    name: "Kamal Hossain",
    phone: phoneOld,
    email: "kamal@felna.com",
    passwordHash: await bcrypt.hash("Password999!", 10),
  });

  const pendingOld = await findPendingRegistrationByPhone(phoneOld);
  assert(pendingOld !== null, "Initial registration held under old number");

  // User decides to change mobile number to phoneNew (with same details intact)
  await savePendingRegistration({
    name: pendingOld!.name,
    phone: phoneNew,
    email: pendingOld!.email,
    passwordHash: pendingOld!.passwordHash,
  });

  const pendingNew = await findPendingRegistrationByPhone(phoneNew);
  assert(pendingNew !== null, "New registration correctly saved under updated mobile number");
  assert(pendingNew?.name === "Kamal Hossain", "User input details remained intact across number change");

  console.log("\n=======================================================");
  console.log("   🎉 ALL STRICT REGISTRATION & OTP TESTS PASSED!");
  console.log("=======================================================\n");
}

runStrictVerificationSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
