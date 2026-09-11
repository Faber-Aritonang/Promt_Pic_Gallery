// POST /api/chat — send a message to Anthropic Claude for prompt refinement.
// Supports both streaming (SSE) and non-streaming responses.
//
// Request body:
//   { messages: [{ role, content }], templateId?: string, stream?: boolean }
//
// Streaming response: text/event-stream with SSE chunks
// Non-streaming response: JSON ApiResponse<{ content, usage }>

import {
  chatCompletion,
  chatCompletionStream,
  buildRefinementMessages,
  getModel,
  type LLMMessage,
} from "@/lib/services/llm";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import type { ApiResponse } from "@/lib/types";

// Route segment config.
// This handler streams an LLM completion, so on Vercel it must run on the
// Node.js runtime and be allowed more than the platform's default function
// duration — when an invocation is cut off the caller receives an empty error
// response (which surfaces as "Unexpected end of JSON input" in the client).
export const runtime = "nodejs";
export const maxDuration = 60;
// The GET handler below reads runtime environment state, so it must never be
// prerendered at build time.
export const dynamic = "force-dynamic";

// ── Request types ──────────────────────────────────────────────────────────

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  templateId?: string;
  stream?: boolean;
}

// ── GET handler: self-diagnostic ───────────────────────────────────────────
// Open this route in a browser to see exactly what the deployed server sees.
// `?ping=1` also makes a live call to the Anthropic API so network/egress and
// API-key problems show up directly in the response.

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const apiKey = process.env.ANTHROPIC_API_KEY ?? "";

  const diagnostics: Record<string, unknown> = {
    route: "/api/chat",
    vercelEnv: process.env.VERCEL_ENV ?? null,
    vercelRegion: process.env.VERCEL_REGION ?? null,
    node: process.version,
    model: getModel(),
    anthropicKey: {
      present: apiKey.length > 0,
      length: apiKey.length,
      prefix: apiKey.slice(0, 16),
      suffix: apiKey.slice(-4),
    },
    firebaseServiceAccount: Boolean(process.env.FIREBASE_SERVICE_ACCOUNT),
  };

  if (url.searchParams.has("probe")) {
    // Re-runs the code paths of the routes that fail on the deployed app
    // (/api/templates, /gallery/[id]) from a function we know is alive, so the
    // real error is visible without dashboard access.
    const describe = (error: unknown): string =>
      error instanceof Error ? `${error.name}: ${error.message}` : String(error);

    const probe: Record<string, string> = {};

    for (const mod of ["firebase-admin/app", "firebase-admin/firestore"]) {
      try {
        await import(/* webpackIgnore: true */ mod);
        probe[mod] = "loaded";
      } catch (error) {
        probe[mod] = describe(error);
      }
    }

    try {
      const { getAdminDb } = await import("@/lib/firebase-admin");
      const startedAt = Date.now();
      getAdminDb();
      probe.getAdminDb = `ok in ${Date.now() - startedAt}ms`;
    } catch (error) {
      probe.getAdminDb = describe(error);
    }

    try {
      const { listTemplates } = await import("@/lib/services/templates");
      const startedAt = Date.now();
      const result = await Promise.race([
        listTemplates({ limit: 1 }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timed out after 5000ms")), 5000)
        ),
      ]);
      probe.listTemplates = `ok in ${Date.now() - startedAt}ms, total=${
        (result as { total: number }).total
      }`;
    } catch (error) {
      probe.listTemplates = describe(error);
    }

    diagnostics.probe = probe;
  }

  if (url.searchParams.has("ping")) {
    try {
      const startedAt = Date.now();
      const response = await fetch("https://api.anthropic.com/v1/models", {
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: AbortSignal.timeout(15_000),
      });
      diagnostics.anthropic = {
        status: response.status,
        ms: Date.now() - startedAt,
        body: (await response.text()).slice(0, 300),
      };
    } catch (error) {
      diagnostics.anthropic = {
        error: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      };
    }
  }

  return Response.json(diagnostics, {
    headers: { "Cache-Control": "no-store" },
  });
}

// ── POST handler ───────────────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    // Rate limit — kept inside the try so an unexpected failure here still
    // returns a JSON error body instead of an empty 500 response (an empty
    // body is unparseable for clients and hides the real cause).
    const rateLimitError = enforceRateLimit(request, RATE_LIMITS.chat);
    if (rateLimitError) return rateLimitError;

    const body = (await request.json()) as ChatRequestBody;

    // Validate
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json(
        { success: false, error: "messages array is required and must not be empty" } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Get template context if provided
    let templateContext: {
      title: string;
      original_prompt: string;
      description: string;
      style_tips?: string;
    } | undefined;

    if (body.templateId) {
      // Imported lazily on purpose: the templates service pulls in
      // firebase-admin (a large server-only SDK). Keeping it out of the
      // module-init graph means a Firestore/credential problem can only cost
      // the template context, never the chat request itself.
      try {
        const { getTemplateById } = await import("@/lib/services/templates");
        const template = await getTemplateById(body.templateId);
        if (template) {
          templateContext = {
            title: template.title,
            original_prompt: template.original_prompt,
            description: template.description,
            style_tips: template.style_tips,
          };
        }
      } catch (error) {
        console.warn("[/api/chat] template context unavailable:", error);
      }
    }

    // Build messages with system prompt
    const messages: LLMMessage[] = buildRefinementMessages(
      body.messages,
      templateContext
    );

    // ── Streaming response ───────────────────────────────────────────────
    if (body.stream) {
      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of chatCompletionStream({ messages })) {
              const sseData = `data: ${JSON.stringify({ content: chunk })}\n\n`;
              controller.enqueue(encoder.encode(sseData));
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          } catch (error) {
            const errMsg = error instanceof Error ? error.message : "Stream error";
            const sseData = `data: ${JSON.stringify({ error: errMsg })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          } finally {
            controller.close();
          }
        },
      });

      // No `Connection` header: it is hop-by-hop and managed by the platform.
      // Setting it from a serverless function can break the streamed response.
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
        },
      });
    }

    // ── Non-streaming response ───────────────────────────────────────────
    const result = await chatCompletion({ messages });

    const content = result.content
      ?.filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("");
    if (!content) {
      return Response.json(
        { success: false, error: "No response from LLM API" } satisfies ApiResponse,
        { status: 502 }
      );
    }

    const data = {
      content,
      usage: result.usage,
      model: result.model,
    };

    return Response.json({ success: true, data } satisfies ApiResponse);
  } catch (error) {
    console.error("[/api/chat] Error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    // Distinguish between config errors and runtime errors
    const status = message.includes("not configured") ? 503 : 500;

    return Response.json(
      { success: false, error: message } satisfies ApiResponse,
      { status }
    );
  }
}
