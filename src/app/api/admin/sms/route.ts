import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { ROLES } from "@/lib/constants/roles";
import { db } from "@/lib/db";
import {
  sendSms,
  normalizeBdPhone,
  OTP_CONFIG,
  IGL_RESPONSE_CODES,
} from "@/lib/sms";

/**
 * GET /api/admin/sms
 * Returns Gateway Health, configuration status, OTP metrics, and recent dispatch logs.
 */
export async function GET() {
  try {
    await requireRole(ROLES.ADMIN);

    const apiKey = process.env.IGL_API_KEY;
    const isMock =
      process.env.MOCK_SMS === "true" ||
      !apiKey ||
      apiKey === "your_igl_sms_api_key";

    const gatewayInfo = {
      provider: "IGL Web Carrier-Grade SMS Gateway",
      apiUrl: process.env.IGL_API_URL || "http://sms.iglweb.com/api/v1/send",
      senderId: process.env.IGL_SENDER_ID || "01844532630",
      isMockMode: isMock,
      isConfigured: Boolean(apiKey && apiKey !== "your_igl_sms_api_key"),
      maskedApiKey: apiKey
        ? `${apiKey.slice(0, 4)}••••••••${apiKey.slice(-4)}`
        : "Not Configured",
      config: OTP_CONFIG,
    };

    // Calculate metrics
    const [totalOtps, verifiedOtps, recentLogs] = await Promise.all([
      db.otpVerification.count(),
      db.otpVerification.count({ where: { verifiedAt: { not: null } } }),
      db.otpVerification.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
        select: {
          id: true,
          phone: true,
          attempts: true,
          expiresAt: true,
          verifiedAt: true,
          createdAt: true,
        },
      }),
    ]);

    const expiredOtps = totalOtps - verifiedOtps;
    const deliveryRate = totalOtps > 0 ? Math.round((verifiedOtps / totalOtps) * 100) : 100;

    return NextResponse.json({
      success: true,
      data: {
        gateway: gatewayInfo,
        stats: {
          totalSent: totalOtps,
          verified: verifiedOtps,
          pendingOrExpired: expiredOtps,
          deliveryRate: `${deliveryRate}%`,
        },
        recentLogs,
        responseCodes: IGL_RESPONSE_CODES,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN_SMS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load SMS gateway data." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * POST /api/admin/sms
 * Dispatches a real or mock test SMS through the IGL SMS Gateway
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(ROLES.ADMIN);
    const body = await request.json();

    const { phone, message } = body;

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Recipient phone number is required." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "SMS message content cannot be empty." },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeBdPhone(phone.trim());

    const result = await sendSms({
      phone: normalizedPhone,
      message: message.trim(),
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "SMS delivery failed. Check gateway balance or API parameters.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `SMS successfully queued for dispatch to ${normalizedPhone}.`,
      result,
    });
  } catch (error: any) {
    console.error("[ADMIN_SMS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch test SMS." },
      { status: error.statusCode || 500 }
    );
  }
}

/**
 * DELETE /api/admin/sms
 * Clears old expired OTP verification records
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(ROLES.ADMIN);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      await db.otpVerification.delete({ where: { id } });
      return NextResponse.json({
        success: true,
        message: "OTP dispatch record removed.",
      });
    }

    // Otherwise clear all expired records older than 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const deleteResult = await db.otpVerification.deleteMany({
      where: {
        expiresAt: { lt: yesterday },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleared ${deleteResult.count} expired OTP records.`,
      count: deleteResult.count,
    });
  } catch (error: any) {
    console.error("[ADMIN_SMS_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to purge OTP records." },
      { status: error.statusCode || 500 }
    );
  }
}
