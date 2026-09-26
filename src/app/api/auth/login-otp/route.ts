import { NextRequest, NextResponse } from "next/server";
import { loginOtpRequestSchema } from "@/lib/validations/auth";
import { findUserByPhone } from "@/lib/user";
import { requestOtp, normalizeBdPhone } from "@/lib/sms";
import { USER_STATUS } from "@/lib/constants/roles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod input validation
    const validation = loginOtpRequestSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid mobile phone number.";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
        },
        { status: 400 }
      );
    }

    const { phone } = validation.data;
    const normalizedPhone = normalizeBdPhone(phone);

    console.log(`\n================== [API: LOGIN OTP REQUEST] ==================`);
    console.log(`📱 Target Phone : ${phone} (Normalized: ${normalizedPhone})`);
    console.log(`==============================================================`);

    // 2. Check user existence
    const user = await findUserByPhone(normalizedPhone);
    if (!user) {
      console.warn(`[API: LOGIN OTP] User not found for phone: ${normalizedPhone}`);
      return NextResponse.json(
        {
          success: false,
          error: "No account found matching this mobile number. Please register first.",
        },
        { status: 404 }
      );
    }

    // 3. Check account status
    if (user.status === USER_STATUS.SUSPENDED) {
      console.warn(`[API: LOGIN OTP] Account is suspended for phone: ${normalizedPhone}`);
      return NextResponse.json(
        {
          success: false,
          error: "Your account has been suspended. Please contact customer support for assistance.",
        },
        { status: 403 }
      );
    }

    // 4. Dispatch login OTP via SMS engine (enforcing 60-second cooldown)
    console.log(`[API: LOGIN OTP] Dispatching login OTP to ${normalizedPhone} (${user.name})...`);
    const otpResult = await requestOtp(normalizedPhone);
    console.log(`[API: LOGIN OTP] Dispatch Result for ${normalizedPhone}:`, otpResult);

    if (!otpResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: otpResult.error || "Unable to send login verification code. Please try again.",
          waitSeconds: otpResult.waitSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A 6-digit login verification code has been dispatched to your mobile phone.",
      phone: normalizedPhone,
      isPendingVerification: user.status === USER_STATUS.PENDING_VERIFICATION,
    });
  } catch (error) {
    console.error("[LOGIN_OTP_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred during login. Please try again.",
      },
      { status: 500 }
    );
  }
}
