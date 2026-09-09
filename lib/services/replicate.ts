// Replicate image generation provider.
// Provides additional models beyond Hugging Face.
// Uses the Replicate API (https://replicate.com/docs).

// ── Types ──────────────────────────────────────────────────────────────────

export interface ReplicateModel {
  id: string;
  name: string;
  version: string;
  description: string;
  free: boolean;
  defaultWidth: number;
  defaultHeight: number;
}

export interface ReplicateGenerateResult {
  imageBuffer: Buffer;
  contentType: string;
  model: ReplicateModel;
  inferenceMs: number;
}

// ── Model catalog ──────────────────────────────────────────────────────────

export const replicateModels: ReplicateModel[] = [
  {
    id: "black-forest-labs/flux-schnell",
    name: "FLUX.1 Schnell",
    version: "latest",
    description: "Fast, high-quality text-to-image from Black Forest Labs.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "black-forest-labs/flux-dev",
    name: "FLUX.1 Dev",
    version: "latest",
    description: "Higher quality FLUX model with more detail.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "stability-ai/sdxl",
    name: "Stable Diffusion XL",
    version: "latest",
    description: "Stable Diffusion XL on Replicate.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "playgroundai/playground-v2.5-1024px-aesthetic",
    name: "Playground v2.5",
    version: "latest",
    description: "Aesthetic-optimized image generation.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
];

// ── Configuration ──────────────────────────────────────────────────────────

export function isReplicateConfigured(): boolean {
  const token = process.env.REPLICATE_API_TOKEN;
  return Boolean(token && token.length > 0 && token !== "your_replicate_api_token");
}

// ── Generate image via Replicate ───────────────────────────────────────────

export async function generateWithReplicate(
  prompt: string,
  modelId?: string,
  options?: {
    width?: number;
    height?: number;
    timeoutMs?: number;
  }
): Promise<ReplicateGenerateResult> {
  if (!isReplicateConfigured()) {
    throw new Error(
      "REPLICATE_API_TOKEN is not configured. Add it to .env.local (get a token at https://replicate.com/account/api-tokens)."
    );
  }

  const model =
    replicateModels.find((m) => m.id === modelId) ?? replicateModels[0];
  const apiToken = process.env.REPLICATE_API_TOKEN as string;
  const startedAt = Date.now();

  // Create a prediction
  const createResponse = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: model.version,
      input: {
        prompt,
        width: options?.width ?? model.defaultWidth,
        height: options?.height ?? model.defaultHeight,
      },
    }),
    signal: AbortSignal.timeout(options?.timeoutMs ?? 120_000),
  });

  if (!createResponse.ok) {
    const error = await createResponse.json().catch(() => ({}));
    throw new Error(
      `Replicate API error (${createResponse.status}): ${error.detail ?? "Unknown error"}`
    );
  }

  const prediction = (await createResponse.json()) as {
    id: string;
    status: string;
    urls?: { get?: string };
  };

  // Poll for completion
  const pollUrl = prediction.urls?.get;
  if (!pollUrl) {
    throw new Error("Replicate: no poll URL returned");
  }

  const maxAttempts = 60;
  const pollInterval = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));

    const pollResponse = await fetch(pollUrl, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });

    if (!pollResponse.ok) {
      throw new Error(`Replicate poll error (${pollResponse.status})`);
    }

    const status = (await pollResponse.json()) as {
      status: string;
      output?: string | string[];
      error?: string;
    };

    if (status.status === "succeeded") {
      // Get the image URL
      const output = Array.isArray(status.output)
        ? status.output[0]
        : status.output;

      if (!output || typeof output !== "string") {
        throw new Error("Replicate: no image URL in output");
      }

      // Download the image
      const imageResponse = await fetch(output);
      if (!imageResponse.ok) {
        throw new Error(`Replicate: failed to download image (${imageResponse.status})`);
      }

      const contentType = imageResponse.headers.get("content-type") ?? "image/png";
      const arrayBuffer = await imageResponse.arrayBuffer();

      return {
        imageBuffer: Buffer.from(arrayBuffer),
        contentType,
        model,
        inferenceMs: Date.now() - startedAt,
      };
    }

    if (status.status === "failed" || status.status === "canceled") {
      throw new Error(
        `Replicate prediction ${status.status}: ${status.error ?? "Unknown error"}`
      );
    }

    // Still processing, continue polling
  }

  throw new Error("Replicate: prediction timed out");
}
