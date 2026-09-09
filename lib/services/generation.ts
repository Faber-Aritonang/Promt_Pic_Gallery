// Image generation service — Phase 4.
// Supports Hugging Face Inference Providers (free tier).
// The legacy serverless endpoint (api-inference.huggingface.co) was retired in
// late 2025 — the replacement lives at router.huggingface.co/hf-inference.
// Replicate is supported via lib/services/replicate.ts.

// ── Types ──────────────────────────────────────────────────────────────────

export interface ImageModel {
  id: string;
  name: string;
  provider: "huggingface";
  description: string;
  free: boolean;
  defaultWidth: number;
  defaultHeight: number;
}

export interface GenerateImageResult {
  imageBuffer: Buffer;
  contentType: string;
  model: ImageModel;
  inferenceMs: number;
}

// ── Model catalog ──────────────────────────────────────────────────────────
// Free text-to-image models available via the HF Inference provider.

// Curated free-tier text-to-image models served by the HF Inference provider.
// Model availability on the free tier changes over time (large models like
// FLUX.1 exceed the ~10B-parameter free limit) — if a model 404s, the API
// returns a clear error and another model can be selected.
export const imageModels: ImageModel[] = [
  {
    id: "stabilityai/stable-diffusion-3-medium-diffusers",
    name: "Stable Diffusion 3 Medium",
    provider: "huggingface",
    description: "SD3 Medium — quality 1024px output, listed in the official HF Inference docs.",
    free: true,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    name: "Stable Diffusion XL",
    provider: "huggingface",
    description: "SDXL base 1.0 — detailed 1024px output.",
    free: true,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "stabilityai/stable-diffusion-2-1",
    name: "Stable Diffusion 2.1",
    provider: "huggingface",
    description: "Improved photorealism and composition at 768px.",
    free: true,
    defaultWidth: 768,
    defaultHeight: 768,
  },
  {
    id: "runwayml/stable-diffusion-v1-5",
    name: "Stable Diffusion 1.5",
    provider: "huggingface",
    description: "Classic, fast SD 1.5 — great for quick iterations.",
    free: true,
    defaultWidth: 512,
    defaultHeight: 512,
  },
  {
    id: "prompthero/openjourney",
    name: "Openjourney v4",
    provider: "huggingface",
    description: "Midjourney-style artistic generations (based on SD 1.5).",
    free: true,
    defaultWidth: 512,
    defaultHeight: 512,
  },
];

export function getImageModel(id: string): ImageModel | undefined {
  return imageModels.find((m) => m.id === id);
}

export function getDefaultImageModel(): ImageModel {
  return imageModels[0];
}

// ── Configuration ──────────────────────────────────────────────────────────

export function isHuggingFaceConfigured(): boolean {
  const key = process.env.HUGGING_FACE_API_KEY;
  return Boolean(key && key.length > 0 && key !== "your_huggingface_api_key");
}

// ── Hugging Face Inference Providers ───────────────────────────────────────

// HF Inference provider via the Inference Providers router (replaced the
// retired api-inference.huggingface.co endpoint in late 2025).
const HF_INFERENCE_URL = "https://router.huggingface.co/hf-inference/models/";

/**
 * Generate an image from a text prompt via the HF Inference provider.
 * Uses `x-wait-for-model: true` so cold models are loaded before responding.
 */
export async function generateWithHuggingFace(
  prompt: string,
  modelId?: string,
  options?: {
    width?: number;
    height?: number;
    timeoutMs?: number;
  }
): Promise<GenerateImageResult> {
  if (!isHuggingFaceConfigured()) {
    throw new Error(
      "HUGGING_FACE_API_KEY is not configured. Add it to .env.local (get a free token at https://huggingface.co/settings/tokens)."
    );
  }

  const model = getImageModel(modelId ?? "") ?? getDefaultImageModel();
  const apiKey = process.env.HUGGING_FACE_API_KEY as string;
  const startedAt = Date.now();

  const body: Record<string, unknown> = { inputs: prompt };
  if (options?.width || options?.height) {
    body.parameters = {
      ...(options.width ? { width: options.width } : {}),
      ...(options.height ? { height: options.height } : {}),
    };
  }

  let response: Response;
  try {
    response = await fetch(`${HF_INFERENCE_URL}${model.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(options?.timeoutMs ?? 90_000),
    });
  } catch {
    throw new Error(
      "Could not reach the Hugging Face API (network error). Check your internet connection and that router.huggingface.co is not blocked."
    );
  }

  const contentType = response.headers.get("content-type") ?? "";

  // Non-OK responses and JSON payloads (e.g. model loading errors) are errors
  if (!response.ok || contentType.includes("application/json")) {
    let message = `Hugging Face error (${response.status})`;
    try {
      const err = (await response.json()) as {
        error?: string;
        message?: string;
        estimated_time?: number;
      };
      message = err.error ?? err.message ?? message;
      if (typeof err.estimated_time === "number") {
        message += ` — model is loading (est. ${Math.ceil(err.estimated_time)}s). Try again shortly.`;
      }
    } catch {
      // Keep the generic message if the body is not JSON
    }
    throw new Error(message);
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    imageBuffer: Buffer.from(arrayBuffer),
    contentType,
    model,
    inferenceMs: Date.now() - startedAt,
  };
}