// GLM chat service — communicates with Zhipu AI's OpenAI-compatible API
// for prompt refinement conversations.
//
// API docs: https://docs.z.ai/api-reference/llm/chat-completion
// Uses the OpenAI-compatible v4 endpoint.

// ── Types ──────────────────────────────────────────────────────────────────

export interface GLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GLMChatRequest {
  messages: GLMMessage[];
  /** Model to use (default: from env GLM_MODEL or glm-4.5-flash) */
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface GLMChatResponse {
  id: string;
  model: string;
  choices: {
    index: number;
    message: {
      role: "assistant";
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface GLMStreamChunk {
  id: string;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: "assistant";
      content?: string;
    };
    finish_reason: string | null;
  }[];
}

// ── Configuration ──────────────────────────────────────────────────────────

function getApiKey(): string {
  const key = process.env.GLM_API_KEY;
  if (!key || key === "your_glm_api_key") {
    throw new Error(
      "GLM_API_KEY is not configured. Set it in .env.local (get a key at https://open.bigmodel.cn/)."
    );
  }
  return key;
}

function getEndpoint(): string {
  return (
    process.env.GLM_API_ENDPOINT ||
    "https://open.bigmodel.cn/api/paas/v4/chat/completions"
  );
}

function getModel(): string {
  return process.env.GLM_MODEL || "glm-4.5-flash";
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

// ── Non-streaming call ─────────────────────────────────────────────────────

export async function chatCompletion(
  request: GLMChatRequest
): Promise<GLMChatResponse> {
  const apiKey = getApiKey();
  const endpoint = getEndpoint();

  const body = {
    model: request.model || getModel(),
    messages: request.messages,
    temperature: request.temperature ?? 0.7,
    max_tokens: request.max_tokens ?? 2048,
    stream: false,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GLM API error (${response.status}): ${errorText.slice(0, 500)}`
    );
  }

  return response.json() as Promise<GLMChatResponse>;
}

// ── Streaming call ─────────────────────────────────────────────────────────

/**
 * Send a chat completion request and yield content chunks as they arrive.
 * Uses Server-Sent Events (SSE) format.
 */
export async function* chatCompletionStream(
  request: GLMChatRequest
): AsyncGenerator<string, void, unknown> {
  const apiKey = getApiKey();
  const endpoint = getEndpoint();

  const body = {
    model: request.model || getModel(),
    messages: request.messages,
    temperature: request.temperature ?? 0.7,
    max_tokens: request.max_tokens ?? 2048,
    stream: true,
  };

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `GLM API error (${response.status}): ${errorText.slice(0, 500)}`
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
          const chunk = JSON.parse(data) as GLMStreamChunk;
          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            yield content;
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
): GLMMessage[] {
  const messages: GLMMessage[] = [];

  // System prompt with optional template context
  let systemContent = PROMPT_REFINEMENT_SYSTEM_PROMPT;

  if (templateContext) {
    systemContent += `\n\n## Current Template Context\n- **Template:** ${templateContext.title}\n- **Original Prompt:** ${templateContext.original_prompt}\n- **Description:** ${templateContext.description}`;
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
