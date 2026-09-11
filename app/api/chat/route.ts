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
  type LLMMessage,
} from "@/lib/services/llm";
import { getTemplateById } from "@/lib/services/templates";
import { enforceRateLimit, RATE_LIMITS } from "@/lib/utils/rate-limit";
import type { ApiResponse } from "@/lib/types";

// Route segment config.
// This handler streams an LLM completion, so on Vercel it must run on the
// Node.js runtime and be allowed more than the platform's default function
// duration — when an invocation is cut off the caller receives an empty error
// response (which surfaces as "Unexpected end of JSON input" in the client).
export const runtime = "nodejs";
export const maxDuration = 60;

// ── Request types ──────────────────────────────────────────────────────────

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  templateId?: string;
  stream?: boolean;
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
      const template = await getTemplateById(body.templateId);
      if (template) {
        templateContext = {
          title: template.title,
          original_prompt: template.original_prompt,
          description: template.description,
          style_tips: template.style_tips,
        };
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
