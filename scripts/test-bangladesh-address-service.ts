import {
  allDivisionEN,
  allDivisionBN,
  allDistrictEN,
  districtENOf,
  upazillasENOf,
  thanasENOf,
} from "all-bangladeshi-addresses";

import {
  getAllDivisions,
  getDistrictsByDivision,
  getLocationsByDistrict,
  isMetropolitanDistrict,
  resolveDistrictName,
  getLocationId,
  getDistrictId,
  isValidDivision,
  isValidDistrict,
  isThana,
  isUpazila,
  getDivisionOfDistrict,
  getDistrictOfUpazila,
} from "../src/lib/geo/bangladesh-address";

function assert(condition: boolean, testName: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${testName}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${testName}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("   Testing All-Bangladeshi-Addresses Service Suite");
  console.log("=======================================================\n");

  // --- Suite 1: all-bangladeshi-addresses Package Integration ---
  console.log("--- Suite 1: Package Coverage Verification ---");
  const divisions = allDivisionEN();
  assert(divisions.length === 8, "All 8 divisions exported in English");
  assert(divisions.includes("Dhaka"), "Dhaka division is included");
  assert(divisions.includes("Chattogram"), "Chattogram division is included");
  assert(divisions.includes("Barishal"), "Barishal division is correctly spelled with 'h'");

  const divisionsBN = allDivisionBN();
  assert(divisionsBN.length === 8, "All 8 divisions exported in Bengali");
  assert(divisionsBN.includes("ঢাকা"), "ঢাকা is included in Bengali divisions");
  assert(divisionsBN.includes("বরিশাল"), "বরিশাল is included in Bengali divisions");

  const districts = allDistrictEN();
  assert(districts.length === 64, "All 64 districts exported in English");
  assert(districts.includes("Tangail"), "Tangail district is included");
  assert(districts.includes("Dhaka"), "Dhaka district is included");

  const dhakaDistricts = districtENOf("Dhaka");
  assert(dhakaDistricts.length === 13, "Dhaka division has exactly 13 districts");
  assert(dhakaDistricts.includes("Tangail"), "Tangail is in Dhaka division districts");
  assert(dhakaDistricts.includes("Gazipur"), "Gazipur is in Dhaka division districts");

  const dhakaThanas = thanasENOf("Dhaka");
  assert(dhakaThanas.length > 20, "Dhaka has comprehensive police thanas (>20)");
  assert(dhakaThanas.includes("Gulshan"), "Gulshan is in Dhaka thanas");
  assert(dhakaThanas.includes("Dhanmondi"), "Dhanmondi is in Dhaka thanas");
  assert(dhakaThanas.includes("Banani"), "Banani is in Dhaka thanas");
  assert(dhakaThanas.includes("Motijheel"), "Motijheel is in Dhaka thanas");

  const dhakaUpazilas = upazillasENOf("Dhaka");
  assert(dhakaUpazilas.length === 5, "Dhaka has 5 administrative upazilas");
  assert(dhakaUpazilas.includes("Savar"), "Savar is in Dhaka upazilas");
  assert(dhakaUpazilas.includes("Dhamrai"), "Dhamrai is in Dhaka upazilas");
  assert(dhakaUpazilas.includes("Keraniganj"), "Keraniganj is in Dhaka upazilas");

  // --- Suite 2: Thana vs Upazila Classification & Validation ---
  console.log("\n--- Suite 2: Thana vs Upazila Classification & Lookups ---");
  assert(isThana("Gulshan", "Dhaka") === true, "Gulshan is verified as a Thana in Dhaka");
  assert(isUpazila("Savar", "Dhaka") === true, "Savar is verified as an Upazila in Dhaka");

  assert(isValidDistrict("Tangail") === true, "Tangail is a valid district");
  assert(isValidDistrict("Savar") === false, "Savar is not a district");
  assert(isValidDivision("Dhaka") === true, "Dhaka is a valid division");
  assert(isValidDivision("Barishal") === true, "Barishal is a valid division");

  assert(getDivisionOfDistrict("Tangail") === "Dhaka", "Tangail belongs to Dhaka division");
  assert(getDivisionOfDistrict("Cox's Bazar") === "Chattogram" || getDivisionOfDistrict("Coxsbazar") === "Chattogram", "Cox's Bazar belongs to Chattogram");
  assert(getDistrictOfUpazila("Savar") === "Dhaka", "Savar belongs to Dhaka district");
  assert(getDistrictOfUpazila("Mirzapur") === "Tangail", "Mirzapur belongs to Tangail district");

  // --- Suite 3: Service Layer (src/lib/geo/bangladesh-address.ts) ---
  console.log("\n--- Suite 3: Service Layer & ID Stability ---");
  const serviceDivs = getAllDivisions();
  assert(serviceDivs.length === 8, "Service layer returns 8 divisions");

  const serviceDhakaDistricts = getDistrictsByDivision("div_dhaka");
  assert(serviceDhakaDistricts.length === 13, "Dhaka division has 13 districts in service");
  assert(serviceDhakaDistricts.some((d) => d.name === "Tangail"), "Tangail is present in service Dhaka districts");

  // Metropolitan discrimination
  assert(isMetropolitanDistrict("dist_dhaka") === true, "Dhaka is recognized as metropolitan");
  assert(isMetropolitanDistrict("dist_chattogram") === true, "Chattogram is recognized as metropolitan");
  assert(isMetropolitanDistrict("dist_tangail") === false, "Tangail is NOT metropolitan");

  // Location retrieval with Thana + Upazila
  const dhakaLocations = getLocationsByDistrict("dist_dhaka");
  assert(dhakaLocations.some((l) => l.name === "Gulshan" && l.type === "thana"), "Gulshan is a Thana in Dhaka locations");
  assert(dhakaLocations.some((l) => l.name === "Savar"), "Savar is present in Dhaka locations");

  const tangailLocations = getLocationsByDistrict("dist_tangail");
  assert(tangailLocations.length >= 12, "Tangail has at least 12 upazilas/thanas");
  assert(tangailLocations.some((l) => l.name === "Mirzapur"), "Mirzapur is in Tangail locations");

  // Backward compatibility with legacy IDs
  const dhanmondiId = getLocationId("Dhanmondi", "Dhaka", "thana");
  assert(dhanmondiId === "upz_dhanmondi", "Legacy ID upz_dhanmondi preserved");

  const gulshanId = getLocationId("Gulshan", "Dhaka", "thana");
  assert(gulshanId === "upz_gulshan", "Legacy ID upz_gulshan preserved");

  const savarId = getLocationId("Savar", "Dhaka", "upazila");
  assert(savarId === "upz_savar", "Legacy ID upz_savar preserved");

  const kaliakairId = getLocationId("Kaliakair", "Gazipur", "upazila");
  assert(kaliakairId === "upz_kaliakair", "Legacy ID upz_kaliakair preserved");

  // Deterministic ID generation
  const mirzapurId = getLocationId("Mirzapur", "Tangail", "upazila");
  assert(mirzapurId === "upz_tangail_mirzapur", "Deterministic ID generated for new upazila");

  console.log("\n=======================================================");
  console.log("   ✅ ALL TESTS IN NEW ADDRESS SERVICE SUITE PASSED!");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
