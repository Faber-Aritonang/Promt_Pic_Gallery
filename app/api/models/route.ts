// GET /api/models — list supported image generation models.
// Phase 4 (Image Generation): Hugging Face + Replicate
import {
  imageModels,
  isHuggingFaceConfigured,
} from "@/lib/services/generation";
import {
  replicateModels,
  isReplicateConfigured,
} from "@/lib/services/replicate";
import type { ApiResponse } from "@/lib/types";

export async function GET(): Promise<Response> {
  const hfConfigured = isHuggingFaceConfigured();
  const replicateConfigured = isReplicateConfigured();

  // Combine models from both providers
  const allModels = [
    ...imageModels.map((m) => ({
      ...m,
      provider: "huggingface" as const,
      available: hfConfigured,
    })),
    ...replicateModels.map((m) => ({
      id: m.id,
      name: m.name,
      provider: "replicate" as const,
      description: m.description,
      free: m.free,
      defaultWidth: m.defaultWidth,
      defaultHeight: m.defaultHeight,
      available: replicateConfigured,
    })),
  ];

  const body: ApiResponse = {
    success: true,
    data: {
      configured: hfConfigured || replicateConfigured,
      hf_configured: hfConfigured,
      replicate_configured: replicateConfigured,
      default_model: imageModels[0]?.id ?? null,
      models: allModels,
    },
  };
  return Response.json(body);
}
