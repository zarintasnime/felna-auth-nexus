import { NextResponse } from "next/server";
import { getAllDivisions } from "@/lib/geo/bangladesh-address";

export async function GET() {
  try {
    const divisions = getAllDivisions();
    return NextResponse.json({
      success: true,
      data: divisions,
    });
  } catch (error) {
    console.error("[GEO_DIVISIONS_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve Bangladesh divisions.",
      },
      { status: 500 }
    );
  }
}
