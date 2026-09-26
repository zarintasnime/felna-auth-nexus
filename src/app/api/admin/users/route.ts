import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { db } from "@/lib/db";
import { ROLES, USER_STATUS, Role, UserStatus } from "@/lib/constants/roles";
import { z } from "zod";

const updateUserSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  role: z.enum([ROLES.ADMIN, ROLES.USER]).optional(),
  status: z
    .enum([
      USER_STATUS.ACTIVE,
      USER_STATUS.PENDING_VERIFICATION,
      USER_STATUS.SUSPENDED,
    ])
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireRole(ROLES.ADMIN);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const roleFilter = searchParams.get("role") || "ALL";
    const statusFilter = searchParams.get("status") || "ALL";

    // Build filter conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (roleFilter !== "ALL" && (roleFilter === ROLES.ADMIN || roleFilter === ROLES.USER)) {
      where.role = roleFilter;
    }

    if (
      statusFilter !== "ALL" &&
      (statusFilter === USER_STATUS.ACTIVE ||
        statusFilter === USER_STATUS.PENDING_VERIFICATION ||
        statusFilter === USER_STATUS.SUSPENDED)
    ) {
      where.status = statusFilter;
    }

    // Run queries in parallel
    const [users, total, active, pending, suspended] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          address: true,
          division: { select: { name: true } },
          district: { select: { name: true } },
          upazila: { select: { name: true } },
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      db.user.count(),
      db.user.count({ where: { status: USER_STATUS.ACTIVE } }),
      db.user.count({ where: { status: USER_STATUS.PENDING_VERIFICATION } }),
      db.user.count({ where: { status: USER_STATUS.SUSPENDED } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users,
        metrics: {
          total,
          active,
          pending,
          suspended,
        },
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_USERS_GET_ERROR]", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve user directory." },
      { status }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const adminSession = await requireRole(ROLES.ADMIN);
    const body = await request.json();

    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid update payload.",
        },
        { status: 400 }
      );
    }

    const { userId, role, status } = validation.data;

    // Guardrail: prevent admin from suspending or demoting their own active session
    if (userId === adminSession.userId) {
      if (status === USER_STATUS.SUSPENDED) {
        return NextResponse.json(
          { success: false, error: "Administrators cannot suspend their own account." },
          { status: 400 }
        );
      }
      if (role === ROLES.USER) {
        return NextResponse.json(
          { success: false, error: "Administrators cannot remove their own admin privileges." },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (role) updateData.role = role as Role;
    if (status) updateData.status = status as UserStatus;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `User ${updatedUser.name} has been updated successfully.`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("[ADMIN_USERS_PATCH_ERROR]", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update user." },
      { status }
    );
  }
}
