// Replicate image generation provider.
// Provides additional models beyond Hugging Face.
// Uses the Replicate API (https://replicate.com/docs).

// ── Types ──────────────────────────────────────────────────────────────────

export interface ReplicateModel {
  id: string; // format: "owner/model-name"
  /**
   * Pinned model version hash used to create predictions.
   *
   * Predictions are created against `/v1/predictions` with an explicit
   * `version` instead of `/v1/models/{owner}/{name}/predictions`:
   * the model-name endpoint answers 404 "The requested resource could not be
   * found." for models that have no default version wired up for the API
   * (e.g. `playgroundai/playground-v2.5-1024px-aesthetic`), even though the
   * model itself is public and the pinned version runs fine. Pinning also
   * keeps output stable when an owner publishes a new version.
   */
  version: string;
  name: string;
  description: string;
  free: boolean;
  defaultWidth: number;
  defaultHeight: number;
  /**
   * Whether this model currently answers the Replicate API for our account
   * (false = hidden from the UI). Models are kept in the catalog so the
   * reason stays documented.
   */
  available?: boolean;
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
    version: "c846a69991daf4c0e5d016514849d14ee5b2e6846ce6b9d6f21369e564cfe51e",
    name: "FLUX.1 Schnell",
    description: "Fast, high-quality text-to-image from Black Forest Labs.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  // Hidden: both creation endpoints (the model path and the pinned version)
  // hang without a response for this account — Replicate never returns an
  // HTTP status, so the request only fails on our own timeout. Kept in the
  // catalog as documentation; flip `available` back to true once Replicate
  // accepts it again.
  {
    id: "black-forest-labs/flux-dev",
    version: "6e4a938f85952bdabcc15aa329178c4d681c52bf25a0342403287dc26944661d",
    name: "FLUX.1 Dev",
    description: "Higher quality FLUX model with more detail.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
    available: false,
  },
  {
    id: "stability-ai/sdxl",
    version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    name: "Stable Diffusion XL",
    description: "Stable Diffusion XL on Replicate.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
  {
    id: "playgroundai/playground-v2.5-1024px-aesthetic",
    version: "a45f82a1382bed5c7aeb861dac7c7d191b0fdf74d8d57c4a0e6ed7d4d0bf7d24",
    name: "Playground v2.5",
    description: "Aesthetic-optimized image generation.",
    free: false,
    defaultWidth: 1024,
    defaultHeight: 1024,
  },
];

// ── Configuration ──────────────────────────────────────────────────────────

// Kept below the /api/generate route's `maxDuration` (60s) so that a slow
// prediction produces a readable JSON error rather than the platform cutting
// the invocation off (which reaches the browser as an empty response body).
const POLL_TIMEOUT_MS = 45_000;
const POLL_INTERVAL_MS = 1_500;
// Replicate intermittently answers 429/5xx while a prediction runs; do not
// throw away a finished prediction because of a single bad poll.
const MAX_TRANSIENT_POLL_FAILURES = 5;
// Creating predictions is also throttled (accounts under $5 credit get
// 6 requests/minute with a burst of 1), so retry the create call as well.
// Keep this small: creation is retried before polling, and the whole request
// has to fit inside the route's `maxDuration`.
const MAX_CREATE_ATTEMPTS = 2;
const CREATE_TIMEOUT_MS = 12_000;

export function isReplicateConfigured(): boolean {
  const token = process.env.REPLICATE_API_TOKEN;
  return Boolean(token && token.length > 0 && token !== "your_replicate_api_token");
}

// ── Create a prediction ───────────────────────────────────────────────────

/**
 * POST a prediction-creation body, retrying once on transient failures.
 * Returns the raw response (even for 4xx) so the caller can decide whether a
 * fallback endpoint makes sense.
 */
async function postPrediction(
  apiToken: string,
  url: string,
  body: unknown,
  timeoutMs: number
): Promise<Response> {
  let lastError = "";

  for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt++) {
    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (error) {
      lastError =
        error instanceof Error && error.name === "TimeoutError"
          ? `no answer within ${Math.round(timeoutMs / 1000)}s`
          : error instanceof Error
            ? error.message
            : String(error);
      continue;
    }

    if (response.ok) return response;

    // Throttling / server-side hiccups clear on their own — wait and retry.
    if (
      (response.status === 429 || response.status >= 500) &&
      attempt < MAX_CREATE_ATTEMPTS - 1
    ) {
      const error = (await response.json().catch(() => ({}))) as {
        retry_after?: number;
      };
      const waitMs = Math.min(
        typeof error.retry_after === "number" ? error.retry_after * 1_000 : 2_000,
        10_000
      );
      await new Promise((resolve) => setTimeout(resolve, waitMs));
      continue;
    }

    return response;
  }

  throw new Error(
    `Replicate did not accept the request (${lastError}). The model may be ` +
      "unavailable right now — pick another model from the dropdown, or press Generate again."
  );
}

/** Turn a non-OK create response into a readable, actionable error. */
async function throwCreateError(
  response: Response,
  model: ReplicateModel
): Promise<never> {
  const error = (await response.json().catch(() => ({}))) as { detail?: string };
  let message = `Replicate API error (${response.status}): ${
    error.detail ?? "Unknown error"
  }`;
  if (response.status === 401) {
    message +=
      " — your REPLICATE_API_TOKEN was rejected. Generate a fresh token at " +
      "https://replicate.com/account/api-tokens, update .env.local, and restart the server.";
  } else if (response.status === 402) {
    message +=
      " — add credit or activate the free trial at https://replicate.com/account/billing.";
  } else if (response.status === 404) {
    message += ` — "${model.name}" cannot be run through the Replicate API right now. Pick another model from the dropdown.`;
  } else if (response.status === 429) {
    message +=
      " — Replicate is throttling this account (rate limits are tight below $5 credit). Wait a few seconds and press Generate again.";
  }
  throw new Error(message);
}

/**
 * Create a prediction for `model`.
 *
 * Two Replicate endpoints can create a prediction:
 *   - POST /v1/models/{owner}/{name}/predictions  (owner's default version)
 *   - POST /v1/predictions  { version, input }    (explicit version hash)
 *
 * Use the first, and fall back to the pinned version when it answers 404.
 * Some public models (e.g. `playgroundai/playground-v2.5-1024px-aesthetic`)
 * have no default version exposed to the API, so the model endpoint returns
 * "The requested resource could not be found." while the pinned version runs
 * normally. The reverse also happens: an owner's `latest_version` hash can be
 * unrunnable while the model endpoint works, so neither route is used alone.
 */
async function createPrediction(
  apiToken: string,
  model: ReplicateModel,
  prompt: string,
  options?: { width?: number; height?: number; timeoutMs?: number }
): Promise<Response> {
  const input = {
    prompt,
    width: options?.width ?? model.defaultWidth,
    height: options?.height ?? model.defaultHeight,
  };
  const timeoutMs = options?.timeoutMs ?? CREATE_TIMEOUT_MS;

  const viaModel = await postPrediction(
    apiToken,
    `https://api.replicate.com/v1/models/${model.id}/predictions`,
    { input },
    timeoutMs
  );
  if (viaModel.status !== 404) {
    if (!viaModel.ok) await throwCreateError(viaModel, model);
    return viaModel;
  }

  const viaVersion = await postPrediction(
    apiToken,
    "https://api.replicate.com/v1/predictions",
    { version: model.version, input },
    timeoutMs
  );
  if (!viaVersion.ok) await throwCreateError(viaVersion, model);
  return viaVersion;
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
    replicateModels.find(
      (m) => m.id === modelId && m.available !== false
    ) ??
    replicateModels.find((m) => m.available !== false) ??
    replicateModels[0];
  const apiToken = process.env.REPLICATE_API_TOKEN as string;
  const startedAt = Date.now();

  const createResponse = await createPrediction(apiToken, model, prompt, options);

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

  // Budget the *whole* call (create + fallback + polling) against
  // POLL_TIMEOUT_MS, so a slow create cannot push us past maxDuration.
  const deadline = startedAt + POLL_TIMEOUT_MS;
  let transientFailures = 0;
  let lastTransientError = "";

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    let pollResponse: Response;
    try {
      pollResponse = await fetch(pollUrl, {
        headers: { Authorization: `Bearer ${apiToken}` },
        signal: AbortSignal.timeout(10_000),
      });
    } catch (error) {
      // Network hiccup while polling — retry until the deadline.
      transientFailures++;
      lastTransientError = error instanceof Error ? error.message : String(error);
      if (transientFailures > MAX_TRANSIENT_POLL_FAILURES) {
        throw new Error(`Replicate poll failed repeatedly: ${lastTransientError}`);
      }
      continue;
    }

    if (!pollResponse.ok) {
      // 429/5xx are usually transient; a 4xx means the request itself is wrong.
      if (pollResponse.status >= 500 || pollResponse.status === 429) {
        transientFailures++;
        lastTransientError = `HTTP ${pollResponse.status}`;
        if (transientFailures > MAX_TRANSIENT_POLL_FAILURES) {
          throw new Error(
            `Replicate is unavailable right now (HTTP ${pollResponse.status} on ${transientFailures} consecutive polls). Try again in a moment.`
          );
        }
        continue;
      }
      throw new Error(`Replicate poll error (${pollResponse.status})`);
    }
    transientFailures = 0;

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

  throw new Error(
    `Replicate did not finish within ${Math.round(
      POLL_TIMEOUT_MS / 1000
    )}s. Press Generate again to keep going.`
  );
}
