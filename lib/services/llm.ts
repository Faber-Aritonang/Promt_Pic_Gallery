// LLM chat service — Anthropic Claude Messages API
// Claude Haiku is used as the default low-latency model.
// API docs: https://docs.anthropic.com/en/api/messages
//
// Pricing (Claude Haiku 4.5):
//   Input:  $1 per million tokens
//   Output: $5 per million tokens

// ── Types ──────────────────────────────────────────────────────────────────

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMChatRequest {
  messages: LLMMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface LLMChatResponse {
  id: string;
  model: string;
  content: { type: "text"; text: string }[];
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

// ── Configuration ──────────────────────────────────────────────────────────

// Hard ceiling for the outbound call. On serverless platforms a request that
// never gets an answer is killed by the platform, which hands the browser an
// empty error response; failing fast here instead produces a readable message.
const REQUEST_TIMEOUT_MS = 45_000;

function getApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key === "your_anthropic_api_key") {
    throw new Error(
      "ANTHROPIC_API_KEY is not configured. Set it in .env.local (get a key at https://console.anthropic.com/)."
    );
  }
  return key;
}

export function getModel(): string {
  return process.env.LLM_MODEL || "claude-haiku-4-5";
}

// ── System Prompt ──────────────────────────────────────────────────────────

export const PROMPT_REFINEMENT_SYSTEM_PROMPT = `You are an expert prompt engineer specializing in text-to-image AI generation. Your role is to help users refine and improve their image generation prompts.

## Your Expertise
- Understanding how different AI image generators (DALL·E, Stable Diffusion, Flux, Midjourney) interpret prompts
- Knowing which descriptive words, styles, and parameters produce the best results
- Breaking down complex visual concepts into effective prompt language
- Balancing detail with clarity — avoiding prompt bloat while maintaining specificity

## How You Help
1. **Analyze** the user's current prompt and identify strengths and areas for improvement
2. **Suggest** specific, actionable improvements (not vague advice)
3. **Provide** the refined prompt after each round of feedback
4. **Explain** WHY each change helps the image generator produce better results
5. **Track** the prompt's evolution — always show the current best version

## Response Format
For each turn, respond with:
1. A brief analysis of what works and what could improve
2. Your suggested improvements (be specific — show the exact words to add/change)
3. The complete refined prompt in a code block for easy copying
4. A note on what to expect from the improved version

## Guidelines
- Be conversational but focused — this is a collaborative refinement process
- Suggest 1-3 specific improvements per turn (don't overwhelm)
- Always preserve the user's creative intent while enhancing technical quality
- Consider: subject, style, composition, lighting, mood, medium, and technical parameters
- If the prompt is already excellent, say so and suggest fine-tuning rather than major changes`;

// ── Transport ──────────────────────────────────────────────────────────────

/**
 * POST a Messages API body. Network-level failures (DNS, blocked egress,
 * TLS, timeout) are rethrown with the underlying cause spelled out, because
 * "fetch failed" all by itself is impossible to debug from the browser.
 */
async function anthropicFetch(
  body: Record<string, unknown>,
  apiKey: string
): Promise<Response> {
  try {
    return await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const detail = error instanceof Error ? error.message : String(error);

    if (name === "TimeoutError") {
      throw new Error(
        `Anthropic API request timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`
      );
    }

    throw new Error(`Could not reach the Anthropic API (${detail}).`);
  }
}

// ── Non-streaming call ─────────────────────────────────────────────────────

export async function chatCompletion(
  request: LLMChatRequest
): Promise<LLMChatResponse> {
  const apiKey = getApiKey();
  const model = request.model || getModel();

  // Separate system message from conversation
  const systemMsg = request.messages.find((m) => m.role === "system");
  const conversationMsgs = request.messages.filter((m) => m.role !== "system");

  const body: Record<string, unknown> = {
    model,
    max_tokens: request.max_tokens ?? 2048,
    messages: conversationMsgs,
  };

  if (systemMsg) {
    body.system = systemMsg.content;
  }

  if (request.temperature !== undefined) {
    body.temperature = request.temperature;
  }

  const response = await anthropicFetch(body, apiKey);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Anthropic API error (${response.status}): ${errorText.slice(0, 500)}`
    );
  }

  const data = await response.json();

  return {
    id: data.id,
    model: data.model,
    content: data.content,
    usage: data.usage,
  };
}

// ── Streaming call ─────────────────────────────────────────────────────────

/**
 * Send a chat completion request and yield content chunks as they arrive.
 * Uses Server-Sent Events (SSE) format.
 */
export async function* chatCompletionStream(
  request: LLMChatRequest
): AsyncGenerator<string, void, unknown> {
  const apiKey = getApiKey();
  const model = request.model || getModel();

  // Separate system message from conversation
  const systemMsg = request.messages.find((m) => m.role === "system");
  const conversationMsgs = request.messages.filter((m) => m.role !== "system");

  const body: Record<string, unknown> = {
    model,
    max_tokens: request.max_tokens ?? 2048,
    messages: conversationMsgs,
    stream: true,
  };

  if (systemMsg) {
    body.system = systemMsg.content;
  }

  if (request.temperature !== undefined) {
    body.temperature = request.temperature;
  }

  const response = await anthropicFetch(body, apiKey);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Anthropic API error (${response.status}): ${errorText.slice(0, 500)}`
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE lines
      const lines = buffer.split("\n");
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data:")) continue;

        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") return;

        try {
          const chunk = JSON.parse(data);
          // Anthropic streaming: content_block_delta events
          if (chunk.type === "content_block_delta") {
            const text = chunk.delta?.text;
            if (text) {
              yield text;
            }
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Build a messages array for a prompt refinement conversation.
 * Includes the system prompt, conversation history, and optional template context.
 */
export function buildRefinementMessages(
  history: { role: "user" | "assistant"; content: string }[],
  templateContext?: {
    title: string;
    original_prompt: string;
    description: string;
    style_tips?: string;
  }
): LLMMessage[] {
  const messages: LLMMessage[] = [];

  // System prompt with optional template context
  let systemContent = PROMPT_REFINEMENT_SYSTEM_PROMPT;

  if (templateContext) {
    systemContent += `\n\n## Current Template Context
- **Template:** ${templateContext.title}
- **Original Prompt:** ${templateContext.original_prompt}
- **Description:** ${templateContext.description}`;
    if (templateContext.style_tips) {
      systemContent += `\n- **Style Tips:** ${templateContext.style_tips}`;
    }
  }

  messages.push({ role: "system", content: systemContent });

  // Conversation history
  for (const msg of history) {
    messages.push({ role: msg.role, content: msg.content });
  }

  return messages;
}
