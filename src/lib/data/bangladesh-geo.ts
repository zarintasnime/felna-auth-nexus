import {
  getAllDivisions,
  getDistrictsByDivision,
  getLocationsByDistrict,
  GeoDivision as BaseGeoDivision,
  GeoDistrict as BaseGeoDistrict,
  GeoLocationOption,
} from "../geo/bangladesh-address";

export type GeoDivision = BaseGeoDivision;
export type GeoDistrict = BaseGeoDistrict;

export interface GeoUpazila {
  id: string;
  name: string;
  districtId: string;
  bnName?: string;
  type?: "thana" | "upazila";
  categoryLabel?: string;
}

export const BANGLADESH_DIVISIONS: GeoDivision[] = getAllDivisions();

export const BANGLADESH_DISTRICTS: GeoDistrict[] = getDistrictsByDivision();

export const BANGLADESH_UPAZILAS: GeoUpazila[] = getGeoUpazilas();

export function getGeoDivisions(): GeoDivision[] {
  return getAllDivisions();
}

export function getGeoDistricts(divisionId?: string): GeoDistrict[] {
  return getDistrictsByDivision(divisionId);
}

export function getGeoUpazilas(districtId?: string): GeoUpazila[] {
  if (!districtId) {
    // Collect all locations across all districts
    const districts = getDistrictsByDivision();
    const allLocations: GeoUpazila[] = [];
    for (const d of districts) {
      allLocations.push(...getLocationsByDistrict(d.id));
    }
    return allLocations;
  }
  return getLocationsByDistrict(districtId);
}
