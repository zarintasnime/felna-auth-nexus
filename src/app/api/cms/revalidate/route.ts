import { NextResponse } from "next/server";
import { revalidateCmsCache } from "@/lib/services/cms-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    revalidateCmsCache("cms-slides");
    revalidateCmsCache("cms-settings");
    revalidateCmsCache("cms-all");
    return NextResponse.json({ success: true, message: "Cache revalidated successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
