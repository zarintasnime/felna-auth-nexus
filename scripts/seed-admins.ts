import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { ROLES, USER_STATUS } from "../src/lib/constants/roles";

async function seedAdminUsers() {
  console.log("\n==================================================");
  console.log("🔐 SEEDING SUPER_ADMIN & ADMIN USER ACCOUNTS");
  console.log("==================================================\n");

  const plainPassword = "Admin@1234!";
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(plainPassword, saltRounds);

  // ---------------------------------------------------------------------------
  // User 1: Super Admin
  // ---------------------------------------------------------------------------
  const superAdminData = {
    name: "Super Admin",
    email: "superadmin@felna.com",
    phone: "+8801900000001",
    passwordHash,
    role: ROLES.SUPER_ADMIN,
    status: USER_STATUS.ACTIVE,
  };

  console.log(`Creating/Updating Super Admin (${superAdminData.email})...`);
  const superAdmin = await db.user.upsert({
    where: { email: superAdminData.email },
    update: {
      name: superAdminData.name,
      passwordHash: superAdminData.passwordHash,
      role: superAdminData.role,
      status: superAdminData.status,
    },
    create: superAdminData,
  });

  console.log(`  ✅ Super Admin User Ready:`);
  console.log(`     - ID    : ${superAdmin.id}`);
  console.log(`     - Name  : ${superAdmin.name}`);
  console.log(`     - Email : ${superAdmin.email}`);
  console.log(`     - Phone : ${superAdmin.phone}`);
  console.log(`     - Role  : ${superAdmin.role}`);
  console.log(`     - Status: ${superAdmin.status}`);

  // ---------------------------------------------------------------------------
  // User 2: System Admin
  // ---------------------------------------------------------------------------
  const adminData = {
    name: "System Admin",
    email: "admin@felna.com",
    phone: "+8801900000002",
    passwordHash,
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
  };

  console.log(`\nCreating/Updating System Admin (${adminData.email})...`);
  const admin = await db.user.upsert({
    where: { email: adminData.email },
    update: {
      name: adminData.name,
      passwordHash: adminData.passwordHash,
      role: adminData.role,
      status: adminData.status,
    },
    create: adminData,
  });

  console.log(`  ✅ System Admin User Ready:`);
  console.log(`     - ID    : ${admin.id}`);
  console.log(`     - Name  : ${admin.name}`);
  console.log(`     - Email : ${admin.email}`);
  console.log(`     - Phone : ${admin.phone}`);
  console.log(`     - Role  : ${admin.role}`);
  console.log(`     - Status: ${admin.status}`);

  // ---------------------------------------------------------------------------
  // Verification test of password hash matching
  // ---------------------------------------------------------------------------
  console.log("\nVerifying password hash check...");
  const isSuperAdminPasswordValid = await bcrypt.compare(plainPassword, superAdmin.passwordHash);
  const isAdminPasswordValid = await bcrypt.compare(plainPassword, admin.passwordHash);

  if (isSuperAdminPasswordValid && isAdminPasswordValid) {
    console.log("  ✅ Password hash check passed for both users!");
  } else {
    console.error("  ❌ Password verification failed!");
    process.exit(1);
  }

  console.log("\n==================================================");
  console.log("🎉 ADMIN USERS SEEDED SUCCESSFULLY!");
  console.log("==================================================\n");
}

seedAdminUsers()
  .catch((err) => {
    console.error("Error seeding admin users:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
