import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations/auth";
import { findUserByPhone, findUserByEmail, createUser } from "@/lib/user";
import { requestOtp, normalizeBdPhone } from "@/lib/sms";
import { USER_STATUS } from "@/lib/constants/roles";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Zod input validation
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      let firstError = validation.error.issues[0]?.message || "Invalid registration data.";
      if (
        validation.error.issues[0]?.path[0] === "email" &&
        validation.error.issues[0]?.code === "invalid_type"
      ) {
        firstError = "Email is required.";
      }
      return NextResponse.json(
        {
          success: false,
          error: firstError,
          issues: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, phone, email, password, divisionId, districtId, upazilaId, address } =
      validation.data;
    const normalizedPhone = normalizeBdPhone(phone);

    console.log(`\n================== [API: REGISTER REQUEST] ==================`);
    console.log(`👤 Name           : ${name}`);
    console.log(`📱 Phone          : ${phone} (Normalized: ${normalizedPhone})`);
    console.log(`📧 Email          : ${email || "N/A"}`);
    console.log(`📍 Region IDs     : Div: ${divisionId}, Dist: ${districtId}, Upz: ${upazilaId}`);
    console.log(`============================================================`);

    // 2. Duplicate phone check
    const existingPhoneUser = await findUserByPhone(normalizedPhone);
    if (existingPhoneUser) {
      if (existingPhoneUser.status === USER_STATUS.ACTIVE) {
        console.warn(`[API: REGISTER] Registration rejected - phone already active: ${normalizedPhone}`);
        return NextResponse.json(
          {
            success: false,
            error: "An account with this phone number already exists. Please log in.",
          },
          { status: 409 }
        );
      }
    }

    // 3. Duplicate email check (if provided)
    if (email) {
      const existingEmailUser = await findUserByEmail(email);
      if (existingEmailUser) {
        console.warn(`[API: REGISTER] Registration rejected - email already exists: ${email}`);
        return NextResponse.json(
          {
            success: false,
            error: "An account with this email address already exists.",
          },
          { status: 409 }
        );
      }
    }

    // 4. Create user in PENDING_VERIFICATION state
    if (!existingPhoneUser) {
      await createUser({
        name,
        phone: normalizedPhone,
        email: email || null,
        password,
        divisionId,
        districtId,
        upazilaId,
        address: address || null,
      });
      console.log(`[API: REGISTER] Created pending user record for ${normalizedPhone}`);
    }

    // 5. Trigger initial OTP dispatch via Phase 3 engine
    console.log(`[API: REGISTER] Dispatching registration OTP to ${normalizedPhone}...`);
    const otpResult = await requestOtp(normalizedPhone);
    console.log(`[API: REGISTER] OTP Result for ${normalizedPhone}:`, otpResult);

    if (!otpResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: otpResult.error || "Unable to send verification code. Please try again.",
          waitSeconds: otpResult.waitSeconds,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Registration successful! A 6-digit verification code has been dispatched to your mobile number.",
        phone: normalizedPhone,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred during registration. Please try again.",
      },
      { status: 500 }
    );
  }
}
