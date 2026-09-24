import { NextRequest, NextResponse } from "next/server";
import { verifyOtpSchema } from "@/lib/validations/auth";
import { verifyOtp, normalizeBdPhone } from "@/lib/sms";
import { activateUser, findUserByPhone } from "@/lib/user";
import { USER_STATUS } from "@/lib/constants/roles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod input validation
    const validation = verifyOtpSchema.safeParse(body);
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

    // 2. Verify OTP using Phase 3 engine (handles attempts, expiration, hashing)
    const verification = await verifyOtp(normalizedPhone, otp);
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

    // 3. Ensure user exists
    const user = await findUserByPhone(normalizedPhone);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found matching this phone number. Please register first.",
        },
        { status: 404 }
      );
    }

    // 4. Activate user: flip status from PENDING_VERIFICATION to ACTIVE
    await activateUser(normalizedPhone);

    return NextResponse.json({
      success: true,
      message: "Account verified and activated successfully! You can now log in.",
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        status: USER_STATUS.ACTIVE,
      },
    });
  } catch (error) {
    console.error("[VERIFY_REGISTRATION_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred during verification. Please try again.",
      },
      { status: 500 }
    );
  }
}
