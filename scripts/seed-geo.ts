import "dotenv/config";
import { seedBangladeshGeo } from "../src/lib/geo/seed-bangladesh-geo";

async function main() {
  try {
    await seedBangladeshGeo();
    process.exit(0);
  } catch (error) {
    console.error("❌ Geo seeding failed:", error);
    process.exit(1);
  }
}

main();
