import { NextRequest, NextResponse } from "next/server";
import { getGeoUpazilas } from "@/lib/data/bangladesh-geo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get("districtId") || undefined;
    const upazilas = getGeoUpazilas(districtId);

    return NextResponse.json({
      success: true,
      data: upazilas,
    });
  } catch (error) {
    console.error("[GEO_UPAZILAS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve Bangladesh upazilas.",
      },
      { status: 500 }
    );
  }
}
