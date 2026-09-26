/**
 * Comprehensive Verification Suite for OTP UX & DB Best Practices:
 * 1. Single Resend / Expired Cooldown Bypass ("try again problem" resolved)
 * 2. Database Invalidation of Previous Unverified OTPs on New Request
 * 3. Database State Handling for Invalid OTP (Attempt Increment & Lockout)
 * 4. Database State Handling for Expired OTP (Mark Expired in DB)
 * 5. Database State Handling for Valid Users (ACTIVE user creation & cleanup)
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

async function runTestSuite() {
  console.log("\n==================================================================");
  console.log("   🧪 Running OTP UX & DB Best Practices Verification Suite");
  console.log("==================================================================\n");

  _resetMemoryUsers();
  _resetMemoryPendingRegistrations();

  const { db } = await import("../src/lib/db");

  // ---------------------------------------------------------------------------
  // Suite 1: Database Invalidation of Stale Unverified OTPs on New Request
  // ---------------------------------------------------------------------------
  console.log("--- Suite 1: Invalidation of Previous OTPs in Store/DB ---");
  const phone1 = "01788111111";
  const normalizedPhone1 = normalizeBdPhone(phone1);
  const store1 = new InMemoryOtpStore();

  // Create an initial OTP
  const res1 = await requestOtp(phone1, store1);
  assert(res1.success === true, "Initial OTP request succeeds");
  const firstOtp = await store1.findLatestOtp(normalizedPhone1);
  assert(firstOtp !== null, "First OTP record exists");

  // Age the record so it expires
  store1.setCreatedAt(firstOtp!.id, new Date(Date.now() - 130 * 1000));
  firstOtp!.expiresAt = new Date(Date.now() - 10 * 1000);

  // Request a replacement OTP
  const res2 = await requestOtp(phone1, store1);
  assert(res2.success === true, "Replacement OTP request succeeds");

  const latestOtp = await store1.findLatestOtp(normalizedPhone1);
  assert(latestOtp !== null && latestOtp.id !== firstOtp!.id, "New OTP record is distinct from the old one");
  assert(firstOtp!.expiresAt.getTime() === 0, "Older unverified OTP was marked expired (0) in DB/store");

  // ---------------------------------------------------------------------------
  // Suite 2: 'Try Again' & Cooldown Bypass for Expired / Locked OTPs
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 2: Cooldown Bypass for Expired / Locked OTPs (Solving 'Try Again') ---");
  const phone2 = "01788222222";
  const normalizedPhone2 = normalizeBdPhone(phone2);
  const store2 = new InMemoryOtpStore();

  // Create an OTP and immediately exhaust 5 failed attempts (lockout)
  await requestOtp(phone2, store2);
  for (let i = 1; i <= 5; i++) {
    await verifyOtp(phone2, "000000", store2);
  }

  const lockedOtp = await store2.findLatestOtp(normalizedPhone2);
  assert(lockedOtp!.attempts >= 5, "OTP record has 5 failed attempts in DB");

  // User tries to request a new code immediately:
  // Under the old bug, cooldown blocked them for 120s!
  // Under the new best-practice fix, cooldown is bypassed because the previous OTP is dead!
  const retryReq = await requestOtp(phone2, store2);
  assert(retryReq.success === true, "Locked user can immediately request a new OTP without cooldown blocking");

  // ---------------------------------------------------------------------------
  // Suite 3: Database Handling for Invalid OTP
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 3: DB Record Mutation on Invalid OTP Attempts ---");
  const phone3 = "01788333333";
  const normalizedPhone3 = normalizeBdPhone(phone3);
  const store3 = new InMemoryOtpStore();

  await requestOtp(phone3, store3);
  const recordBefore = await store3.findLatestOtp(normalizedPhone3);
  assert(recordBefore!.attempts === 0, "Initial attempts in DB is 0");

  // Submit invalid OTP
  const fail1 = await verifyOtp(phone3, "999999", store3);
  assert(!fail1.success && fail1.remainingAttempts === 4, "Invalid OTP reports 4 remaining attempts");

  const recordAfter = await store3.findLatestOtp(normalizedPhone3);
  assert(recordAfter!.attempts === 1, "Attempts column incremented to 1 in DB");

  // ---------------------------------------------------------------------------
  // Suite 4: Database State Handling for Expired OTP
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 4: DB Mutation on Expired OTP Verification ---");
  const phone4 = "01788444444";
  const normalizedPhone4 = normalizeBdPhone(phone4);
  const store4 = new InMemoryOtpStore();

  await store4.createOtp(normalizedPhone4, hashOtp("555555"), new Date(Date.now() - 5000));
  const expVerify = await verifyOtp(phone4, "555555", store4);
  assert(!expVerify.success, "Verification of expired OTP fails");
  assert(expVerify.error === "OTP Expired. Please request a new code.", "Exact standard error returned");

  const expRecord = await store4.findLatestOtp(normalizedPhone4);
  assert(expRecord!.expiresAt.getTime() === 0, "Expired OTP is marked dead (expiresAt=0) in DB/store");

  // ---------------------------------------------------------------------------
  // Suite 5: Database State for Valid Users
  // ---------------------------------------------------------------------------
  console.log("\n--- Suite 5: DB Operations for Valid User Activation ---");
  const phone5 = "01788555555";
  const normalizedPhone5 = normalizeBdPhone(phone5);

  // Clean DB before test
  await db.user.deleteMany({ where: { phone: normalizedPhone5 } }).catch(() => {});
  await db.pendingRegistration.deleteMany({ where: { phone: normalizedPhone5 } }).catch(() => {});

  const passHash = await bcrypt.hash("UserStrongPassword123!", 10);
  await savePendingRegistration({
    name: "Valid User Test",
    phone: normalizedPhone5,
    email: "validuser@felna.com",
    passwordHash: passHash,
    divisionId: "div_dhaka",
    districtId: "dist_dhaka",
    upazilaId: "upz_dhanmondi",
    address: "Road 10, Dhanmondi",
  });

  const pendingInDb = await findPendingRegistrationByPhone(normalizedPhone5);
  assert(pendingInDb !== null, "PendingRegistration created in DB");

  const userBefore = await findUserByPhone(normalizedPhone5);
  assert(userBefore === null, "User table completely empty prior to verification");

  // Dispatch and verify valid OTP
  const customStore = new InMemoryOtpStore();
  const knownCode = "123456";
  await customStore.createOtp(normalizedPhone5, hashOtp(knownCode), new Date(Date.now() + 120 * 1000));

  const validVer = await verifyOtp(normalizedPhone5, knownCode, customStore);
  assert(validVer.success === true, "Valid OTP verification succeeds");

  // Create active user and purge pending registration
  const user = await createUser({
    name: pendingInDb!.name,
    phone: pendingInDb!.phone,
    email: pendingInDb!.email,
    passwordHash: pendingInDb!.passwordHash,
    divisionId: pendingInDb!.divisionId,
    districtId: pendingInDb!.districtId,
    upazilaId: pendingInDb!.upazilaId,
    address: pendingInDb!.address,
    status: USER_STATUS.ACTIVE,
  });
  await deletePendingRegistration(normalizedPhone5);

  const activeUser = await findUserByPhone(normalizedPhone5);
  assert(activeUser !== null && activeUser.status === USER_STATUS.ACTIVE, "User is created in DB with status ACTIVE");
  assert(activeUser?.email === "validuser@felna.com", "User email correctly stored in DB");

  const pendingAfter = await findPendingRegistrationByPhone(normalizedPhone5);
  assert(pendingAfter === null, "Pending registration purged from DB");

  console.log("\n==================================================================");
  console.log("   🎉 ALL OTP UX & DB BEST PRACTICE TESTS PASSED SUCCESSFULLY!");
  console.log("==================================================================\n");
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
