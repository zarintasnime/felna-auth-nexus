import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { passwordLoginSchema } from "@/lib/validations/auth";
import { normalizeBdPhone } from "@/lib/sms";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { ROLES, USER_STATUS } from "@/lib/constants/roles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod input validation
    const validation = passwordLoginSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid login credentials.";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
        },
        { status: 400 }
      );
    }

    const { identifier, password } = validation.data;
    const cleanIdentifier = identifier.trim().toLowerCase();
    const normalizedPhone = normalizeBdPhone(identifier.trim());

    console.log(`\n================== [API: PASSWORD LOGIN ATTEMPT] ==================`);
    console.log(`🔑 Identifier     : ${identifier} (Cleaned: ${cleanIdentifier})`);
    console.log(`===================================================================`);

    // 2. Lookup user by email or phone
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: { equals: cleanIdentifier, mode: "insensitive" } },
          { phone: normalizedPhone },
          { phone: identifier.trim() },
        ],
      },
    });

    if (!user) {
      console.warn(`[API: PASSWORD LOGIN] No user found for identifier: ${cleanIdentifier}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email/phone or password. Please try again.",
        },
        { status: 401 }
      );
    }

    // 3. Verify password hash with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      console.warn(`[API: PASSWORD LOGIN] Invalid password for user: ${user.phone}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email/phone or password. Please try again.",
        },
        { status: 401 }
      );
    }

    // 4. Check account status
    if (user.status === USER_STATUS.SUSPENDED) {
      console.warn(`[API: PASSWORD LOGIN] User is suspended: ${user.phone}`);
      return NextResponse.json(
        {
          success: false,
          error: "Your account is suspended. Please contact customer support.",
        },
        { status: 403 }
      );
    }

    // Auto-activate if admin or unverified
    if (user.status === USER_STATUS.PENDING_VERIFICATION) {
      console.log(`[API: PASSWORD LOGIN] Activating unverified user: ${user.phone}`);
      await db.user.update({
        where: { id: user.id },
        data: { status: USER_STATUS.ACTIVE },
      });
    }

    // 5. Issue signed session JWT
    console.log(`[API: PASSWORD LOGIN] Issuing session for user: ${user.phone} (${user.role})`);
    const sessionToken = await createSessionToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
    });

    // 6. Set HttpOnly, Secure cookie
    await setSessionCookie(sessionToken);
    console.log(`[API: PASSWORD LOGIN] ✅ Login successful for ${user.phone}`);

    const redirectUrl = user.role === ROLES.ADMIN ? "/admin/dashboard" : "/dashboard";

    return NextResponse.json({
      success: true,
      message: "Login successful. Redirecting to your dashboard...",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      redirectUrl,
    });
  } catch (error) {
    console.error("[LOGIN_PASSWORD_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred during login. Please try again.",
      },
      { status: 500 }
    );
  }
}
