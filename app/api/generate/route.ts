// POST /api/generate — generate an image from a prompt with the selected model.
// Phase 4 (Image Generation): Hugging Face + Replicate → Cloudinary storage
// → optional Firestore record (best effort; skipped when not configured).
//
// Request body:
//   { prompt: string, model?: string, width?: number, height?: number, templateId?: string, provider?: "huggingface" | "replicate" }

import { NextRequest } from "next/server";
import {
  generateWithHuggingFace,
  getImageModel,
  isHuggingFaceConfigured,
} from "@/lib/services/generation";
import {
  generateWithReplicate,
  isReplicateConfigured,
  replicateModels,
} from "@/lib/services/replicate";
import { uploadImage } from "@/lib/cloudinary";
import { getAdminDb } from "@/lib/firebase-admin";
import { verifyAuthToken } from "@/lib/services/server-auth";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import type { ApiResponse } from "@/lib/types";

interface GenerateRequest {
  prompt?: string;
  model?: string;
  width?: number;
  height?: number;
  templateId?: string;
  provider?: "huggingface" | "replicate";
}

export async function POST(request: NextRequest): Promise<Response> {
  // Rate limit — image generation is expensive
  const rateLimitError = enforceRateLimit(request, RATE_LIMITS.generate);
  if (rateLimitError) return rateLimitError;

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

    // Determine provider
    const useReplicate =
      body.provider === "replicate" ||
      (body.model && replicateModels.some((m) => m.id === body.model));

    if (useReplicate) {
      if (!isReplicateConfigured()) {
        return Response.json(
          {
            success: false,
            error: "REPLICATE_API_TOKEN is not configured. Add it to .env.local.",
          } satisfies ApiResponse,
          { status: 503 }
        );
      }

      // Generate with Replicate
      const result = await generateWithReplicate(prompt, body.model, {
        width: body.width,
        height: body.height,
      });

      // Upload to Cloudinary
      const upload = await uploadImage(result.imageBuffer, {
        folder: "generated_images",
        tags: ["promtpicgallery", result.model.id],
      });

      // Save to Firestore (best effort, with auth if available)
      const created_at = Date.now();
      let savedToFirestore = false;
      let userId = "";
      try {
        const serverUser = await verifyAuthToken(request);
        userId = serverUser?.uid ?? "";
      } catch {
        // Not authenticated, continue
      }

      try {
        const db = getAdminDb();
        await db.collection("generated_images").add({
          user_version_id: "",
          user_id: userId,
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

      return Response.json({
        success: true,
        data: {
          image_url: upload.secure_url,
          public_id: upload.public_id,
          model_used: result.model.id,
          model_name: result.model.name,
          provider: "replicate",
          width: upload.width ?? body.width ?? result.model.defaultWidth,
          height: upload.height ?? body.height ?? result.model.defaultHeight,
          generation_time_ms: result.inferenceMs,
          saved_to_firestore: savedToFirestore,
          created_at,
        },
      });
    }

    // Default: Hugging Face
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
      // Check if it's a Replicate model
      if (replicateModels.some((m) => m.id === body.model)) {
        return Response.json(
          {
            success: false,
            error: `Model "${body.model}" is a Replicate model. Set provider to "replicate" or use a Hugging Face model.`,
          } satisfies ApiResponse,
          { status: 400 }
        );
      }
      return Response.json(
        { success: false, error: `Unknown model: ${body.model}` } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Generate with Hugging Face
    const result = await generateWithHuggingFace(prompt, body.model, {
      width: body.width,
      height: body.height,
    });

    // Store on Cloudinary
    const upload = await uploadImage(result.imageBuffer, {
      folder: "generated_images",
      tags: ["promtpicgallery", result.model.id],
    });

    // Best-effort Firestore record
    const created_at = Date.now();
    let savedToFirestore = false;
    let userId = "";
    try {
      const serverUser = await verifyAuthToken(request);
      userId = serverUser?.uid ?? "";
    } catch {
      // Not authenticated
    }

    try {
      const db = getAdminDb();
      await db.collection("generated_images").add({
        user_version_id: "",
        user_id: userId,
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
      provider: "huggingface",
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
