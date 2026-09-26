import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { verifySessionToken, SESSION_COOKIE_NAME } from "../src/lib/auth-token";
import { ROLES, USER_STATUS } from "../src/lib/constants/roles";

function assert(condition: any, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runPasswordLoginTests() {
  console.log("\n=======================================================");
  console.log("   Running Super Admin & Password Login Verification");
  console.log("=======================================================\n");

  // 1. Verify Super Admin exists in Neon DB
  console.log("--- Test Suite 1: Database Super Admin Verification ---");
  const admin = await db.user.findFirst({
    where: { email: "admin@felma.com" },
  });

  assert(Boolean(admin), "Super Admin account exists in Neon PostgreSQL");
  assert(admin?.role === ROLES.ADMIN, "Super Admin has ADMIN role assigned");
  assert(admin?.status === USER_STATUS.ACTIVE, "Super Admin account status is ACTIVE");

  // 2. Verify Password Matching
  console.log("\n--- Test Suite 2: Password Verification ---");
  const isMatch = await bcrypt.compare("AdminPassword123", admin!.passwordHash);
  assert(isMatch === true, "AdminPassword123 correctly verifies against stored hash");

  const wrongMatch = await bcrypt.compare("WrongPassword", admin!.passwordHash);
  assert(wrongMatch === false, "Incorrect password fails verification");

  console.log("\n=======================================================");
  console.log("   🎉 SUPER ADMIN LOGIN VERIFICATION COMPLETED!");
  console.log("=======================================================\n");
}

runPasswordLoginTests()
  .catch((err) => {
    console.error("Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
