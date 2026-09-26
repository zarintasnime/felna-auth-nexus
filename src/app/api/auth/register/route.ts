import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations/auth";
import { findUserByPhone, findUserByEmail } from "@/lib/user";
import { requestOtp, normalizeBdPhone } from "@/lib/sms";
import { savePendingRegistration } from "@/lib/pending-registration";

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

    // 2. Duplicate phone check (in main User table)
    const existingPhoneUser = await findUserByPhone(normalizedPhone);
    if (existingPhoneUser) {
      console.warn(`[API: REGISTER] Registration rejected - phone already exists: ${normalizedPhone}`);
      return NextResponse.json(
        {
          success: false,
          error: "An account with this phone number already exists. Please log in.",
        },
        { status: 409 }
      );
    }

    // 3. Duplicate email check (in main User table)
    if (email) {
      const existingEmailUser = await findUserByEmail(email);
      if (existingEmailUser) {
        console.warn(`[API: REGISTER] Registration rejected - email already exists: ${email}`);
        return NextResponse.json(
          {
            success: false,
            error: "An account with this email address already exists. Please log in or use a different email.",
          },
          { status: 409 }
        );
      }
    }

    // 4. STRICT RULE: Hold payload in PendingRegistration table.
    // User record is NEVER created in the main User table until OTP verification succeeds.
    const passwordHash = await bcrypt.hash(password, 10);
    await savePendingRegistration({
      name,
      phone: normalizedPhone,
      email: email.trim().toLowerCase(),
      passwordHash,
      divisionId: divisionId || null,
      districtId: districtId || null,
      upazilaId: upazilaId || null,
      address: address?.trim() || null,
    });
    console.log(`[API: REGISTER] Held registration payload in PendingRegistration for ${normalizedPhone}`);

    // 5. Trigger initial OTP dispatch via OTP engine
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
          "Registration initiated! A 6-digit verification code has been dispatched to your mobile number.",
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
