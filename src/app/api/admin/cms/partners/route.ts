import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { db } from "@/lib/db";
import { partnerSchema, reorderItemsSchema } from "@/lib/validations/cms";
import { logCmsAction, revalidateCmsCache } from "@/lib/services/cms-service";
import { z } from "zod";

/**
 * GET /api/admin/cms/partners
 * Retrieve all partners ordered by displayOrder
 */
export async function GET() {
  try {
    await requirePermission(PERMISSIONS.CMS_READ);
    const partners = await db.cmsPartner.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: partners,
    });
  } catch (error: any) {
    console.error("[CMS_PARTNERS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load partners." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * POST /api/admin/cms/partners
 * Create a new partner
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const parsed = partnerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let displayOrder = parsed.data.displayOrder;
    if (displayOrder === 0) {
      const highest = await db.cmsPartner.aggregate({
        _max: { displayOrder: true },
      });
      displayOrder = (highest._max.displayOrder ?? 0) + 1;
    }

    const partner = await db.cmsPartner.create({
      data: {
        ...parsed.data,
        displayOrder,
      },
    });

    await logCmsAction({
      userId: session.userId,
      action: "CREATE",
      entity: "Partner",
      entityId: partner.id,
      changes: partner,
    });

    revalidateCmsCache("cms-partners");

    return NextResponse.json(
      { success: true, message: "Partner created successfully.", data: partner },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CMS_PARTNERS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create partner." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/partners
 * Update an existing partner
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const updateSchema = partnerSchema.extend({
      id: z.string().min(1, "Partner ID is required."),
    });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const existing = await db.cmsPartner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Partner with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    const updated = await db.cmsPartner.update({
      where: { id },
      data,
    });

    await logCmsAction({
      userId: session.userId,
      action: "UPDATE",
      entity: "Partner",
      entityId: id,
      changes: data,
    });

    revalidateCmsCache("cms-partners");

    return NextResponse.json({
      success: true,
      message: "Partner updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_PARTNERS_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update partner." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * DELETE /api/admin/cms/partners
 * Delete a partner
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
        { success: false, error: "Partner ID is required for deletion." },
        { status: 400 }
      );
    }

    const existing = await db.cmsPartner.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Partner with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    await db.cmsPartner.delete({ where: { id } });

    await logCmsAction({
      userId: session.userId,
      action: "DELETE",
      entity: "Partner",
      entityId: id,
      changes: { deletedName: existing.name },
    });

    revalidateCmsCache("cms-partners");

    return NextResponse.json({
      success: true,
      message: "Partner deleted successfully.",
      data: { id },
    });
  } catch (error: any) {
    console.error("[CMS_PARTNERS_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete partner." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PATCH /api/admin/cms/partners
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
          db.cmsPartner.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          })
        )
      );

      await logCmsAction({
        userId: session.userId,
        action: "REORDER",
        entity: "Partner",
        entityId: "batch",
        changes: parsedReorder.data.items,
      });

      revalidateCmsCache("cms-partners");

      return NextResponse.json({
        success: true,
        message: "Partners reordered successfully.",
      });
    }

    // 2. Toggle Active State
    const toggleSchema = z.object({
      id: z.string().min(1, "Partner ID is required."),
      isActive: z.boolean(),
    });

    const parsedToggle = toggleSchema.safeParse(body);
    if (!parsedToggle.success) {
      return NextResponse.json(
        { success: false, error: "Invalid toggle payload", details: parsedToggle.error.format() },
        { status: 400 }
      );
    }

    const updated = await db.cmsPartner.update({
      where: { id: parsedToggle.data.id },
      data: { isActive: parsedToggle.data.isActive },
    });

    await logCmsAction({
      userId: session.userId,
      action: "TOGGLE_STATUS",
      entity: "Partner",
      entityId: parsedToggle.data.id,
      changes: { isActive: parsedToggle.data.isActive },
    });

    revalidateCmsCache("cms-partners");

    return NextResponse.json({
      success: true,
      message: `Partner status changed to ${updated.isActive ? "Active" : "Inactive"}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_PARTNERS_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update partner." },
      { status: error.statusCode || 500 }
    );
  }
}
