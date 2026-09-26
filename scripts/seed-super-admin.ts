import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import { ROLES, USER_STATUS } from "../src/lib/constants/roles";
import { normalizeBdPhone } from "../src/lib/sms";

async function createSuperAdmin() {
  console.log("\n=======================================================");
  console.log("       Configuring Super Admin Account in Neon DB");
  console.log("=======================================================\n");

  const email = (process.env.ADMIN_EMAIL || "admin@felma.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "AdminPassword123";
  const phone = normalizeBdPhone(process.env.ADMIN_PHONE || "01700000000");
  const name = "Felma Super Admin";

  const passwordHash = await bcrypt.hash(password, 10);

  // Check if admin already exists by email or phone
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  let adminUser;

  if (existingUser) {
    adminUser = await db.user.update({
      where: { id: existingUser.id },
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
      },
    });
    console.log(`✅ Existing user successfully updated to Super Admin.`);
  } else {
    adminUser = await db.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: ROLES.ADMIN,
        status: USER_STATUS.ACTIVE,
        divisionId: "div_dhaka",
        districtId: "dist_dhaka",
        upazilaId: "upz_dhanmondi",
        address: "Felma HQ, Dhaka, Bangladesh",
      },
    });
    console.log(`✅ New Super Admin user created.`);
  }

  console.log("\n-------------------------------------------------------");
  console.log("🔑 SUPER ADMIN LOGIN CREDENTIALS:");
  console.log(`   Email:    ${adminUser.email}`);
  console.log(`   Phone:    ${adminUser.phone}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role:     ${adminUser.role}`);
  console.log(`   Status:   ${adminUser.status}`);
  console.log("-------------------------------------------------------\n");
}

createSuperAdmin()
  .catch((err) => {
    console.error("Failed to configure Super Admin:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
