import { NextRequest, NextResponse } from "next/server";
import { getDistrictsByDivision } from "@/lib/geo/bangladesh-address";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const divisionId = searchParams.get("divisionId") || undefined;
    const districts = getDistrictsByDivision(divisionId);

    return NextResponse.json({
      success: true,
      data: districts,
    });
  } catch (error) {
    console.error("[GEO_DISTRICTS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve Bangladesh districts.",
      },
      { status: 500 }
    );
  }
}
