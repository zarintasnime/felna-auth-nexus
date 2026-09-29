import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { db } from "@/lib/db";
import { promotionalSectionSchema } from "@/lib/validations/cms";
import { logCmsAction, revalidateCmsCache } from "@/lib/services/cms-service";

/**
 * GET /api/admin/cms/promotions
 * Retrieve all promotional sections or a single section by ?key=...
 */
export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.CMS_READ);
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const section = await db.cmsPromotionalSection.findUnique({
        where: { sectionKey: key },
      });
      if (!section) {
        return NextResponse.json(
          { success: false, error: `Section with key '${key}' not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: section });
    }

    const sections = await db.cmsPromotionalSection.findMany({
      orderBy: { sectionKey: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: sections,
    });
  } catch (error: any) {
    console.error("[CMS_PROMOTIONS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load promotional sections." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/promotions
 * Upsert / update a promotional section
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const parsed = promotionalSectionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { sectionKey, ...data } = parsed.data;

    const updated = await db.cmsPromotionalSection.upsert({
      where: { sectionKey },
      update: data,
      create: {
        sectionKey,
        ...data,
      },
    });

    await logCmsAction({
      userId: session.userId,
      action: "UPDATE",
      entity: "PromotionalSection",
      entityId: sectionKey,
      changes: parsed.data,
    });

    revalidateCmsCache("cms-promos");

    return NextResponse.json({
      success: true,
      message: `Promotional section '${sectionKey}' saved successfully.`,
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_PROMOTIONS_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save promotional section." },
      { status: error.statusCode || 500 }
    );
  }
}
