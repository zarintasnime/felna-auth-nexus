import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { ROLES } from "@/lib/constants/roles";
import { db } from "@/lib/db";
import { siteSettingsSchema } from "@/lib/validations/cms";
import { getCmsSiteSettings, logCmsAction, revalidateCmsCache } from "@/lib/services/cms-service";

/**
 * GET /api/admin/settings
 * Retrieves all system and site settings
 */
export async function GET() {
  try {
    await requireRole(ROLES.ADMIN);
    const settings = await getCmsSiteSettings();

    const systemInfo = {
      nodeEnv: process.env.NODE_ENV || "development",
      databaseProvider: "Neon PostgreSQL Serverless (SSL Pooled)",
      jwtExpiry: "7 Days (Stateless Edge Cookie)",
      otpExpiry: "120 Seconds (Cryptographic SHA-256)",
      maxAttempts: 5,
      rateLimitWindow: "3 Requests / 5 Minutes",
    };

    return NextResponse.json({
      success: true,
      data: {
        settings,
        systemInfo,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_SETTINGS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load settings." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PUT /api/admin/settings
 * Updates system & site settings, invalidates cache, and records audit trail
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requireRole(ROLES.ADMIN);
    const body = await request.json();

    const parsed = siteSettingsSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
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
      message: "System and site settings updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[ADMIN_SETTINGS_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save settings." },
      { status: error.statusCode || 500 }
    );
  }
}
