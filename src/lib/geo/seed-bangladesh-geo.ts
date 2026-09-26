import { db } from "../db";
import {
  getAllDivisions,
  getDistrictsByDivision,
  getLocationsByDistrict,
} from "./bangladesh-address";

/**
 * Seeds and synchronizes all Bangladesh administrative divisions, districts,
 * upazilas, and metropolitan thanas into the PostgreSQL database.
 * This guarantees zero foreign-key constraint violations on user registration.
 */
export async function seedBangladeshGeo() {
  console.log("\n=======================================================");
  console.log("   Synchronizing Bangladesh Geography Database");
  console.log("=======================================================\n");

  // 1. Seed 8 Divisions
  const divisions = getAllDivisions();
  console.log(`[Geo Sync] Upserting ${divisions.length} Divisions...`);
  for (const div of divisions) {
    await db.division.upsert({
      where: { id: div.id },
      update: {
        name: div.name,
        bnName: div.bnName || null,
      },
      create: {
        id: div.id,
        name: div.name,
        bnName: div.bnName || null,
      },
    });
  }
  console.log(`[Geo Sync] ✅ ${divisions.length} Divisions synchronized.`);

  // 2. Seed 64 Districts
  const districts = getDistrictsByDivision();
  console.log(`[Geo Sync] Upserting ${districts.length} Districts...`);
  for (const dist of districts) {
    await db.district.upsert({
      where: { id: dist.id },
      update: {
        name: dist.name,
        divisionId: dist.divisionId,
      },
      create: {
        id: dist.id,
        name: dist.name,
        divisionId: dist.divisionId,
      },
    });
  }
  console.log(`[Geo Sync] ✅ ${districts.length} Districts synchronized.`);

  // 3. Seed Upazilas and Metropolitan Thanas
  let totalLocations = 0;
  console.log(`[Geo Sync] Upserting Upazilas & Metropolitan Thanas across all districts...`);
  for (const dist of districts) {
    const locations = getLocationsByDistrict(dist.id);
    for (const loc of locations) {
      await db.upazila.upsert({
        where: { id: loc.id },
        update: {
          name: loc.name,
          districtId: loc.districtId,
        },
        create: {
          id: loc.id,
          name: loc.name,
          districtId: loc.districtId,
        },
      });
      totalLocations++;
    }
  }
  console.log(`[Geo Sync] ✅ ${totalLocations} Upazilas & Thanas synchronized.`);

  // Verification counts
  const finalDivCount = await db.division.count();
  const finalDistCount = await db.district.count();
  const finalUpzCount = await db.upazila.count();

  console.log("\n--- Final Database Status ---");
  console.log(`Divisions : ${finalDivCount}`);
  console.log(`Districts : ${finalDistCount}`);
  console.log(`Upazilas & Thanas: ${finalUpzCount}`);
  console.log("=======================================================\n");

  return {
    divisions: finalDivCount,
    districts: finalDistCount,
    upazilasAndThanas: finalUpzCount,
  };
}
