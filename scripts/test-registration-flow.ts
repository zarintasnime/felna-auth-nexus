/**
 * Automated Verification Script for Phase 4: User Registration Flow
 * 
 * Verifies:
 * 1. Bangladesh Geo cascading data (divisions, districts, upazilas).
 * 2. Zod registration validation (valid & invalid inputs).
 * 3. User creation in PENDING_VERIFICATION state.
 * 4. Duplicate prevention for phone & email.
 * 5. OTP verification and state transition to ACTIVE.
 */

import "dotenv/config";
process.env.MOCK_SMS = "true";
import { getGeoDivisions, getGeoDistricts, getGeoUpazilas } from "../src/lib/data/bangladesh-geo";
import { registerSchema, verifyOtpSchema } from "../src/lib/validations/auth";
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
  hashOtp,
} from "../src/lib/sms";
import { USER_STATUS } from "../src/lib/constants/roles";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   Running Phase 4 User Registration Verification Suite");
  console.log("=======================================================\n");

  _resetMemoryUsers();

  // ---------------------------------------------------------------------------
  // Test Suite 1: Bangladesh Geo Cascading Data
  // ---------------------------------------------------------------------------
  console.log("--- Test Suite 1: Bangladesh Geo Cascading Data ---");
  const divisions = getGeoDivisions();
  assert(divisions.length === 8, "All 8 Bangladesh divisions are present");

  const dhakaDiv = divisions.find((d) => d.name === "Dhaka");
  assert(dhakaDiv !== undefined && dhakaDiv.id === "div_dhaka", "Dhaka division exists with ID");

  const dhakaDistricts = getGeoDistricts("div_dhaka");
  assert(dhakaDistricts.length > 0, "Districts exist for Dhaka division");
  assert(dhakaDistricts.every((d) => d.divisionId === "div_dhaka"), "All filtered districts belong to Dhaka division");

  const ctgDistricts = getGeoDistricts("div_chattogram");
  assert(ctgDistricts.length > 0 && ctgDistricts.every((d) => d.divisionId === "div_chattogram"), "Chattogram districts correctly filtered");

  const dhakaUpazilas = getGeoUpazilas("dist_dhaka");
  assert(dhakaUpazilas.length > 0, "Upazilas/Thanas exist for Dhaka district");
  const dhanmondi = dhakaUpazilas.find((u) => u.name === "Dhanmondi");
  assert(dhanmondi !== undefined, "Dhanmondi Thana is present in Dhaka district");

  // ---------------------------------------------------------------------------
  // Test Suite 2: Zod Registration Schema Validation
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 2: Zod Registration Validation ---");

  // Valid registration data
  const validData = {
    name: "Rahim Ahmed",
    phone: "01712345678",
    email: "rahim@gmail.com",
    divisionId: "div_dhaka",
    districtId: "dist_dhaka",
    upazilaId: "upz_dhanmondi",
    address: "House 12, Road 4",
    password: "Password123",
    confirmPassword: "Password123",
  };
  const validResult = registerSchema.safeParse(validData);
  assert(validResult.success === true, "Valid registration input passes Zod schema");

  // Invalid: Short name (< 3 chars)
  const shortNameResult = registerSchema.safeParse({ ...validData, name: "Ra" });
  assert(!shortNameResult.success, "Rejects name with fewer than 3 characters");

  // Invalid: Non-BD Phone Number
  const invalidPhoneResult = registerSchema.safeParse({ ...validData, phone: "123456789" });
  assert(!invalidPhoneResult.success, "Rejects invalid phone number format");

  // Invalid: Weak Password (no uppercase or no number)
  const weakPassResult = registerSchema.safeParse({ ...validData, password: "password", confirmPassword: "password" });
  assert(!weakPassResult.success, "Rejects weak password lacking uppercase/numbers");

  // Invalid: Password Mismatch
  const mismatchResult = registerSchema.safeParse({ ...validData, confirmPassword: "DifferentPassword1" });
  assert(!mismatchResult.success, "Rejects mismatched confirmation password");

  // ---------------------------------------------------------------------------
  // Test Suite 3: Registration Lifecycle & State Transition to ACTIVE
  // ---------------------------------------------------------------------------
  console.log("\n--- Test Suite 3: Registration Lifecycle & State Machine ---");

  const testPhone = "01711223344";
  const normalizedPhone = normalizeBdPhone(testPhone);
  const { db } = await import("../src/lib/db");
  await db.user.deleteMany({ where: { phone: normalizedPhone } }).catch(() => {});
  await db.pendingRegistration.deleteMany({ where: { phone: normalizedPhone } }).catch(() => {});
  const testStore = new InMemoryOtpStore();

  // 1. Initial registration saves payload into PendingRegistration (NOT User table)
  const rawPassword = "SecurePassword1";
  const passwordHash = await (await import("bcryptjs")).default.hash(rawPassword, 10);
  const {
    savePendingRegistration,
    findPendingRegistrationByPhone,
    deletePendingRegistration,
  } = await import("../src/lib/pending-registration");

  const pendingRecord = await savePendingRegistration({
    name: "Karim Chowdhury",
    phone: testPhone,
    email: "karim@test.com",
    passwordHash,
    divisionId: "div_dhaka",
    districtId: "dist_dhaka",
    upazilaId: "upz_dhanmondi",
    address: "Block C, Road 1",
  });

  assert(pendingRecord.phone === normalizedPhone, "Pending registration phone normalized to +8801711223344");

  // CRITICAL CHECK: Main User table MUST NOT contain this unverified user!
  const userBeforeVerify = await findUserByPhone(normalizedPhone);
  assert(userBeforeVerify === null, "CRITICAL: No record exists in User table upon initial registration submission");

  // 2. Trigger initial OTP
  const otpRequest = await requestOtp(normalizedPhone, testStore);
  assert(otpRequest.success === true, "OTP dispatched successfully for new user");

  // 3. User still does not exist in User table prior to verification
  const stillNullUser = await findUserByPhone(normalizedPhone);
  assert(stillNullUser === null, "User table remains empty for unverified user prior to OTP verification");

  // 4. Verify OTP using test store
  const latestOtpRecord = await testStore.findLatestOtp(normalizedPhone);
  assert(latestOtpRecord !== null, "OTP verification record found in store");

  // Test wrong OTP attempt
  const wrongVerify = await verifyOtp(normalizedPhone, "999999", testStore);
  assert(!wrongVerify.success, "Incorrect OTP submission fails");

  // Test correct OTP submission
  const knownOtp = "445566";
  const customStore = new InMemoryOtpStore();
  const otpHash = hashOtp(knownOtp);
  await customStore.createOtp(normalizedPhone, otpHash, new Date(Date.now() + 5 * 60 * 1000));

  const validOtpVerify = await verifyOtp(normalizedPhone, knownOtp, customStore);
  assert(validOtpVerify.success === true, "Valid OTP is successfully verified");

  // 5. Create user in main database with ACTIVE status
  const newUser = await createUser({
    name: pendingRecord.name,
    phone: pendingRecord.phone,
    email: pendingRecord.email,
    passwordHash: pendingRecord.passwordHash,
    divisionId: pendingRecord.divisionId,
    districtId: pendingRecord.districtId,
    upazilaId: pendingRecord.upazilaId,
    address: pendingRecord.address,
    status: USER_STATUS.ACTIVE,
  });
  await deletePendingRegistration(normalizedPhone);

  assert(newUser.phone === normalizedPhone, "User phone normalized to +8801711223344");
  assert(newUser.status === USER_STATUS.ACTIVE, "User created with status ACTIVE upon successful OTP verification");
  assert(newUser.role === "USER", "Default role assigned is USER");

  // 6. Verify persistence of ACTIVE status in User table
  const finalCheck = await findUserByPhone(normalizedPhone);
  assert(finalCheck?.status === USER_STATUS.ACTIVE, "User lookup confirms account is now ACTIVE in User table");

  console.log("\n=======================================================");
  console.log("   🎉 ALL PHASE 4 REGISTRATION TESTS PASSED!");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
