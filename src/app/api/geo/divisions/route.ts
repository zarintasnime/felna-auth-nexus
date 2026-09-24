import { NextResponse } from "next/server";
import { getGeoDivisions } from "@/lib/data/bangladesh-geo";

export async function GET() {
  try {
    const divisions = getGeoDivisions();
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
