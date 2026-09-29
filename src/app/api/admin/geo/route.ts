import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { ROLES } from "@/lib/constants/roles";
import { db } from "@/lib/db";

/**
 * GET /api/admin/geo
 * Returns Bangladesh Geographic Hierarchy with registration distribution metrics
 */
export async function GET() {
  try {
    await requireRole(ROLES.ADMIN);

    const [divisions, totalDistricts, totalUpazilas] = await Promise.all([
      db.division.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              districts: true,
              users: true,
            },
          },
          districts: {
            orderBy: { name: "asc" },
            include: {
              _count: {
                select: {
                  upazilas: true,
                  users: true,
                },
              },
            },
          },
        },
      }),
      db.district.count(),
      db.upazila.count(),
    ]);

    const stats = {
      totalDivisions: divisions.length,
      totalDistricts,
      totalUpazilas,
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        divisions,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_GEO_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load geographic data." },
      { status: error.statusCode || 500 }
    );
  }
}
