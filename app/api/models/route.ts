// GET /api/models — list supported image generation models.
// Phase 4 (Image Generation)
import { imageModels, isHuggingFaceConfigured } from "@/lib/services/generation";
import type { ApiResponse } from "@/lib/types";

export async function GET(): Promise<Response> {
  const body: ApiResponse = {
    success: true,
    data: {
      configured: isHuggingFaceConfigured(),
      default_model: imageModels[0]?.id ?? null,
      models: imageModels,
    },
  };
  return Response.json(body);
}