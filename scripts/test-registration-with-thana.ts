import "dotenv/config";
process.env.MOCK_SMS = "true";

import { db } from "../src/lib/db";
import { registerSchema } from "../src/lib/validations/auth";
import {
  savePendingRegistration,
  findPendingRegistrationByPhone,
  deletePendingRegistration,
} from "../src/lib/pending-registration";
import { createUser, findUserByPhone } from "../src/lib/user";
import {
  verifyOtp,
  InMemoryOtpStore,
  hashOtp,
} from "../src/lib/sms";
import { USER_STATUS } from "../src/lib/constants/roles";
import { getLocationsByDistrict } from "../src/lib/geo/bangladesh-address";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   Testing Registration Flow with Thana & Upazila");
  console.log("=======================================================\n");

  const testPhoneThana = "+8801988112233";
  const testEmailThana = "thana.user@example.com";

  const testPhoneUpazila = "+8801988445566";
  const testEmailUpazila = "upazila.user@example.com";

  // Clean any previous artifacts
  await db.user.deleteMany({
    where: { phone: { in: [testPhoneThana, testPhoneUpazila] } },
  }).catch(() => {});
  await db.pendingRegistration.deleteMany({
    where: { phone: { in: [testPhoneThana, testPhoneUpazila] } },
  }).catch(() => {});
  await db.otpVerification.deleteMany({
    where: { phone: { in: [testPhoneThana, testPhoneUpazila] } },
  }).catch(() => {});

  // =========================================================================
  // Case 1: Register with Metropolitan Thana (Dhaka -> Gulshan)
  // =========================================================================
  console.log("--- Case 1: Registration with Metropolitan Thana (Dhaka -> Gulshan) ---");

  const dhakaLocations = getLocationsByDistrict("dist_dhaka");
  const gulshan = dhakaLocations.find((l) => l.name === "Gulshan");
  assert(gulshan !== undefined, "Gulshan thana option found in Dhaka");
  assert(gulshan?.type === "thana", "Gulshan is identified as a Thana");

  const thanaRegistrationInput = {
    name: "Shakib Al Hasan",
    phone: "01988112233",
    email: testEmailThana,
    divisionId: "div_dhaka",
    districtId: "dist_dhaka",
    upazilaId: gulshan!.id,
    address: "Road 11, House 24, Block D, Gulshan 1",
    password: "Password123",
    confirmPassword: "Password123",
  };

  // 1. Zod Validation
  const valResult1 = registerSchema.safeParse(thanaRegistrationInput);
  assert(valResult1.success, "Registration schema accepts Metropolitan Thana input");

  // 2. Pending Registration Holding
  await savePendingRegistration({
    name: thanaRegistrationInput.name,
    phone: testPhoneThana,
    email: thanaRegistrationInput.email,
    passwordHash: "mock_hashed_password",
    divisionId: thanaRegistrationInput.divisionId,
    districtId: thanaRegistrationInput.districtId,
    upazilaId: thanaRegistrationInput.upazilaId,
    address: thanaRegistrationInput.address,
  });

  const pending1 = await findPendingRegistrationByPhone(testPhoneThana);
  assert(pending1 !== null, "Pending registration saved successfully for thana user");
  assert(pending1?.upazilaId === gulshan!.id, "Pending registration contains correct thana ID");

  // Verify that User table has NOT been touched yet
  const userBeforeOtp1 = await db.user.findUnique({ where: { phone: testPhoneThana } });
  assert(userBeforeOtp1 === null, "STRICT RULE: Main User record does NOT exist before OTP verification");

  // 3. OTP Setup & Verification using custom store
  const store1 = new InMemoryOtpStore();
  const knownOtp1 = "123456";
  await store1.createOtp(
    testPhoneThana,
    hashOtp(knownOtp1),
    new Date(Date.now() + 120 * 1000)
  );

  const verifyRes1 = await verifyOtp(testPhoneThana, knownOtp1, store1);
  assert(verifyRes1.success, "OTP verified successfully for thana user");

  // 4. Final Activation & User Creation in Main DB with Foreign Keys
  const activatedUser1 = await createUser({
    name: pending1!.name,
    phone: pending1!.phone,
    email: pending1!.email,
    passwordHash: pending1!.passwordHash,
    divisionId: pending1!.divisionId,
    districtId: pending1!.districtId,
    upazilaId: pending1!.upazilaId,
    address: pending1!.address,
    status: USER_STATUS.ACTIVE,
  });

  await deletePendingRegistration(testPhoneThana);

  // 5. DB Verification with Relations
  const fetchedUser1 = await db.user.findUnique({
    where: { id: activatedUser1.id },
    include: {
      division: true,
      district: true,
      upazila: true,
    },
  });

  assert(fetchedUser1 !== null, "User activated and fetched from PostgreSQL");
  assert(fetchedUser1?.division?.name === "Dhaka", "User division relation matches Dhaka");
  assert(fetchedUser1?.district?.name === "Dhaka", "User district relation matches Dhaka");
  assert(fetchedUser1?.upazila?.name === "Gulshan", "User thana relation correctly resolves to Gulshan in PostgreSQL");
  console.log(`✅ Thana User DB Record: ${fetchedUser1?.name} residing in ${fetchedUser1?.upazila?.name}, ${fetchedUser1?.district?.name}`);

  // =========================================================================
  // Case 2: Register with Non-Metropolitan Upazila (Tangail -> Mirzapur)
  // =========================================================================
  console.log("\n--- Case 2: Registration with Upazila (Tangail -> Mirzapur) ---");

  const tangailLocations = getLocationsByDistrict("dist_tangail");
  const mirzapur = tangailLocations.find((l) => l.name === "Mirzapur");
  assert(mirzapur !== undefined, "Mirzapur upazila option found in Tangail");
  assert(mirzapur?.type === "upazila", "Mirzapur is identified as an Upazila");

  const upazilaRegistrationInput = {
    name: "Mushfiqur Rahim",
    phone: "01988445566",
    email: testEmailUpazila,
    divisionId: "div_dhaka",
    districtId: "dist_tangail",
    upazilaId: mirzapur!.id,
    address: "Village Gorai, Mirzapur, Tangail",
    password: "Password123",
    confirmPassword: "Password123",
  };

  const valResult2 = registerSchema.safeParse(upazilaRegistrationInput);
  assert(valResult2.success, "Registration schema accepts Upazila input");

  await savePendingRegistration({
    name: upazilaRegistrationInput.name,
    phone: testPhoneUpazila,
    email: upazilaRegistrationInput.email,
    passwordHash: "mock_hashed_password",
    divisionId: upazilaRegistrationInput.divisionId,
    districtId: upazilaRegistrationInput.districtId,
    upazilaId: upazilaRegistrationInput.upazilaId,
    address: upazilaRegistrationInput.address,
  });

  const store2 = new InMemoryOtpStore();
  const knownOtp2 = "654321";
  await store2.createOtp(
    testPhoneUpazila,
    hashOtp(knownOtp2),
    new Date(Date.now() + 120 * 1000)
  );

  const verifyRes2 = await verifyOtp(testPhoneUpazila, knownOtp2, store2);
  assert(verifyRes2.success, "OTP verified for upazila registration");

  const activatedUser2 = await createUser({
    name: upazilaRegistrationInput.name,
    phone: testPhoneUpazila,
    email: upazilaRegistrationInput.email,
    passwordHash: "mock_hashed_password",
    divisionId: upazilaRegistrationInput.divisionId,
    districtId: upazilaRegistrationInput.districtId,
    upazilaId: upazilaRegistrationInput.upazilaId,
    address: upazilaRegistrationInput.address,
    status: USER_STATUS.ACTIVE,
  });

  await deletePendingRegistration(testPhoneUpazila);

  const fetchedUser2 = await db.user.findUnique({
    where: { id: activatedUser2.id },
    include: {
      division: true,
      district: true,
      upazila: true,
    },
  });

  assert(fetchedUser2 !== null, "Upazila user activated and fetched from PostgreSQL");
  assert(fetchedUser2?.division?.name === "Dhaka", "Upazila user division matches Dhaka");
  assert(fetchedUser2?.district?.name === "Tangail", "Upazila user district matches Tangail");
  assert(fetchedUser2?.upazila?.name === "Mirzapur", "Upazila user relation correctly resolves to Mirzapur in PostgreSQL");
  console.log(`✅ Upazila User DB Record: ${fetchedUser2?.name} residing in ${fetchedUser2?.upazila?.name}, ${fetchedUser2?.district?.name}`);

  // =========================================================================
  // Clean Up Test Data
  // =========================================================================
  await db.user.deleteMany({
    where: { phone: { in: [testPhoneThana, testPhoneUpazila] } },
  });

  console.log("\n=======================================================");
  console.log("   ✅ ALL THANA & UPAZILA REGISTRATION TESTS PASSED!");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
