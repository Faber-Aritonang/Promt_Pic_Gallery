// POST /api/templates — upload a new template (image + prompt + metadata)
// Phase 2/4 (Gallery): Upload image to Cloudinary, save template to Firestore

import { NextRequest } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAuthToken } from "@/lib/services/server-auth";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import type { ApiResponse } from "@/lib/types";

export async function POST(request: NextRequest): Promise<Response> {
  // Rate limit
  const rateLimitError = enforceRateLimit(request, RATE_LIMITS.default);
  if (rateLimitError) return rateLimitError;

  try {
    // Verify authentication (optional - for now we allow uploads without auth)
    let userId = "";
    try {
      const serverUser = await verifyAuthToken(request);
      userId = serverUser?.uid ?? "";
    } catch {
      // Not authenticated - continue without user ID for now
      console.log("[templates/upload] No auth token provided, proceeding without user ID");
    }

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (e) {
      console.error("[templates/upload] Failed to parse form data:", e);
      return Response.json(
        { success: false, error: "Invalid form data" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    console.log("[templates/upload] Received form data:", {
      title: formData.get("title"),
      description: formData.get("description"),
      original_prompt: formData.get("original_prompt"),
      original_image_generated_with: formData.get("original_image_generated_with"),
      hasImage: formData.get("image") !== null,
    });

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const original_prompt = formData.get("original_prompt") as string;
    const original_image_generated_with = formData.get("original_image_generated_with") as string;
    const categoryParam = formData.get("category") as string;
    const tagsParam = formData.get("tags") as string;
    const style_tips = formData.get("style_tips") as string;
    const difficulty_level = formData.get("difficulty_level") as "beginner" | "intermediate" | "advanced";
    const image = formData.get("image") as File;

    console.log("[templates/upload] Validating fields:", {
      title: title ? "PRESENT" : "MISSING",
      description: description ? "PRESENT" : "MISSING",
      original_prompt: original_prompt ? "PRESENT" : "MISSING",
      original_image_generated_with: original_image_generated_with ? "PRESENT" : "MISSING",
      image: image ? "PRESENT" : "MISSING",
    });

    // Validate required fields
    if (!title || !description || !original_prompt || !original_image_generated_with || !image) {
      console.error("[templates/upload] Validation failed - missing fields");
      return Response.json(
        { success: false, error: "Missing required fields: title, description, original_prompt, original_image_generated_with, image" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return Response.json(
        { success: false, error: "Title too long (max 200 characters)" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (original_prompt.length > 4000) {
      return Response.json(
        { success: false, error: "Prompt too long (max 4000 characters)" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Parse categories
    let category: string[] = [];
    if (categoryParam) {
      category = categoryParam.split(",").map((c) => c.trim()).filter(Boolean);
    }

    // Parse tags
    let tags: string[] = [];
    if (tagsParam) {
      tags = tagsParam.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // Upload image to Cloudinary
    let image_url = "";
    let image_storage_path = "";
    let width = 0;
    let height = 0;

    try {
      const upload = await uploadImage(image, {
        folder: "templates",
        tags: ["template", ...tags],
      });
      image_url = upload.secure_url;
      image_storage_path = upload.public_id;
      width = upload.width;
      height = upload.height;
    } catch (uploadError) {
      console.error("[templates] Cloudinary upload failed:", uploadError);
      return Response.json(
        { success: false, error: "Failed to upload image: " + (uploadError instanceof Error ? uploadError.message : "Unknown error") } satisfies ApiResponse,
        { status: 500 }
      );
    }

    // Save to Firestore
    const created_at = Date.now();
    let templateId = "";

    try {
      const db = getAdminDb();
      const docRef = await db.collection("templates").add({
        title,
        description,
        original_prompt,
        original_image_url: image_url,
        original_image_generated_with,
        category,
        tags,
        style_tips: style_tips || "",
        difficulty_level: difficulty_level || "intermediate",
        created_by: userId || "anonymous",
        created_at,
        views_count: 0,
        favorites_count: 0,
        times_used: 0,
        rating: 0,
        status: "active",
      });
      templateId = docRef.id;
    } catch (dbError) {
      console.error("[templates] Firestore save failed:", dbError);
      // Continue even if Firestore fails, template is still uploaded
    }

    const body: ApiResponse = {
      success: true,
      data: {
        id: templateId,
        title,
        description,
        original_prompt,
        original_image_url: image_url,
        original_image_generated_with,
        category,
        tags,
        style_tips: style_tips || "",
        difficulty_level: difficulty_level || "intermediate",
        created_at,
      },
    };

    return Response.json(body);
  } catch (error) {
    console.error("[templates] Upload error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
