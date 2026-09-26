import { NextRequest, NextResponse } from "next/server";
import { loginOtpVerifySchema } from "@/lib/validations/auth";
import { verifyOtp, normalizeBdPhone } from "@/lib/sms";
import { findUserByPhone, activateUser } from "@/lib/user";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { USER_STATUS } from "@/lib/constants/roles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod input validation
    const validation = loginOtpVerifySchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid verification data.";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
        },
        { status: 400 }
      );
    }

    const { phone, otp } = validation.data;
    const normalizedPhone = normalizeBdPhone(phone);

    console.log(`\n================== [API: VERIFY LOGIN OTP] ==================`);
    console.log(`📱 Target Phone : ${phone} (Normalized: ${normalizedPhone})`);
    console.log(`🔑 Submitted OTP: ${otp}`);
    console.log(`=============================================================`);

    // 2. Fetch user
    const user = await findUserByPhone(normalizedPhone);
    if (!user) {
      console.warn(`[API: VERIFY LOGIN OTP] No user account for phone: ${normalizedPhone}`);
      return NextResponse.json(
        {
          success: false,
          error: "No account found matching this mobile number. Please register first.",
        },
        { status: 404 }
      );
    }

    if (user.status === USER_STATUS.SUSPENDED) {
      console.warn(`[API: VERIFY LOGIN OTP] Account is suspended for phone: ${normalizedPhone}`);
      return NextResponse.json(
        {
          success: false,
          error: "Your account is suspended. Please contact customer support.",
        },
        { status: 403 }
      );
    }

    // 3. Verify OTP using Phase 3 engine (attempt limits, lockout, expiration)
    const verification = await verifyOtp(normalizedPhone, otp);
    console.log(`[API: VERIFY LOGIN OTP] Result for ${normalizedPhone}:`, verification);

    if (!verification.success) {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || "Invalid verification code.",
          remainingAttempts: verification.remainingAttempts,
        },
        { status: 400 }
      );
    }

    // 4. Activate user if still in PENDING_VERIFICATION
    if (user.status === USER_STATUS.PENDING_VERIFICATION) {
      console.log(`[API: VERIFY LOGIN OTP] Activating pending user: ${normalizedPhone}`);
      await activateUser(normalizedPhone);
    }

    // 5. Issue signed session JWT
    console.log(`[API: VERIFY LOGIN OTP] Issuing session for user: ${user.phone} (${user.role})`);
    const sessionToken = await createSessionToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
      name: user.name,
    });

    // 6. Set HttpOnly, Secure cookie
    await setSessionCookie(sessionToken);
    console.log(`[API: VERIFY LOGIN OTP] ✅ Session cookie set successfully for ${user.phone}`);

    return NextResponse.json({
      success: true,
      message: "Login successful. Redirecting to your dashboard...",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[VERIFY_LOGIN_OTP_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred during verification. Please try again.",
      },
      { status: 500 }
    );
  }
}
