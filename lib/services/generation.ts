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
  /** Optional: specific HF Inference provider (e.g. "fal", "replicate", "hf-inference") */
  hfProvider?: string;
}

export interface GenerateImageResult {
  imageBuffer: Buffer;
  contentType: string;
  model: ImageModel;
  inferenceMs: number;
}

// ── Model catalog ──────────────────────────────────────────────────────────
// Text-to-image models available via HF Inference Providers.
//
// NOTE: As of July 2025, the `hf-inference` provider focuses on CPU inference.
// For GPU text-to-image models, other providers (fal, replicate, together) are
// used. The router auto-selects the best available provider.
//
// Model IDs must match the exact Hugging Face model repo IDs.
// The `-diffusers` suffix is sometimes needed for the diffusers-compatible
// version of a model.

export const imageModels: ImageModel[] = [
  {
    id: "stabilityai/stable-diffusion-3-medium-diffusers",
    name: "Stable Diffusion 3 Medium",
    provider: "huggingface",
    description: "SD3 Medium — quality 1024px output, MMDiT architecture.",
    free: true,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "stabilityai/stable-diffusion-xl-base-1.0",
    name: "Stable Diffusion XL",
    provider: "huggingface",
    description: "SDXL base 1.0 — detailed 1024px output, widely supported.",
    free: true,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "black-forest-labs/FLUX.1-schnell",
    name: "FLUX.1 Schnell",
    provider: "huggingface",
    description: "Fast, high-quality text-to-image from Black Forest Labs.",
    free: true,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "prompthero/openjourney-v4",
    name: "Openjourney v4",
    provider: "huggingface",
    description: "Midjourney-style artistic generations (based on SD 1.5).",
    free: true,
    defaultWidth: 512,
    defaultHeight: 512,
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
// The router auto-selects the best available provider for the model.
const HF_INFERENCE_URL = "https://router.huggingface.co/hf-inference/models/";

/**
 * Generate an image from a text prompt via the HF Inference provider.
 * Uses `x-wait-for-model: true` so cold models are loaded before responding.
 *
 * The API expects:
 *   POST {HF_URL}/{modelId}
 *   Headers: Authorization: Bearer <token>, Accept: image/png
 *   Body: { "inputs": "prompt", "parameters": { "width": ..., "height": ... } }
 *
 * On success, returns raw image bytes. On error, returns JSON with error info.
 */
export async function generateWithHuggingFace(
  prompt: string,
  modelId?: string,
  options?: {
    width?: number;
    height?: number;
    timeoutMs?: number;
    numInferenceSteps?: number;
    guidanceScale?: number;
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

  // Build request body with optional parameters
  const parameters: Record<string, unknown> = {};
  if (options?.width) parameters.width = options.width;
  if (options?.height) parameters.height = options.height;
  if (options?.numInferenceSteps) parameters.num_inference_steps = options.numInferenceSteps;
  if (options?.guidanceScale) parameters.guidance_scale = options.guidanceScale;

  const body: Record<string, unknown> = { inputs: prompt };
  if (Object.keys(parameters).length > 0) {
    body.parameters = parameters;
  }

  let response: Response;
  try {
    response = await fetch(`${HF_INFERENCE_URL}${model.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "image/png",
        "x-wait-for-model": "true",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(options?.timeoutMs ?? 90_000),
    });
  } catch (error) {
    // Distinguish between timeout and network errors
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error(
        "Hugging Face API request timed out. The model may be loading — try again in a few moments."
      );
    }
    throw new Error(
      "Could not reach the Hugging Face API (network error). Check your internet connection and that router.huggingface.co is not blocked."
    );
  }

  const contentType = response.headers.get("content-type") ?? "";

  // Non-OK responses and JSON payloads (e.g. model loading errors) are errors
  if (!response.ok || contentType.includes("application/json")) {
    let message = `Hugging Face error (${response.status})`;

    try {
      // Try to parse as JSON to get detailed error info
      const errText = await response.text();
      try {
        const err = JSON.parse(errText) as {
          error?: string;
          message?: string;
          estimated_time?: number;
          wrappedError?: { error?: string; message?: string };
          provider?: string;
        };

        // Handle nested error structures
        const errorMsg = err.error ?? err.message ?? err.wrappedError?.error ?? err.wrappedError?.message;
        if (errorMsg) {
          message = errorMsg;
        }

        // Add provider info if available
        if (err.provider) {
          message += ` (provider: ${err.provider})`;
        }

        // Add model loading time if available
        if (typeof err.estimated_time === "number" && err.estimated_time > 0) {
          message += ` — model is loading (est. ${Math.ceil(err.estimated_time)}s). Try again shortly.`;
        }
      } catch {
        // Response is not JSON — use the raw text (first 200 chars)
        if (errText && errText.length > 0) {
          message += `: ${errText.slice(0, 200)}`;
        }
      }
    } catch {
      // Could not read response body — keep generic message
    }

    // Add helpful context for common errors
    if (response.status === 404) {
      message += ` — Model "${model.id}" may not be available on the HF Inference provider. Try a different model.`;
    } else if (response.status === 401 || response.status === 403) {
      message += " — Check that your HUGGING_FACE_API_KEY has 'Inference Providers' permission.";
    } else if (response.status === 503) {
      message += " — The model is currently loading. Try again in a few moments.";
    }

    throw new Error(message);
  }

  // Success — response should be raw image bytes
  const arrayBuffer = await response.arrayBuffer();

  if (arrayBuffer.byteLength === 0) {
    throw new Error("Hugging Face returned an empty response. The model may have failed to generate an image.");
  }

  return {
    imageBuffer: Buffer.from(arrayBuffer),
    contentType,
    model,
    inferenceMs: Date.now() - startedAt,
  };
}
