import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db";
import {
  BANGLADESH_DIVISIONS,
  BANGLADESH_DISTRICTS,
  BANGLADESH_UPAZILAS,
} from "../src/lib/data/bangladesh-geo";
import { ROLES, USER_STATUS } from "../src/lib/constants/roles";
import { normalizeBdPhone } from "../src/lib/sms";

async function main() {
  console.log("\n=======================================================");
  console.log("       Seeding Live Neon PostgreSQL Database");
  console.log("=======================================================\n");

  // 1. Seed Bangladesh Divisions
  console.log("Seeding Divisions...");
  for (const div of BANGLADESH_DIVISIONS) {
    await db.division.upsert({
      where: { id: div.id },
      update: { name: div.name, bnName: div.bnName },
      create: { id: div.id, name: div.name, bnName: div.bnName },
    });
  }
  console.log(`✅ Seeded ${BANGLADESH_DIVISIONS.length} Divisions.`);

  // 2. Seed Bangladesh Districts
  console.log("Seeding Districts...");
  for (const dist of BANGLADESH_DISTRICTS) {
    await db.district.upsert({
      where: { id: dist.id },
      update: { name: dist.name, divisionId: dist.divisionId },
      create: { id: dist.id, name: dist.name, divisionId: dist.divisionId },
    });
  }
  console.log(`✅ Seeded ${BANGLADESH_DISTRICTS.length} Districts.`);

  // 3. Seed Bangladesh Upazilas
  console.log("Seeding Upazilas...");
  for (const upz of BANGLADESH_UPAZILAS) {
    await db.upazila.upsert({
      where: { id: upz.id },
      update: { name: upz.name, districtId: upz.districtId },
      create: { id: upz.id, name: upz.name, districtId: upz.districtId },
    });
  }
  console.log(`✅ Seeded ${BANGLADESH_UPAZILAS.length} Upazilas/Thanas.`);

  // 4. Seed Initial Super Admin User
  console.log("Seeding Initial Admin User...");
  const adminPhone = normalizeBdPhone("01700000000");
  const adminPasswordHash = await bcrypt.hash("AdminPassword123", 10);

  const admin = await db.user.upsert({
    where: { phone: adminPhone },
    update: {
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
    },
    create: {
      name: "Felma Administrator",
      phone: adminPhone,
      email: "admin@felma.com",
      passwordHash: adminPasswordHash,
      role: ROLES.ADMIN,
      status: USER_STATUS.ACTIVE,
      divisionId: "div_dhaka",
      districtId: "dist_dhaka",
      upazilaId: "upz_dhanmondi",
      address: "Admin Headquarters, Dhanmondi, Dhaka",
    },
  });
  console.log(`✅ Admin user seeded: ${admin.name} (${admin.phone}) - Role: ${admin.role}`);

  // 5. Seed Demo Regular User
  console.log("Seeding Demo Regular User...");
  const userPhone = normalizeBdPhone("01712345678");
  const userPasswordHash = await bcrypt.hash("UserPassword123", 10);

  const demoUser = await db.user.upsert({
    where: { phone: userPhone },
    update: {
      status: USER_STATUS.ACTIVE,
    },
    create: {
      name: "Rahim Ahmed",
      phone: userPhone,
      email: "rahim@felma.com",
      passwordHash: userPasswordHash,
      role: ROLES.USER,
      status: USER_STATUS.ACTIVE,
      divisionId: "div_dhaka",
      districtId: "dist_dhaka",
      upazilaId: "upz_dhanmondi",
      address: "House 24, Road 7, Dhanmondi",
    },
  });
  console.log(`✅ Demo user seeded: ${demoUser.name} (${demoUser.phone}) - Role: ${demoUser.role}`);

  console.log("\n=======================================================");
  console.log("   🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("Seeding failed with error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
