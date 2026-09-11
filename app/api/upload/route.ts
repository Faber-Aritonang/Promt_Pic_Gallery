// POST /api/upload — upload a reference image to Cloudinary.
// Used by the generate page for image-to-image generation.

import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import type { ApiResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { success: false, error: "No file provided." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { success: false, error: "File must be an image." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return Response.json(
        { success: false, error: "Image must be less than 10MB." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const upload = await uploadImage(file, {
      folder: "reference_images",
      tags: ["promtpicgallery", "reference"],
    });

    return Response.json({
      success: true,
      data: {
        url: upload.secure_url,
        public_id: upload.public_id,
        width: upload.width,
        height: upload.height,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}
