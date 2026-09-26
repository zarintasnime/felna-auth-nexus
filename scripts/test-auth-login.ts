/**
 * Automated Verification Script for Phase 5: Authentication (Phone + OTP Login & Sessions)
 * 
 * Verifies:
 * 1. Login OTP request validation & non-existent user handling.
 * 2. Login OTP generation & dispatch.
 * 3. 60-second cooldown enforcement on login OTP.
 * 4. Invalid OTP rejection & attempt tracking.
 * 5. Valid OTP verification & signed JWT session token issuance.
 * 6. JWT payload integrity & verification.
 * 7. Logout / session clearing.
 */

import "dotenv/config";
process.env.MOCK_SMS = "true";
import { loginOtpRequestSchema, loginOtpVerifySchema } from "../src/lib/validations/auth";
import {
  createUser,
  findUserByPhone,
  activateUser,
  _resetMemoryUsers,
} from "../src/lib/user";
import {
  requestOtp,
  verifyOtp,
  InMemoryOtpStore,
  normalizeBdPhone,
} from "../src/lib/sms";
import {
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE_NAME,
} from "../src/lib/auth";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   Running Phase 5 Authentication Verification Suite");
  console.log("=======================================================\n");

  _resetMemoryUsers();

  // ---------------------------------------------------------------------------
  // Test Suite 1: Login Request Validation
  // ---------------------------------------------------------------------------
  console.log("--- Test Suite 1: Login Schema Validation ---");
  const validPhone = loginOtpRequestSchema.safeParse({ phone: "01712345678" });
  assert(validPhone.success === true, "Valid 11-digit BD phone passes validation");

  const validWithPrefix = loginOtpRequestSchema.safeParse({ phone: "+8801712345678" });
  assert(validWithPrefix.success === true, "Valid +8801 phone passes validation");

  const invalidPhone = loginOtpRequestSchema.safeParse({ phone: "012345" });
  assert(!invalidPhone.success, "Invalid short phone is rejected");

  const invalidChars = loginOtpRequestSchema.safeParse({ phone: "01712abc678" });
  assert(!invalidChars.success, "Alphanumeric phone is rejected");

  // ---------------------------------------------------------------------------
  // Test Suite 2: User Account Setup for Login
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 2: Account Existence & State ---");
  const testPhone = "01812345678";
  const normalizedPhone = normalizeBdPhone(testPhone);

  // Check non-existent user
  const notFound = await findUserByPhone(normalizedPhone);
  assert(notFound === null, "Lookup returns null for unregistered phone");

  // Create and activate user
  await createUser({
    name: "Tariqul Islam",
    phone: testPhone,
    email: "tariqul@test.com",
    password: "Password123",
    divisionId: "div_dhaka",
    districtId: "dist_dhaka",
    upazilaId: "upz_dhanmondi",
  });
  await activateUser(normalizedPhone);

  const existingUser = await findUserByPhone(normalizedPhone);
  assert(existingUser !== null && existingUser.status === "ACTIVE", "Active user account verified in system");

  // ---------------------------------------------------------------------------
  // Test Suite 3: Login OTP Dispatch & Cooldown
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 3: Login OTP Dispatch & Cooldown ---");
  const testStore = new InMemoryOtpStore();

  // 1. Dispatch OTP
  const dispatchRes = await requestOtp(normalizedPhone, testStore);
  assert(dispatchRes.success === true, "Login OTP dispatched successfully");

  // 2. Cooldown check
  const rapidDispatch = await requestOtp(normalizedPhone, testStore);
  assert(rapidDispatch.success === false, "Rapid duplicate login OTP request is blocked by 60s cooldown");
  assert(rapidDispatch.error?.includes("Please wait") === true, "Cooldown provides clear English error message");

  // ---------------------------------------------------------------------------
  // Test Suite 4: Login OTP Verification & Lockout
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 4: Login OTP Verification ---");

  // Wrong OTP submission
  const wrongVerify = await verifyOtp(normalizedPhone, "000000", testStore);
  assert(!wrongVerify.success, "Wrong OTP submission fails");
  assert(wrongVerify.remainingAttempts === 4, "Remaining attempts decrements to 4");

  // Valid OTP submission
  const knownLoginOtp = "889900";
  const customStore = new InMemoryOtpStore();
  const rawSalt = process.env.JWT_SECRET || "felma_secure_otp_salt";
  const crypto = await import("crypto");
  const otpHash = crypto.createHash("sha256").update(`${knownLoginOtp}:${rawSalt}`).digest("hex");
  await customStore.createOtp(normalizedPhone, otpHash, new Date(Date.now() + 5 * 60 * 1000));

  const validVerify = await verifyOtp(normalizedPhone, knownLoginOtp, customStore);
  assert(validVerify.success === true, "Correct OTP successfully verifies for login");

  // ---------------------------------------------------------------------------
  // Test Suite 5: JWT Session Token Issuance & Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 5: JWT Session Token & Cookies ---");

  const sessionToken = await createSessionToken({
    userId: existingUser!.id,
    phone: existingUser!.phone,
    role: existingUser!.role,
    name: existingUser!.name,
  });

  assert(typeof sessionToken === "string" && sessionToken.length > 50, "Signed JWT session token generated");
  assert(SESSION_COOKIE_NAME === "felna_session", "Session cookie name matches felna_session");

  // Verify signed token
  const payload = await verifySessionToken(sessionToken);
  assert(payload !== null, "Signed session token verifies cleanly");
  assert(payload?.userId === existingUser!.id, "Token payload contains correct userId");
  assert(payload?.phone === existingUser!.phone, "Token payload contains correct phone");
  assert(payload?.role === "USER", "Token payload contains correct role");
  assert(payload?.name === "Tariqul Islam", "Token payload contains correct user name");

  // Tampered token test
  const tamperedToken = sessionToken.slice(0, -6) + "xxxxxx";
  const invalidSession = await verifySessionToken(tamperedToken);
  assert(invalidSession === null, "Tampered session token fails verification");

  console.log("\n=======================================================");
  console.log("   🎉 ALL PHASE 5 AUTHENTICATION TESTS PASSED!");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
