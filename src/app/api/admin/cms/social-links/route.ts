import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { db } from "@/lib/db";
import { socialLinkSchema, reorderItemsSchema } from "@/lib/validations/cms";
import { logCmsAction, revalidateCmsCache } from "@/lib/services/cms-service";
import { z } from "zod";

/**
 * GET /api/admin/cms/social-links
 * Retrieve all social links ordered by displayOrder
 */
export async function GET() {
  try {
    await requirePermission(PERMISSIONS.CMS_READ);
    const links = await db.cmsSocialLink.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: links,
    });
  } catch (error: any) {
    console.error("[CMS_SOCIAL_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load social links." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * POST /api/admin/cms/social-links
 * Create a new social link
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const parsed = socialLinkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    let displayOrder = parsed.data.displayOrder;
    if (displayOrder === 0) {
      const highest = await db.cmsSocialLink.aggregate({
        _max: { displayOrder: true },
      });
      displayOrder = (highest._max.displayOrder ?? 0) + 1;
    }

    const link = await db.cmsSocialLink.create({
      data: {
        ...parsed.data,
        displayOrder,
      },
    });

    await logCmsAction({
      userId: session.userId,
      action: "CREATE",
      entity: "SocialLink",
      entityId: link.id,
      changes: link,
    });

    revalidateCmsCache("cms-social");

    return NextResponse.json(
      { success: true, message: "Social link created successfully.", data: link },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CMS_SOCIAL_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create social link." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/social-links
 * Update an existing social link
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const updateSchema = socialLinkSchema.extend({
      id: z.string().min(1, "Link ID is required."),
    });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const existing = await db.cmsSocialLink.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Social link with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    const updated = await db.cmsSocialLink.update({
      where: { id },
      data,
    });

    await logCmsAction({
      userId: session.userId,
      action: "UPDATE",
      entity: "SocialLink",
      entityId: id,
      changes: data,
    });

    revalidateCmsCache("cms-social");

    return NextResponse.json({
      success: true,
      message: "Social link updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_SOCIAL_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update social link." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * DELETE /api/admin/cms/social-links
 * Delete a social link
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
        { success: false, error: "Link ID is required for deletion." },
        { status: 400 }
      );
    }

    const existing = await db.cmsSocialLink.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Social link with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    await db.cmsSocialLink.delete({ where: { id } });

    await logCmsAction({
      userId: session.userId,
      action: "DELETE",
      entity: "SocialLink",
      entityId: id,
      changes: { deletedPlatform: existing.platform, url: existing.url },
    });

    revalidateCmsCache("cms-social");

    return NextResponse.json({
      success: true,
      message: "Social link deleted successfully.",
      data: { id },
    });
  } catch (error: any) {
    console.error("[CMS_SOCIAL_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete social link." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PATCH /api/admin/cms/social-links
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
          db.cmsSocialLink.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          })
        )
      );

      await logCmsAction({
        userId: session.userId,
        action: "REORDER",
        entity: "SocialLink",
        entityId: "batch",
        changes: parsedReorder.data.items,
      });

      revalidateCmsCache("cms-social");

      return NextResponse.json({
        success: true,
        message: "Social links reordered successfully.",
      });
    }

    // 2. Toggle Active State
    const toggleSchema = z.object({
      id: z.string().min(1, "Link ID is required."),
      isActive: z.boolean(),
    });

    const parsedToggle = toggleSchema.safeParse(body);
    if (!parsedToggle.success) {
      return NextResponse.json(
        { success: false, error: "Invalid toggle payload", details: parsedToggle.error.format() },
        { status: 400 }
      );
    }

    const updated = await db.cmsSocialLink.update({
      where: { id: parsedToggle.data.id },
      data: { isActive: parsedToggle.data.isActive },
    });

    await logCmsAction({
      userId: session.userId,
      action: "TOGGLE_STATUS",
      entity: "SocialLink",
      entityId: parsedToggle.data.id,
      changes: { isActive: parsedToggle.data.isActive },
    });

    revalidateCmsCache("cms-social");

    return NextResponse.json({
      success: true,
      message: `Social link status changed to ${updated.isActive ? "Active" : "Inactive"}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_SOCIAL_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update social link." },
      { status: error.statusCode || 500 }
    );
  }
}
