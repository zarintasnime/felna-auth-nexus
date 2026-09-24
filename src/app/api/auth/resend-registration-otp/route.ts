import { NextRequest, NextResponse } from "next/server";
import { requestOtp, normalizeBdPhone } from "@/lib/sms";
import { findUserByPhone } from "@/lib/user";
import { bdPhoneRegex } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !bdPhoneRegex.test(phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a valid Bangladesh mobile number.",
        },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeBdPhone(phone);
    const user = await findUserByPhone(normalizedPhone);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found for this phone number.",
        },
        { status: 404 }
      );
    }

    const result = await requestOtp(normalizedPhone);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Unable to resend OTP. Please wait before retrying.",
          waitSeconds: result.waitSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "A new 6-digit verification code has been dispatched to your mobile number.",
    });
  } catch (error) {
    console.error("[RESEND_REGISTRATION_OTP_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}
