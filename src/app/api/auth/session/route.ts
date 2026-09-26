import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        userId: session.userId,
        name: session.name,
        phone: session.phone,
        role: session.role,
      },
    });
  } catch (error) {
    console.error("[SESSION_CHECK_ERROR]", error);
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }
}
