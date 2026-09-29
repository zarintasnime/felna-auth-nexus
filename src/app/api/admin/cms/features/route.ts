import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { db } from "@/lib/db";
import { featureItemSchema, reorderItemsSchema } from "@/lib/validations/cms";
import { logCmsAction, revalidateCmsCache } from "@/lib/services/cms-service";
import { z } from "zod";

/**
 * GET /api/admin/cms/features
 * Retrieve all feature items or filter by ?section=BENEFIT|WHY_CHOOSE_US
 */
export async function GET(request: NextRequest) {
  try {
    await requirePermission(PERMISSIONS.CMS_READ);
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    const where: any = {};
    if (section === "BENEFIT" || section === "WHY_CHOOSE_US") {
      where.section = section;
    }

    const features = await db.cmsFeatureItem.findMany({
      where,
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: features,
    });
  } catch (error: any) {
    console.error("[CMS_FEATURES_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load feature items." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * POST /api/admin/cms/features
 * Create a new feature item
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const parsed = featureItemSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let displayOrder = parsed.data.displayOrder;
    if (displayOrder === 0) {
      const highest = await db.cmsFeatureItem.aggregate({
        where: { section: parsed.data.section },
        _max: { displayOrder: true },
      });
      displayOrder = (highest._max.displayOrder ?? 0) + 1;
    }

    const feature = await db.cmsFeatureItem.create({
      data: {
        ...parsed.data,
        displayOrder,
      },
    });

    await logCmsAction({
      userId: session.userId,
      action: "CREATE",
      entity: "FeatureItem",
      entityId: feature.id,
      changes: feature,
    });

    revalidateCmsCache("cms-features");

    return NextResponse.json(
      { success: true, message: "Feature item created successfully.", data: feature },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CMS_FEATURES_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create feature item." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/features
 * Update an existing feature item
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const updateSchema = featureItemSchema.extend({
      id: z.string().min(1, "Feature ID is required."),
    });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const existing = await db.cmsFeatureItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Feature item with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    const updated = await db.cmsFeatureItem.update({
      where: { id },
      data,
    });

    await logCmsAction({
      userId: session.userId,
      action: "UPDATE",
      entity: "FeatureItem",
      entityId: id,
      changes: data,
    });

    revalidateCmsCache("cms-features");

    return NextResponse.json({
      success: true,
      message: "Feature item updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_FEATURES_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update feature item." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * DELETE /api/admin/cms/features
 * Delete a feature item
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_DELETE);
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // Body was empty
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Feature ID is required for deletion." },
        { status: 400 }
      );
    }

    const existing = await db.cmsFeatureItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Feature item with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    await db.cmsFeatureItem.delete({ where: { id } });

    await logCmsAction({
      userId: session.userId,
      action: "DELETE",
      entity: "FeatureItem",
      entityId: id,
      changes: { deletedTitle: existing.title, section: existing.section },
    });

    revalidateCmsCache("cms-features");

    return NextResponse.json({
      success: true,
      message: "Feature item deleted successfully.",
      data: { id },
    });
  } catch (error: any) {
    console.error("[CMS_FEATURES_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete feature item." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PATCH /api/admin/cms/features
 * Quick actions: Toggle active state OR Batch reorder
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    // 1. Batch Reorder
    if (body.items && Array.isArray(body.items)) {
      const parsedReorder = reorderItemsSchema.safeParse(body);
      if (!parsedReorder.success) {
        return NextResponse.json(
          { success: false, error: "Invalid reorder payload", details: parsedReorder.error.format() },
          { status: 400 }
        );
      }

      await db.$transaction(
        parsedReorder.data.items.map((item) =>
          db.cmsFeatureItem.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          })
        )
      );

      await logCmsAction({
        userId: session.userId,
        action: "REORDER",
        entity: "FeatureItem",
        entityId: "batch",
        changes: parsedReorder.data.items,
      });

      revalidateCmsCache("cms-features");

      return NextResponse.json({
        success: true,
        message: "Feature items reordered successfully.",
      });
    }

    // 2. Toggle Active State
    const toggleSchema = z.object({
      id: z.string().min(1, "Feature ID is required."),
      isActive: z.boolean(),
    });

    const parsedToggle = toggleSchema.safeParse(body);
    if (!parsedToggle.success) {
      return NextResponse.json(
        { success: false, error: "Invalid toggle payload", details: parsedToggle.error.format() },
        { status: 400 }
      );
    }

    const updated = await db.cmsFeatureItem.update({
      where: { id: parsedToggle.data.id },
      data: { isActive: parsedToggle.data.isActive },
    });

    await logCmsAction({
      userId: session.userId,
      action: "TOGGLE_STATUS",
      entity: "FeatureItem",
      entityId: parsedToggle.data.id,
      changes: { isActive: parsedToggle.data.isActive },
    });

    revalidateCmsCache("cms-features");

    return NextResponse.json({
      success: true,
      message: `Feature item status changed to ${updated.isActive ? "Active" : "Inactive"}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_FEATURES_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update feature item." },
      { status: error.statusCode || 500 }
    );
  }
}
