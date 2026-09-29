import { NextResponse } from "next/server";
import { getCmsSiteSettings } from "@/lib/services/cms-service";

export const dynamic = "force-dynamic";

/**
 * GET /api/cms/settings
 * Public endpoint to fetch active site brand identity & settings (no auth required)
 */
export async function GET() {
  try {
    const settings = await getCmsSiteSettings();
    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error("[PUBLIC_CMS_SETTINGS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to load site branding settings." },
      { status: 500 }
    );
  }
}
