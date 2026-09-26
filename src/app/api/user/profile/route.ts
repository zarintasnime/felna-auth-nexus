import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/rbac";
import { db } from "@/lib/db";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().trim().min(3, "Full name must be at least 3 characters long."),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .optional()
    .or(z.literal("")),
  divisionId: z.string().optional().or(z.literal("")),
  districtId: z.string().optional().or(z.literal("")),
  upazilaId: z.string().optional().or(z.literal("")),
  address: z.string().trim().optional(),
});

export async function GET() {
  try {
    const session = await requireAuth();

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        address: true,
        divisionId: true,
        districtId: true,
        upazilaId: true,
        division: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
        upazila: { select: { id: true, name: true } },
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("[GET_PROFILE_ERROR]", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to retrieve profile." },
      { status }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await request.json();

    const validation = updateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error.issues[0]?.message || "Invalid profile data.",
        },
        { status: 400 }
      );
    }

    const { name, email, divisionId, districtId, upazilaId, address } = validation.data;

    // Check duplicate email if changed
    if (email) {
      const existing = await db.user.findFirst({
        where: {
          email: email.toLowerCase(),
          NOT: { id: session.userId },
        },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "This email address is already associated with another account." },
          { status: 409 }
        );
      }
    }

    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: {
        name,
        email: email ? email.toLowerCase() : null,
        divisionId: divisionId || null,
        districtId: districtId || null,
        upazilaId: upazilaId || null,
        address: address || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        address: true,
        division: { select: { id: true, name: true } },
        district: { select: { id: true, name: true } },
        upazila: { select: { id: true, name: true } },
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("[UPDATE_PROFILE_ERROR]", error);
    const status = error.statusCode || 500;
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status }
    );
  }
}
