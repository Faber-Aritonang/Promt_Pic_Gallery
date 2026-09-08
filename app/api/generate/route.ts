// POST /api/generate — generate an image from a prompt with the selected model.
// Phase 4 (Image Generation): Hugging Face Inference Providers → Cloudinary storage
// → optional Firestore record (best effort; skipped when not configured).
//
// Request body:
//   { prompt: string, model?: string, width?: number, height?: number, templateId?: string }

import { NextRequest } from "next/server";
import {
  generateWithHuggingFace,
  getImageModel,
  isHuggingFaceConfigured,
} from "@/lib/services/generation";
import { uploadImage } from "@/lib/cloudinary";
import { getAdminDb } from "@/lib/firebase-admin";
import type { ApiResponse } from "@/lib/types";

interface GenerateRequest {
  prompt?: string;
  model?: string;
  width?: number;
  height?: number;
  templateId?: string;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    let body: GenerateRequest;
    try {
      body = (await request.json()) as GenerateRequest;
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const prompt = body.prompt?.trim();
    if (!prompt) {
      return Response.json(
        { success: false, error: "Prompt is required." } satisfies ApiResponse,
        { status: 400 }
      );
    }
    if (prompt.length > 4000) {
      return Response.json(
        { success: false, error: "Prompt is too long (max 4000 characters)." } satisfies ApiResponse,
        { status: 400 }
      );
    }
    if (!isHuggingFaceConfigured()) {
      return Response.json(
        {
          success: false,
          error:
            "HUGGING_FACE_API_KEY is not configured. Add it to .env.local — get a free token at https://huggingface.co/settings/tokens.",
        } satisfies ApiResponse,
        { status: 503 }
      );
    }
    if (body.model && !getImageModel(body.model)) {
      return Response.json(
        { success: false, error: `Unknown model: ${body.model}` } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Generate the image with Hugging Face
    const result = await generateWithHuggingFace(prompt, body.model, {
      width: body.width,
      height: body.height,
    });

    // Store it on Cloudinary (folder: generated_images)
    const upload = await uploadImage(result.imageBuffer, {
      folder: "generated_images",
      tags: ["promtpicgallery", result.model.id],
    });

    // Best-effort record in Firestore (requires server credentials + auth rules)
    const created_at = Date.now();
    let savedToFirestore = false;
    try {
      const db = getAdminDb();
      await db.collection("generated_images").add({
        user_version_id: "",
        user_id: "",
        is_public: false,
        prompt,
        model_used: result.model.id,
        model_params: {
          width: body.width ?? result.model.defaultWidth,
          height: body.height ?? result.model.defaultHeight,
        },
        image_url: upload.secure_url,
        image_storage_path: upload.public_id,
        generation_time_ms: result.inferenceMs,
        status: "success",
        created_at,
        metadata: { model_response: null, usage: { tokens_used: 0, cost: 0 } },
        ...(body.templateId ? { template_id: body.templateId } : {}),
      });
      savedToFirestore = true;
    } catch (error) {
      console.warn("[generate] Skipped Firestore save:", error);
    }

    const data = {
      image_url: upload.secure_url,
      public_id: upload.public_id,
      model_used: result.model.id,
      model_name: result.model.name,
      width: upload.width ?? body.width ?? result.model.defaultWidth,
      height: upload.height ?? body.height ?? result.model.defaultHeight,
      generation_time_ms: result.inferenceMs,
      saved_to_firestore: savedToFirestore,
      created_at,
    };

    return Response.json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Image generation failed.";
    return Response.json({ success: false, error: message }, { status: 500 });
  }
}