import { NextRequest, NextResponse } from "next/server";
import { verifyOtpSchema } from "@/lib/validations/auth";
import { verifyOtp, normalizeBdPhone } from "@/lib/sms";
import { createUser, findUserByPhone } from "@/lib/user";
import {
  findPendingRegistrationByPhone,
  deletePendingRegistration,
} from "@/lib/pending-registration";
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

    console.log(`\n================== [API: VERIFY REGISTRATION] ==================`);
    console.log(`📱 Target Phone : ${phone} (Normalized: ${normalizedPhone})`);
    console.log(`🔑 Submitted OTP: ${otp}`);
    console.log(`================================================================`);

    // 2. Verify OTP using Phase 3 engine (handles attempts, expiration, hashing)
    const verification = await verifyOtp(normalizedPhone, otp);
    console.log(`[API: VERIFY REGISTRATION] Result for ${normalizedPhone}:`, verification);

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

    // 3. Retrieve temporarily held pending registration payload
    const pending = await findPendingRegistrationByPhone(normalizedPhone);
    if (!pending) {
      console.warn(`[API: VERIFY REGISTRATION] Pending registration not found for phone: ${normalizedPhone}`);
      // Edge check: could they have already been verified?
      const alreadyActive = await findUserByPhone(normalizedPhone);
      if (alreadyActive) {
        return NextResponse.json({
          success: true,
          message: "Account is already verified and active! You can now log in.",
          user: {
            id: alreadyActive.id,
            name: alreadyActive.name,
            phone: alreadyActive.phone,
            status: USER_STATUS.ACTIVE,
          },
        });
      }
      return NextResponse.json(
        {
          success: false,
          error: "No pending registration found for this phone number. Please register again.",
        },
        { status: 404 }
      );
    }

    // 4. STRICT RULE: Create user in the main database ONLY NOW upon verified OTP
    const newUser = await createUser({
      name: pending.name,
      phone: pending.phone,
      email: pending.email,
      passwordHash: pending.passwordHash,
      divisionId: pending.divisionId,
      districtId: pending.districtId,
      upazilaId: pending.upazilaId,
      address: pending.address,
      status: USER_STATUS.ACTIVE,
    });

    // 5. Clean up temporary pending registration record
    await deletePendingRegistration(normalizedPhone);
    console.log(`[API: VERIFY REGISTRATION] ✅ User created in main database and activated for ${normalizedPhone} (${newUser.name})`);

    return NextResponse.json({
      success: true,
      message: "Account verified and activated successfully! You can now log in.",
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
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
