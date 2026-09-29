import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { db } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validations/cms";
import { getCmsSiteSettings, logCmsAction, revalidateCmsCache } from "@/lib/services/cms-service";

/**
 * GET /api/admin/cms/settings
 * Retrieve current singleton site settings
 */
export async function GET() {
  try {
    await requirePermission(PERMISSIONS.CMS_READ);
    const settings = await getCmsSiteSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error: any) {
    console.error("[CMS_SETTINGS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load site settings." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/settings
 * Update singleton site settings
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const updated = await db.cmsSiteSettings.upsert({
      where: { id: "default" },
      update: parsed.data,
      create: {
        id: "default",
        ...parsed.data,
      },
    });

    // Audit Log & Cache Invalidation
    await logCmsAction({
      userId: session.userId,
      action: "UPDATE",
      entity: "SiteSettings",
      entityId: "default",
      changes: parsed.data,
    });

    revalidateCmsCache("cms-settings");

    return NextResponse.json({
      success: true,
      message: "Site settings updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_SETTINGS_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update site settings." },
      { status: error.statusCode || 500 }
    );
  }
}
