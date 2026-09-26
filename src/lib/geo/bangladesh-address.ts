import {
  allDivisionEN,
  allDivisionBN,
  allDistrictEN,
  districtENOf,
  upazillasENOf,
  thanasENOf,
} from "all-bangladeshi-addresses";

export interface GeoDivision {
  id: string;
  name: string;
  bnName?: string;
}

export interface GeoDistrict {
  id: string;
  name: string;
  divisionId: string;
  divisionName: string;
  bnName?: string;
}

export interface GeoLocationOption {
  id: string;
  name: string;
  type: "thana" | "upazila";
  categoryLabel: string; // "Metropolitan Thana (Police Station)" | "Upazila (Sub-District)"
  districtId: string;
  districtName: string;
  divisionId: string;
  divisionName: string;
  bnName?: string;
}

// 8 Divisions Metadata with standardized IDs & Bengali translations
export const DIVISION_REGISTRY: Record<
  string,
  { id: string; name: string; bnName: string; searchKeys: string[] }
> = {
  dhaka: { id: "div_dhaka", name: "Dhaka", bnName: "ঢাকা", searchKeys: ["dhaka", "div_dhaka"] },
  chattogram: {
    id: "div_chattogram",
    name: "Chattogram",
    bnName: "চট্টগ্রাম",
    searchKeys: ["chattogram", "chittagong", "div_chattogram"],
  },
  rajshahi: {
    id: "div_rajshahi",
    name: "Rajshahi",
    bnName: "রাজশাহী",
    searchKeys: ["rajshahi", "div_rajshahi"],
  },
  khulna: { id: "div_khulna", name: "Khulna", bnName: "খুলনা", searchKeys: ["khulna", "div_khulna"] },
  barishal: {
    id: "div_barishal",
    name: "Barishal",
    bnName: "বরিশাল",
    searchKeys: ["barishal", "barisal", "div_barishal"],
  },
  sylhet: { id: "div_sylhet", name: "Sylhet", bnName: "সিলেট", searchKeys: ["sylhet", "div_sylhet"] },
  rangpur: { id: "div_rangpur", name: "Rangpur", bnName: "রংপুর", searchKeys: ["rangpur", "div_rangpur"] },
  mymensingh: {
    id: "div_mymensingh",
    name: "Mymensingh",
    bnName: "ময়মনসিংহ",
    searchKeys: ["mymensingh", "div_mymensingh"],
  },
};

// Legacy IDs for existing 51 DB entries to maintain 100% backward compatibility
const LEGACY_ID_MAP: Record<string, string> = {
  "dhaka:dhanmondi": "upz_dhanmondi",
  "dhaka:gulshan": "upz_gulshan",
  "dhaka:mirpur": "upz_mirpur",
  "dhaka:mirpur model": "upz_mirpur",
  "dhaka:uttara": "upz_uttara",
  "dhaka:uttara east": "upz_uttara",
  "dhaka:mohammadpur": "upz_mohammadpur",
  "dhaka:banani": "upz_banani",
  "dhaka:motijheel": "upz_motijheel",
  "dhaka:tejgaon": "upz_tejgaon",
  "dhaka:ramna": "upz_ramna",
  "dhaka:ramna model": "upz_ramna",
  "dhaka:badda": "upz_badda",
  "dhaka:savar": "upz_savar",
  "dhaka:dhamrai": "upz_dhamrai",
  "dhaka:keraniganj": "upz_keraniganj",
  "gazipur:gazipur sadar": "upz_gazipur_sadar",
  "gazipur:kaliakair": "upz_kaliakair",
  "gazipur:kapasia": "upz_kapasia",
  "gazipur:sreepur": "upz_sreepur",
  "gazipur:kaliganj": "upz_kaliganj",
  "narayanganj:narayanganj sadar": "upz_narayanganj_sadar",
  "narayanganj:bandar": "upz_bandar",
  "narayanganj:rupganj": "upz_rupganj",
  "narayanganj:sonargaon": "upz_sonargaon",
  "narayanganj:araihazar": "upz_araihazar",
  "chattogram:anwara": "upz_ctg_anwara",
  "chattogram:kotwali": "upz_ctg_kotwali",
  "chattogram:panchlaish": "upz_ctg_panchlaish",
  "chattogram:hathazari": "upz_ctg_hathazari",
  "chattogram:sitakunda": "upz_ctg_sitakunda",
  "chattogram:patia": "upz_ctg_patia",
  "chattogram:patiya": "upz_ctg_patia",
  "rajshahi:boalia": "upz_raj_boalia",
  "rajshahi:matihar": "upz_raj_matihar",
  "rajshahi:rajpara": "upz_raj_rajpara",
  "rajshahi:paba": "upz_raj_paba",
  "rajshahi:godagari": "upz_raj_godagari",
  "khulna:khulna sadar": "upz_khu_sadar",
  "khulna:sonadanga": "upz_khu_sonadanga",
  "khulna:khalishpur": "upz_khu_khalishpur",
  "khulna:dighalia": "upz_khu_dighalia",
  "sylhet:kotwali": "upz_syl_kotwali",
  "sylhet:sylhet sadar": "upz_syl_sadar",
  "sylhet:beanibazar": "upz_syl_beanibazar",
  "sylhet:golapganj": "upz_syl_golapganj",
  "barishal:barishal sadar": "upz_bar_sadar",
  "barishal:barisal sadar": "upz_bar_sadar",
  "barishal:bakerganj": "upz_bar_bakerganj",
  "barishal:babuganj": "upz_bar_babuganj",
  "rangpur:rangpur sadar": "upz_ran_sadar",
  "rangpur:pirgachha": "upz_ran_pirgachha",
  "rangpur:mithapukur": "upz_ran_mithapukur",
  "mymensingh:mymensingh sadar": "upz_mym_sadar",
  "mymensingh:muktagachha": "upz_mym_muktagachha",
  "mymensingh:trishal": "upz_mym_trishal",
};

/**
 * Normalizes any string into a clean lowercase slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Resolves division input (ID, name, or alias) to canonical registry item
 */
export function resolveDivision(divisionIdOrName?: string) {
  if (!divisionIdOrName) return null;
  const raw = divisionIdOrName.toLowerCase().trim();
  for (const entry of Object.values(DIVISION_REGISTRY)) {
    if (entry.searchKeys.includes(raw) || entry.id === raw || entry.name.toLowerCase() === raw) {
      return entry;
    }
  }
  return null;
}

/**
 * Deterministic District ID
 */
export function getDistrictId(districtName: string): string {
  return `dist_${slugify(districtName)}`;
}

/**
 * Formats deterministic Upazila/Thana ID with legacy preservation
 */
export function getLocationId(name: string, districtName: string, type: "thana" | "upazila"): string {
  const key = `${slugify(districtName)}:${name.toLowerCase().trim()}`;
  if (LEGACY_ID_MAP[key]) {
    return LEGACY_ID_MAP[key];
  }

  const prefix = type === "thana" ? "thn" : "upz";
  return `${prefix}_${slugify(districtName)}_${slugify(name)}`;
}

/**
 * Returns all 8 administrative divisions of Bangladesh
 */
export function getAllDivisions(): GeoDivision[] {
  return Object.values(DIVISION_REGISTRY).map((div) => ({
    id: div.id,
    name: div.name,
    bnName: div.bnName,
  }));
}

/**
 * Returns all 64 districts or filtered by division
 */
export function getDistrictsByDivision(divisionIdOrName?: string): GeoDistrict[] {
  if (!divisionIdOrName) {
    const allDistricts = allDistrictEN();
    return allDistricts.map((distName) => {
      const divName = getDivisionOfDistrict(distName) || "Dhaka";
      const divMeta = resolveDivision(divName) || DIVISION_REGISTRY.dhaka;
      return {
        id: getDistrictId(distName),
        name: distName,
        divisionId: divMeta.id,
        divisionName: divMeta.name,
      };
    });
  }

  const divMeta = resolveDivision(divisionIdOrName);
  if (!divMeta) return [];

  // Use all-bangladeshi-addresses districtENOf
  const rawDistricts = districtENOf(divMeta.name as any) || [];
  return rawDistricts.map((distName) => ({
    id: getDistrictId(distName),
    name: distName,
    divisionId: divMeta.id,
    divisionName: divMeta.name,
  }));
}

/**
 * Checks if a district is a major metropolitan hub with city police thanas
 */
export function isMetropolitanDistrict(districtIdOrName: string): boolean {
  const norm = districtIdOrName.toLowerCase().replace(/^dist_/, "").trim();
  return ["dhaka", "chattogram", "chittagong", "rajshahi", "khulna"].includes(norm);
}

/**
 * Resolves a district ID or name to its canonical English name
 */
export function resolveDistrictName(districtIdOrName: string): string | null {
  const clean = districtIdOrName.replace(/^dist_/, "").trim().toLowerCase();
  const allDistricts = allDistrictEN();
  const match = allDistricts.find(
    (d) => slugify(d) === slugify(clean) || d.toLowerCase() === clean
  );
  return match || null;
}

/**
 * Returns all Thanas and Upazilas for a district.
 * For Metropolitan districts (Dhaka, Chattogram, Rajshahi, Khulna),
 * it returns both Metropolitan Thanas and Upazilas with distinct classifications.
 */
export function getLocationsByDistrict(districtIdOrName: string): GeoLocationOption[] {
  const distName = resolveDistrictName(districtIdOrName);
  if (!distName) return [];

  const divName = getDivisionOfDistrict(distName);
  const divMeta = resolveDivision(divName) || DIVISION_REGISTRY.dhaka;
  const districtId = getDistrictId(distName);
  const isMetro = isMetropolitanDistrict(distName);

  const results: GeoLocationOption[] = [];
  const seenNames = new Set<string>();

  const rawUpazilas = upazillasENOf(distName as any) || [];
  const rawThanas = thanasENOf(distName as any) || [];

  if (isMetro) {
    // In metropolitan districts, classify city police stations as Thanas, and rural sub-districts as Upazilas
    for (const t of rawThanas) {
      const isPureUpazila = rawUpazilas.some(
        (u) => u.toLowerCase() === t.toLowerCase() && !["savar", "dhamrai", "keraniganj"].includes(u.toLowerCase())
      );

      // Thanas inside the city
      const nameKey = t.toLowerCase().trim();
      if (!seenNames.has(nameKey)) {
        seenNames.add(nameKey);
        results.push({
          id: getLocationId(t, distName, "thana"),
          name: t,
          type: "thana",
          categoryLabel: "Metropolitan Thana (Police Station)",
          districtId,
          districtName: distName,
          divisionId: divMeta.id,
          divisionName: divMeta.name,
        });
      }
    }

    // Add upazilas
    for (const u of rawUpazilas) {
      const nameKey = u.toLowerCase().trim();
      // Even if already in thanas, ensure it's selectable as upazila if wanted or prioritize
      if (!seenNames.has(nameKey)) {
        seenNames.add(nameKey);
        results.push({
          id: getLocationId(u, distName, "upazila"),
          name: u,
          type: "upazila",
          categoryLabel: "Upazila (Sub-District)",
          districtId,
          districtName: distName,
          divisionId: divMeta.id,
          divisionName: divMeta.name,
        });
      }
    }
  } else {
    // Non-metropolitan districts: list upazilas and any unique thanas
    for (const u of rawUpazilas) {
      const nameKey = u.toLowerCase().trim();
      seenNames.add(nameKey);
      results.push({
        id: getLocationId(u, distName, "upazila"),
        name: u,
        type: "upazila",
        categoryLabel: "Upazila (Sub-District)",
        districtId,
        districtName: distName,
        divisionId: divMeta.id,
        divisionName: divMeta.name,
      });
    }

    for (const t of rawThanas) {
      const nameKey = t.toLowerCase().trim();
      if (!seenNames.has(nameKey)) {
        seenNames.add(nameKey);
        results.push({
          id: getLocationId(t, distName, "thana"),
          name: t,
          type: "thana",
          categoryLabel: "Thana (Police Station)",
          districtId,
          districtName: distName,
          divisionId: divMeta.id,
          divisionName: divMeta.name,
        });
      }
    }
  }

  return results;
}

/**
 * Reverse lookups and validation
 */
export function getDivisionOfDistrict(district: string): string {
  const allDivs = allDivisionEN();
  const clean = district.trim().toLowerCase();

  for (const div of allDivs) {
    const districts = districtENOf(div as any) || [];
    if (districts.some((d) => d.toLowerCase() === clean || slugify(d) === slugify(clean))) {
      return div;
    }
  }
  return "Dhaka";
}

export function getDistrictOfUpazila(upazila: string, divisionName?: string): string {
  const allDistricts = divisionName
    ? districtENOf(divisionName as any) || allDistrictEN()
    : allDistrictEN();

  const clean = upazila.trim().toLowerCase();

  for (const dist of allDistricts) {
    const upazilas = upazillasENOf(dist as any) || [];
    if (upazilas.some((u) => u.toLowerCase() === clean)) {
      return dist;
    }
    const thanas = thanasENOf(dist as any) || [];
    if (thanas.some((t) => t.toLowerCase() === clean)) {
      return dist;
    }
  }
  return "Dhaka";
}

export function isValidDivision(name: string): boolean {
  return !!resolveDivision(name);
}

export function isValidDistrict(name: string): boolean {
  return !!resolveDistrictName(name);
}

export function isThana(name: string, district?: string): boolean {
  if (district) {
    const thanas = thanasENOf(district as any) || [];
    return thanas.some((t) => t.toLowerCase() === name.toLowerCase().trim());
  }
  const allDistricts = allDistrictEN();
  for (const d of allDistricts) {
    const thanas = thanasENOf(d as any) || [];
    if (thanas.some((t) => t.toLowerCase() === name.toLowerCase().trim())) {
      return true;
    }
  }
  return false;
}

export function isUpazila(name: string, district?: string): boolean {
  if (district) {
    const upazilas = upazillasENOf(district as any) || [];
    return upazilas.some((u) => u.toLowerCase() === name.toLowerCase().trim());
  }
  const allDistricts = allDistrictEN();
  for (const d of allDistricts) {
    const upazilas = upazillasENOf(d as any) || [];
    if (upazilas.some((u) => u.toLowerCase() === name.toLowerCase().trim())) {
      return true;
    }
  }
  return false;
}
