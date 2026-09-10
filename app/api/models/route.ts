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
      // Respect per-model availability (models unsupported by the current
      // provider stay hidden), combined with the provider-level config.
      available: hfConfigured && m.available !== false,
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

  // Pick default model based on what's configured
  let defaultModel: string | null = null;
  if (hfConfigured && imageModels.length > 0) {
    defaultModel = imageModels[0].id;
  } else if (replicateConfigured && replicateModels.length > 0) {
    defaultModel = replicateModels[0].id;
  } else if (allModels.length > 0) {
    defaultModel = allModels[0].id;
  }

  const body: ApiResponse = {
    success: true,
    data: {
      configured: hfConfigured || replicateConfigured,
      hf_configured: hfConfigured,
      replicate_configured: replicateConfigured,
      default_model: defaultModel,
      models: allModels,
    },
  };
  return Response.json(body);
}
