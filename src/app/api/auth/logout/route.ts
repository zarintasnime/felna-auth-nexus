import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await clearSessionCookie();

    const acceptHeader = request.headers.get("accept") || "";
    const isJsonRequest =
      acceptHeader.includes("application/json") ||
      request.headers.get("content-type")?.includes("application/json");

    if (isJsonRequest) {
      return NextResponse.json({
        success: true,
        message: "You have been successfully logged out.",
      });
    }

    // Direct browser form submission fallback -> redirect cleanly to login page
    return NextResponse.redirect(new URL("/login?logout=success", request.url), {
      status: 303,
    });
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process logout. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await clearSessionCookie();
    return NextResponse.redirect(new URL("/login?logout=success", request.url), {
      status: 303,
    });
  } catch (error) {
    console.error("[LOGOUT_GET_ERROR]", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
