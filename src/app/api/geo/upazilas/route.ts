import { NextRequest, NextResponse } from "next/server";
import {
  getLocationsByDistrict,
  isMetropolitanDistrict,
  resolveDistrictName,
} from "@/lib/geo/bangladesh-address";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get("districtId") || searchParams.get("district") || "";

    if (!districtId) {
      return NextResponse.json({
        success: true,
        data: [],
        isMetropolitan: false,
        districtName: null,
      });
    }

    const locations = getLocationsByDistrict(districtId);
    const distName = resolveDistrictName(districtId);
    const isMetro = distName ? isMetropolitanDistrict(distName) : false;

    // Segregate for convenience if consumers want them pre-grouped
    const thanas = locations.filter((loc) => loc.type === "thana");
    const upazilas = locations.filter((loc) => loc.type === "upazila");

    return NextResponse.json({
      success: true,
      data: locations,
      thanas,
      upazilas,
      isMetropolitan: isMetro,
      districtName: distName,
      totalCount: locations.length,
    });
  } catch (error) {
    console.error("[GEO_UPAZILAS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve Bangladesh thanas and upazilas.",
      },
      { status: 500 }
    );
  }
}
