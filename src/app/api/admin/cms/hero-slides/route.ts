import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { db } from "@/lib/db";
import { heroSlideSchema, reorderItemsSchema } from "@/lib/validations/cms";
import { logCmsAction, revalidateCmsCache } from "@/lib/services/cms-service";
import { z } from "zod";

/**
 * GET /api/admin/cms/hero-slides
 * Retrieve all hero slides ordered by displayOrder
 */
export async function GET() {
  try {
    await requirePermission(PERMISSIONS.CMS_READ);
    const slides = await db.cmsHeroSlide.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: slides,
    });
  } catch (error: any) {
    console.error("[CMS_SLIDES_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load hero slides." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * POST /api/admin/cms/hero-slides
 * Create a new hero slide
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const parsed = heroSlideSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Auto-calculate displayOrder if not explicitly specified
    let displayOrder = parsed.data.displayOrder;
    if (displayOrder === 0) {
      const highestOrder = await db.cmsHeroSlide.aggregate({
        _max: { displayOrder: true },
      });
      displayOrder = (highestOrder._max.displayOrder ?? 0) + 1;
    }

    const newSlide = await db.cmsHeroSlide.create({
      data: {
        ...parsed.data,
        displayOrder,
      },
    });

    await logCmsAction({
      userId: session.userId,
      action: "CREATE",
      entity: "HeroSlide",
      entityId: newSlide.id,
      changes: newSlide,
    });

    revalidateCmsCache("cms-slides");

    return NextResponse.json(
      { success: true, message: "Hero slide created successfully.", data: newSlide },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[CMS_SLIDES_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create hero slide." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PUT /api/admin/cms/hero-slides
 * Update an existing hero slide
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);
    const body = await request.json();

    const updateSchema = heroSlideSchema.extend({
      id: z.string().min(1, "Slide ID is required."),
    });

    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;

    const existing = await db.cmsHeroSlide.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Hero slide with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    const updated = await db.cmsHeroSlide.update({
      where: { id },
      data,
    });

    await logCmsAction({
      userId: session.userId,
      action: "UPDATE",
      entity: "HeroSlide",
      entityId: id,
      changes: data,
    });

    revalidateCmsCache("cms-slides");

    return NextResponse.json({
      success: true,
      message: "Hero slide updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_SLIDES_PUT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update hero slide." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * DELETE /api/admin/cms/hero-slides
 * Delete a hero slide
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
        { success: false, error: "Slide ID is required for deletion." },
        { status: 400 }
      );
    }

    const existing = await db.cmsHeroSlide.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: `Hero slide with ID '${id}' not found.` },
        { status: 404 }
      );
    }

    await db.cmsHeroSlide.delete({ where: { id } });

    await logCmsAction({
      userId: session.userId,
      action: "DELETE",
      entity: "HeroSlide",
      entityId: id,
      changes: { deletedTitle: existing.title },
    });

    revalidateCmsCache("cms-slides");

    return NextResponse.json({
      success: true,
      message: "Hero slide deleted successfully.",
      data: { id },
    });
  } catch (error: any) {
    console.error("[CMS_SLIDES_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete hero slide." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * PATCH /api/admin/cms/hero-slides
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
          db.cmsHeroSlide.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          })
        )
      );

      await logCmsAction({
        userId: session.userId,
        action: "REORDER",
        entity: "HeroSlide",
        entityId: "batch",
        changes: parsedReorder.data.items,
      });

      revalidateCmsCache("cms-slides");

      return NextResponse.json({
        success: true,
        message: "Slides reordered successfully.",
      });
    }

    // 2. Toggle Active State
    const toggleSchema = z.object({
      id: z.string().min(1, "Slide ID is required."),
      isActive: z.boolean(),
    });

    const parsedToggle = toggleSchema.safeParse(body);
    if (!parsedToggle.success) {
      return NextResponse.json(
        { success: false, error: "Invalid toggle payload", details: parsedToggle.error.format() },
        { status: 400 }
      );
    }

    const updated = await db.cmsHeroSlide.update({
      where: { id: parsedToggle.data.id },
      data: { isActive: parsedToggle.data.isActive },
    });

    await logCmsAction({
      userId: session.userId,
      action: "TOGGLE_STATUS",
      entity: "HeroSlide",
      entityId: parsedToggle.data.id,
      changes: { isActive: parsedToggle.data.isActive },
    });

    revalidateCmsCache("cms-slides");

    return NextResponse.json({
      success: true,
      message: `Slide status changed to ${updated.isActive ? "Active" : "Inactive"}.`,
      data: updated,
    });
  } catch (error: any) {
    console.error("[CMS_SLIDES_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update hero slide." },
      { status: error.statusCode || 500 }
    );
  }
}
