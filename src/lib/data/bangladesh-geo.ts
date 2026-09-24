export interface GeoDivision {
  id: string;
  name: string;
  bnName?: string;
}

export interface GeoDistrict {
  id: string;
  name: string;
  divisionId: string;
  bnName?: string;
}

export interface GeoUpazila {
  id: string;
  name: string;
  districtId: string;
  bnName?: string;
}

export const BANGLADESH_DIVISIONS: GeoDivision[] = [
  { id: "div_dhaka", name: "Dhaka", bnName: "ঢাকা" },
  { id: "div_chattogram", name: "Chattogram", bnName: "চট্টগ্রাম" },
  { id: "div_rajshahi", name: "Rajshahi", bnName: "রাজশাহী" },
  { id: "div_khulna", name: "Khulna", bnName: "খুলনা" },
  { id: "div_barishal", name: "Barishal", bnName: "বরিশাল" },
  { id: "div_sylhet", name: "Sylhet", bnName: "সিলেট" },
  { id: "div_rangpur", name: "Rangpur", bnName: "রংপুর" },
  { id: "div_mymensingh", name: "Mymensingh", bnName: "ময়মনসিংহ" },
];

export const BANGLADESH_DISTRICTS: GeoDistrict[] = [
  // Dhaka Division
  { id: "dist_dhaka", name: "Dhaka", divisionId: "div_dhaka" },
  { id: "dist_gazipur", name: "Gazipur", divisionId: "div_dhaka" },
  { id: "dist_narayanganj", name: "Narayanganj", divisionId: "div_dhaka" },
  { id: "dist_tangail", name: "Tangail", divisionId: "div_dhaka" },
  { id: "dist_narsingdi", name: "Narsingdi", divisionId: "div_dhaka" },
  { id: "dist_faridpur", name: "Faridpur", divisionId: "div_dhaka" },
  { id: "dist_manikganj", name: "Manikganj", divisionId: "div_dhaka" },
  { id: "dist_munshiganj", name: "Munshiganj", divisionId: "div_dhaka" },
  { id: "dist_gopalganj", name: "Gopalganj", divisionId: "div_dhaka" },
  { id: "dist_madaripur", name: "Madaripur", divisionId: "div_dhaka" },
  { id: "dist_rajbari", name: "Rajbari", divisionId: "div_dhaka" },
  { id: "dist_shariatpur", name: "Shariatpur", divisionId: "div_dhaka" },
  { id: "dist_kishoreganj", name: "Kishoreganj", divisionId: "div_dhaka" },

  // Chattogram Division
  { id: "dist_chattogram", name: "Chattogram", divisionId: "div_chattogram" },
  { id: "dist_coxsbazar", name: "Cox's Bazar", divisionId: "div_chattogram" },
  { id: "dist_cumilla", name: "Cumilla", divisionId: "div_chattogram" },
  { id: "dist_feni", name: "Feni", divisionId: "div_chattogram" },
  { id: "dist_brahmanbaria", name: "Brahmanbaria", divisionId: "div_chattogram" },
  { id: "dist_noakhali", name: "Noakhali", divisionId: "div_chattogram" },
  { id: "dist_chandpur", name: "Chandpur", divisionId: "div_chattogram" },
  { id: "dist_lakshmipur", name: "Lakshmipur", divisionId: "div_chattogram" },

  // Rajshahi Division
  { id: "dist_rajshahi", name: "Rajshahi", divisionId: "div_rajshahi" },
  { id: "dist_bogura", name: "Bogura", divisionId: "div_rajshahi" },
  { id: "dist_pabna", name: "Pabna", divisionId: "div_rajshahi" },
  { id: "dist_sirajganj", name: "Sirajganj", divisionId: "div_rajshahi" },
  { id: "dist_naogaon", name: "Naogaon", divisionId: "div_rajshahi" },
  { id: "dist_natore", name: "Natore", divisionId: "div_rajshahi" },
  { id: "dist_chapainawabganj", name: "Chapainawabganj", divisionId: "div_rajshahi" },
  { id: "dist_joypurhat", name: "Joypurhat", divisionId: "div_rajshahi" },

  // Khulna Division
  { id: "dist_khulna", name: "Khulna", divisionId: "div_khulna" },
  { id: "dist_jashore", name: "Jashore", divisionId: "div_khulna" },
  { id: "dist_kushtia", name: "Kushtia", divisionId: "div_khulna" },
  { id: "dist_satkhira", name: "Satkhira", divisionId: "div_khulna" },
  { id: "dist_bagerhat", name: "Bagerhat", divisionId: "div_khulna" },
  { id: "dist_jhenaidah", name: "Jhenaidah", divisionId: "div_khulna" },
  { id: "dist_chuadanga", name: "Chuadanga", divisionId: "div_khulna" },
  { id: "dist_meherpur", name: "Meherpur", divisionId: "div_khulna" },

  // Barishal Division
  { id: "dist_barishal", name: "Barishal", divisionId: "div_barishal" },
  { id: "dist_patuakhali", name: "Patuakhali", divisionId: "div_barishal" },
  { id: "dist_bhola", name: "Bhola", divisionId: "div_barishal" },
  { id: "dist_pirojpur", name: "Pirojpur", divisionId: "div_barishal" },
  { id: "dist_barguna", name: "Barguna", divisionId: "div_barishal" },
  { id: "dist_jhalokati", name: "Jhalokati", divisionId: "div_barishal" },

  // Sylhet Division
  { id: "dist_sylhet", name: "Sylhet", divisionId: "div_sylhet" },
  { id: "dist_moulvibazar", name: "Moulvibazar", divisionId: "div_sylhet" },
  { id: "dist_habiganj", name: "Habiganj", divisionId: "div_sylhet" },
  { id: "dist_sunamganj", name: "Sunamganj", divisionId: "div_sylhet" },

  // Rangpur Division
  { id: "dist_rangpur", name: "Rangpur", divisionId: "div_rangpur" },
  { id: "dist_dinajpur", name: "Dinajpur", divisionId: "div_rangpur" },
  { id: "dist_kurigram", name: "Kurigram", divisionId: "div_rangpur" },
  { id: "dist_gaibandha", name: "Gaibandha", divisionId: "div_rangpur" },
  { id: "dist_nilphamari", name: "Nilphamari", divisionId: "div_rangpur" },

  // Mymensingh Division
  { id: "dist_mymensingh", name: "Mymensingh", divisionId: "div_mymensingh" },
  { id: "dist_jamalpur", name: "Jamalpur", divisionId: "div_mymensingh" },
  { id: "dist_netrokona", name: "Netrokona", divisionId: "div_mymensingh" },
  { id: "dist_sherpur", name: "Sherpur", divisionId: "div_mymensingh" },
];

export const BANGLADESH_UPAZILAS: GeoUpazila[] = [
  // Dhaka District Upazilas / Thanas
  { id: "upz_dhanmondi", name: "Dhanmondi", districtId: "dist_dhaka" },
  { id: "upz_gulshan", name: "Gulshan", districtId: "dist_dhaka" },
  { id: "upz_mirpur", name: "Mirpur", districtId: "dist_dhaka" },
  { id: "upz_uttara", name: "Uttara", districtId: "dist_dhaka" },
  { id: "upz_mohammadpur", name: "Mohammadpur", districtId: "dist_dhaka" },
  { id: "upz_banani", name: "Banani", districtId: "dist_dhaka" },
  { id: "upz_motijheel", name: "Motijheel", districtId: "dist_dhaka" },
  { id: "upz_tejgaon", name: "Tejgaon", districtId: "dist_dhaka" },
  { id: "upz_ramna", name: "Ramna", districtId: "dist_dhaka" },
  { id: "upz_badda", name: "Badda", districtId: "dist_dhaka" },
  { id: "upz_savar", name: "Savar", districtId: "dist_dhaka" },
  { id: "upz_dhamrai", name: "Dhamrai", districtId: "dist_dhaka" },
  { id: "upz_keraniganj", name: "Keraniganj", districtId: "dist_dhaka" },

  // Gazipur
  { id: "upz_gazipur_sadar", name: "Gazipur Sadar", districtId: "dist_gazipur" },
  { id: "upz_kaliakair", name: "Kaliakair", districtId: "dist_gazipur" },
  { id: "upz_kapasia", name: "Kapasia", districtId: "dist_gazipur" },
  { id: "upz_sreepur", name: "Sreepur", districtId: "dist_gazipur" },
  { id: "upz_kaliganj", name: "Kaliganj", districtId: "dist_gazipur" },

  // Narayanganj
  { id: "upz_narayanganj_sadar", name: "Narayanganj Sadar", districtId: "dist_narayanganj" },
  { id: "upz_bandar", name: "Bandar", districtId: "dist_narayanganj" },
  { id: "upz_rupganj", name: "Rupganj", districtId: "dist_narayanganj" },
  { id: "upz_sonargaon", name: "Sonargaon", districtId: "dist_narayanganj" },
  { id: "upz_araihazar", name: "Araihazar", districtId: "dist_narayanganj" },

  // Chattogram
  { id: "upz_ctg_kotwali", name: "Kotwali", districtId: "dist_chattogram" },
  { id: "upz_ctg_panchlaish", name: "Panchlaish", districtId: "dist_chattogram" },
  { id: "upz_ctg_hathazari", name: "Hathazari", districtId: "dist_chattogram" },
  { id: "upz_ctg_sitakunda", name: "Sitakunda", districtId: "dist_chattogram" },
  { id: "upz_ctg_patia", name: "Patia", districtId: "dist_chattogram" },
  { id: "upz_ctg_anwara", name: "Anwara", districtId: "dist_chattogram" },

  // Rajshahi
  { id: "upz_raj_boalia", name: "Boalia", districtId: "dist_rajshahi" },
  { id: "upz_raj_matihar", name: "Matihar", districtId: "dist_rajshahi" },
  { id: "upz_raj_rajpara", name: "Rajpara", districtId: "dist_rajshahi" },
  { id: "upz_raj_paba", name: "Paba", districtId: "dist_rajshahi" },
  { id: "upz_raj_godagari", name: "Godagari", districtId: "dist_rajshahi" },

  // Khulna
  { id: "upz_khu_sadar", name: "Khulna Sadar", districtId: "dist_khulna" },
  { id: "upz_khu_sonadanga", name: "Sonadanga", districtId: "dist_khulna" },
  { id: "upz_khu_khalishpur", name: "Khalishpur", districtId: "dist_khulna" },
  { id: "upz_khu_dighalia", name: "Dighalia", districtId: "dist_khulna" },

  // Sylhet
  { id: "upz_syl_kotwali", name: "Kotwali", districtId: "dist_sylhet" },
  { id: "upz_syl_sadar", name: "Sylhet Sadar", districtId: "dist_sylhet" },
  { id: "upz_syl_beanibazar", name: "Beanibazar", districtId: "dist_sylhet" },
  { id: "upz_syl_golapganj", name: "Golapganj", districtId: "dist_sylhet" },

  // Barishal
  { id: "upz_bar_sadar", name: "Barishal Sadar", districtId: "dist_barishal" },
  { id: "upz_bar_bakerganj", name: "Bakerganj", districtId: "dist_barishal" },
  { id: "upz_bar_babuganj", name: "Babuganj", districtId: "dist_barishal" },

  // Rangpur
  { id: "upz_ran_sadar", name: "Rangpur Sadar", districtId: "dist_rangpur" },
  { id: "upz_ran_pirgachha", name: "Pirgachha", districtId: "dist_rangpur" },
  { id: "upz_ran_mithapukur", name: "Mithapukur", districtId: "dist_rangpur" },

  // Mymensingh
  { id: "upz_mym_sadar", name: "Mymensingh Sadar", districtId: "dist_mymensingh" },
  { id: "upz_mym_muktagachha", name: "Muktagachha", districtId: "dist_mymensingh" },
  { id: "upz_mym_trishal", name: "Trishal", districtId: "dist_mymensingh" },
];

export function getGeoDivisions(): GeoDivision[] {
  return BANGLADESH_DIVISIONS;
}

export function getGeoDistricts(divisionId?: string): GeoDistrict[] {
  if (!divisionId) return BANGLADESH_DISTRICTS;
  return BANGLADESH_DISTRICTS.filter((d) => d.divisionId === divisionId);
}

export function getGeoUpazilas(districtId?: string): GeoUpazila[] {
  if (!districtId) return BANGLADESH_UPAZILAS;
  return BANGLADESH_UPAZILAS.filter((u) => u.districtId === districtId);
}
