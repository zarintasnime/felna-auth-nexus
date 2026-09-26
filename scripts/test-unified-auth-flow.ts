import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { createSessionToken, verifySessionToken } from "../src/lib/auth-token";
import { ROLES, USER_STATUS } from "../src/lib/constants/roles";

function assert(condition: any, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runE2ETests() {
  console.log("\n=======================================================");
  console.log("   🧪 RUNNING UNIFIED AUTH & CREDENTIAL FLOW TESTS");
  console.log("=======================================================\n");

  // 1. Test Super Admin exists and password matches
  console.log("--- 1. Testing Super Admin Test Account ---");
  const admin = await db.user.findFirst({
    where: { email: "admin@felma.com" },
  });
  assert(Boolean(admin), "Super Admin exists in database");
  assert(admin?.role === ROLES.ADMIN, "Super Admin role is ADMIN");
  assert(admin?.status === USER_STATUS.ACTIVE, "Super Admin status is ACTIVE");

  const adminPassMatch = await bcrypt.compare("AdminPassword123", admin!.passwordHash);
  assert(adminPassMatch === true, "Super Admin password matches 'AdminPassword123'");

  // 2. Test Normal User exists and password matches
  console.log("\n--- 2. Testing Normal User Test Account ---");
  const normalUser = await db.user.findFirst({
    where: { phone: "+8801712345678" },
  });
  assert(Boolean(normalUser), "Normal user Rahim exists in database");
  assert(normalUser?.role === ROLES.USER, "Normal user role is USER");
  assert(normalUser?.status === USER_STATUS.ACTIVE, "Normal user status is ACTIVE");

  const userPassMatch = await bcrypt.compare("UserPassword123", normalUser!.passwordHash);
  assert(userPassMatch === true, "Normal user password matches 'UserPassword123'");

  // 3. Test JWT Session Generation & Verification
  console.log("\n--- 3. Testing JWT Session Generation & Decoding ---");
  const adminToken = await createSessionToken({
    userId: admin!.id,
    phone: admin!.phone,
    role: admin!.role,
    name: admin!.name,
  });
  const decodedAdmin = await verifySessionToken(adminToken);
  assert(decodedAdmin !== null, "Admin session token is valid and signed");
  assert(decodedAdmin?.role === ROLES.ADMIN, "Admin session decoded role matches ADMIN");

  const userToken = await createSessionToken({
    userId: normalUser!.id,
    phone: normalUser!.phone,
    role: normalUser!.role,
    name: normalUser!.name,
  });
  const decodedUser = await verifySessionToken(userToken);
  assert(decodedUser !== null, "Normal user session token is valid and signed");
  assert(decodedUser?.role === ROLES.USER, "Normal user session decoded role matches USER");

  console.log("\n=======================================================");
  console.log("   🎉 ALL UNIFIED AUTH CHECKS PASSED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

runE2ETests()
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
