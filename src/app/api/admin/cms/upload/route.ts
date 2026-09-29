import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { logCmsAction } from "@/lib/services/cms-service";
import path from "path";
import fs from "fs/promises";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

// 5MB maximum file size
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission(PERMISSIONS.CMS_WRITE);

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded. Please provide a 'file' form field." },
        { status: 400 }
      );
    }

    // 1. File size validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 5MB limit (Provided: ${(file.size / (1024 * 1024)).toFixed(2)} MB).`,
        },
        { status: 400 }
      );
    }

    // 2. MIME type validation
    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file format (${file.type}). Allowed formats: JPEG, PNG, WebP, GIF, SVG.`,
        },
        { status: 400 }
      );
    }

    // 3. Sanitize and prepare unique filename
    const originalName = file.name || "image.png";
    const extension = path.extname(originalName).toLowerCase() || ".png";
    const baseName = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);

    const uniqueFilename = `${Date.now()}_${baseName}${extension}`;

    // 4. Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "cms");
    await fs.mkdir(uploadsDir, { recursive: true });

    // 5. Write file to disk
    const targetFilePath = path.join(uploadsDir, uniqueFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(targetFilePath, buffer);

    const publicUrl = `/uploads/cms/${uniqueFilename}`;

    await logCmsAction({
      userId: session.userId,
      action: "UPLOAD_IMAGE",
      entity: "Media",
      entityId: uniqueFilename,
      changes: {
        filename: uniqueFilename,
        size: file.size,
        mimeType: file.type,
        url: publicUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully.",
      data: {
        url: publicUrl,
        filename: uniqueFilename,
        size: file.size,
        mimeType: file.type,
      },
    });
  } catch (error: any) {
    console.error("[CMS_UPLOAD_ERROR]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file." },
      { status: error.statusCode || 500 }
    );
  }
}
