import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildRefinementMessages,
  PROMPT_REFINEMENT_SYSTEM_PROMPT,
  chatCompletion,
  chatCompletionStream,
  getModel,
} from "@/lib/services/llm";

// Mock fetch globally for API call tests
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock process.env
const originalEnv = process.env;

beforeEach(() => {
  process.env = { ...originalEnv };
  mockFetch.mockReset();
});

describe("getModel", () => {
  it("returns default model when LLM_MODEL is not set", () => {
    delete process.env.LLM_MODEL;
    expect(getModel()).toBe("claude-haiku-4-5-20250501");
  });

  it("returns custom model when LLM_MODEL is set", () => {
    process.env.LLM_MODEL = "claude-opus-4-5-20250501";
    expect(getModel()).toBe("claude-opus-4-5-20250501");
  });
});

describe("chatCompletion - API error handling", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key";
  });

  it("throws error when API returns 401 unauthorized", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: vi.fn().mockResolvedValue("Invalid API key"),
    });

    await expect(
      chatCompletion({
        messages: [{ role: "user" as const, content: "Hello" }],
      })
    ).rejects.toThrow("Anthropic API error (401)");
  });

  it("throws error when API returns 403 forbidden", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: vi.fn().mockResolvedValue("Access denied"),
    });

    await expect(
      chatCompletion({
        messages: [{ role: "user" as const, content: "Hello" }],
      })
    ).rejects.toThrow("Anthropic API error (403)");
  });

  it("throws error when API returns 429 rate limited", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      text: vi.fn().mockResolvedValue("Rate limit exceeded"),
    });

    await expect(
      chatCompletion({
        messages: [{ role: "user" as const, content: "Hello" }],
      })
    ).rejects.toThrow("Anthropic API error (429)");
  });

  it("throws error when API returns 500 server error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue("Internal server error"),
    });

    await expect(
      chatCompletion({
        messages: [{ role: "user" as const, content: "Hello" }],
      })
    ).rejects.toThrow("Anthropic API error (500)");
  });

  it("includes error message in thrown error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: vi.fn().mockResolvedValue("Invalid request body"),
    });

    await expect(
      chatCompletion({
        messages: [{ role: "user" as const, content: "Hello" }],
      })
    ).rejects.toThrow("Invalid request body");
  });
});

describe("chatCompletion - successful response", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key";
  });

  it("returns parsed response data on success", async () => {
    const mockResponse = {
      id: "msg_123",
      model: "claude-haiku-4-5-20250501",
      content: [{ type: "text" as const, text: "Hello! How can I help?" }],
      usage: {
        input_tokens: 10,
        output_tokens: 20,
      },
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockResponse),
    });

    const result = await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    expect(result).toEqual(mockResponse);
  });

  it("uses default model when not specified", async () => {
    delete process.env.LLM_MODEL;
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "claude-haiku-4-5-20250501", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-api-key": "test-key",
          "anthropic-version": "2023-06-01",
        }),
      })
    );
  });

  it("uses custom model when specified", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "claude-opus-4-5-20250501", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
      model: "claude-opus-4-5-20250501",
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        body: expect.stringContaining("claude-opus-4-5-20250501"),
      })
    );
  });

  it("includes system message when present", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "test", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [
        { role: "system" as const, content: "You are helpful" },
        { role: "user" as const, content: "Hello" },
      ],
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        body: expect.stringContaining("You are helpful"),
      })
    );
  });

  it("separates system message from conversation", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "test", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [
        { role: "system" as const, content: "System prompt" },
        { role: "user" as const, content: "User message" },
        { role: "assistant" as const, content: "Assistant response" },
        { role: "user" as const, content: "Another user message" },
      ],
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.messages).toHaveLength(3); // user, assistant, user (no system)
    expect(callBody.messages[0].role).toBe("user");
    expect(callBody.messages[0].content).toBe("User message");
  });

  it("uses default max_tokens when not specified", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "test", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.max_tokens).toBe(2048);
  });

  it("uses custom max_tokens when specified", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "test", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
      max_tokens: 1000,
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.max_tokens).toBe(1000);
  });

  it("includes temperature when specified", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "test", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
      temperature: 0.7,
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody.temperature).toBe(0.7);
  });

  it("does not include temperature when not specified", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "test", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(callBody).not.toHaveProperty("temperature");
  });

  it("includes correct headers", async () => {
    process.env.ANTHROPIC_API_KEY = "test-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ id: "msg_123", model: "test", content: [], usage: {} }),
    });

    await chatCompletion({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "x-api-key": "test-key",
          "anthropic-version": "2023-06-01",
        }),
      })
    );
  });
});

describe("chatCompletion - missing API key", () => {
  it("throws error when ANTHROPIC_API_KEY is not set", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    await expect(
      chatCompletion({
        messages: [{ role: "user" as const, content: "Hello" }],
      })
    ).rejects.toThrow("ANTHROPIC_API_KEY is not configured");
  });

  it("throws error when ANTHROPIC_API_KEY is placeholder", async () => {
    process.env.ANTHROPIC_API_KEY = "your_anthropic_api_key";

    await expect(
      chatCompletion({
        messages: [{ role: "user" as const, content: "Hello" }],
      })
    ).rejects.toThrow("ANTHROPIC_API_KEY is not configured");
  });
});

describe("chatCompletionStream - streaming response", () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = "test-key";
  });

  it("yields text chunks from streaming response", async () => {
    // Mock a streaming response with SSE format
    const chunks: string[] = [];
    let readCount = 0;
    
    const streamReader = {
      read: vi.fn().mockImplementation(async () => {
        readCount++;
        if (readCount === 1) {
          return {
            done: false,
            value: new TextEncoder().encode("data: {\"type\":\"content_block_delta\",\"delta\":{\"text\":\"Hello\"}}\n"),
          };
        }
        if (readCount === 2) {
          return {
            done: false,
            value: new TextEncoder().encode("data: {\"type\":\"content_block_delta\",\"delta\":{\"text\":\" World\"}}\n"),
          };
        }
        return { done: true, value: undefined };
      }),
      releaseLock: vi.fn(),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        getReader: vi.fn().mockReturnValue(streamReader),
      },
    });

    const stream = chatCompletionStream({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Hello", " World"]);
  });

  it("stops when [DONE] is received", async () => {
    const streamReader = {
      read: vi.fn().mockResolvedValueOnce({
        done: false,
        value: new TextEncoder().encode("data: [DONE]\n"),
      }),
      releaseLock: vi.fn(),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        getReader: vi.fn().mockReturnValue(streamReader),
      },
    });

    const chunks: string[] = [];
    const stream = chatCompletionStream({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([]);
  });

  it("skips malformed JSON chunks", async () => {
    let callCount = 0;
    const streamReader = {
      read: vi.fn().mockImplementation(async () => {
        callCount++;
        if (callCount === 1) {
          return {
            done: false,
            value: new TextEncoder().encode("data: {invalid json}\n"),
          };
        }
        if (callCount === 2) {
          return {
            done: false,
            value: new TextEncoder().encode("data: {\"type\":\"content_block_delta\",\"delta\":{\"text\":\"Valid\"}}\n"),
          };
        }
        return { done: true, value: undefined };
      }),
      releaseLock: vi.fn(),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        getReader: vi.fn().mockReturnValue(streamReader),
      },
    });

    const chunks: string[] = [];
    const stream = chatCompletionStream({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Valid"]);
  });

  it("skips non-content_block_delta chunks", async () => {
    let readIndex = 0;
    const responses = [
      { done: false, value: new TextEncoder().encode("data: {\"type\":\"message_start\",\"message\":{}}\n") },
      { done: false, value: new TextEncoder().encode("data: {\"type\":\"content_block_delta\",\"delta\":{\"text\":\"Text\"}}\n") },
      { done: false, value: new TextEncoder().encode("data: {\"type\":\"content_block_stop\",\"delta\":{}}\n") },
      { done: true, value: undefined },
    ];

    const streamReader = {
      read: vi.fn().mockImplementation(async () => {
        const resp = responses[readIndex++];
        return resp;
      }),
      releaseLock: vi.fn(),
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: {
        getReader: vi.fn().mockReturnValue(streamReader),
      },
    });

    const chunks: string[] = [];
    const stream = chatCompletionStream({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(["Text"]);
  });

  it("throws error when response body is not readable", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      body: null as unknown as ReadableStream | null,
    });

    const stream = chatCompletionStream({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    await expect(stream.next()).rejects.toThrow("Response body is not readable");
  });

  it("throws error on API failure during streaming", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: vi.fn().mockResolvedValue("Server error"),
    });

    const stream = chatCompletionStream({
      messages: [{ role: "user" as const, content: "Hello" }],
    });

    await expect(stream.next()).rejects.toThrow("Anthropic API error (500)");
  });
});

describe("buildRefinementMessages", () => {
  it("includes the system prompt as the first message", () => {
    const messages = buildRefinementMessages([]);
    expect(messages.length).toBe(1);
    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toBe(PROMPT_REFINEMENT_SYSTEM_PROMPT);
  });

  it("includes conversation history after system prompt", () => {
    const history = [
      { role: "user" as const, content: "Make it more detailed" },
      { role: "assistant" as const, content: "Here's the improved prompt..." },
    ];
    const messages = buildRefinementMessages(history);
    expect(messages.length).toBe(3);
    expect(messages[1]).toEqual({
      role: "user",
      content: "Make it more detailed",
    });
    expect(messages[2]).toEqual({
      role: "assistant",
      content: "Here's the improved prompt...",
    });
  });

  it("appends template context to the system prompt", () => {
    const templateContext = {
      title: "Cyberpunk City",
      original_prompt: "A cyberpunk city at night",
      description: "A moody cyberpunk scene",
      style_tips: "Use neon colors",
    };
    const messages = buildRefinementMessages([], templateContext);
    expect(messages[0].role).toBe("system");
    expect(messages[0].content).toContain("Current Template Context");
    expect(messages[0].content).toContain("Cyberpunk City");
    expect(messages[0].content).toContain("A cyberpunk city at night");
    expect(messages[0].content).toContain("Use neon colors");
  });

  it("includes style_tips when provided", () => {
    const contextWithTips = {
      title: "Test",
      original_prompt: "test prompt",
      description: "test desc",
      style_tips: "Important tip",
    };
    const messages = buildRefinementMessages([], contextWithTips);
    expect(messages[0].content).toContain("Important tip");
  });

  it("excludes style_tips when not provided", () => {
    const contextWithoutTips = {
      title: "Test",
      original_prompt: "test prompt",
      description: "test desc",
    };
    const messages = buildRefinementMessages([], contextWithoutTips);
    expect(messages[0].content).not.toContain("Style Tips:");
  });

  it("handles empty history", () => {
    const messages = buildRefinementMessages([]);
    expect(messages.length).toBe(1); // Only system prompt
  });

  it("handles long conversation history", () => {
    const history = Array.from({ length: 10 }, (_, i) => ({
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `Message ${i + 1}`,
    }));
    const messages = buildRefinementMessages(history);
    expect(messages.length).toBe(11); // system + 10 messages
  });
});

describe("PROMPT_REFINEMENT_SYSTEM_PROMPT", () => {
  it("contains key sections", () => {
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT).toContain("Your Expertise");
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT).toContain("How You Help");
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT).toContain("Response Format");
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT).toContain("Guidelines");
  });

  it("mentions specific image generators", () => {
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT).toContain("DALL·E");
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT).toContain("Stable Diffusion");
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT).toContain("Midjourney");
  });

  it("is a non-empty string", () => {
    expect(typeof PROMPT_REFINEMENT_SYSTEM_PROMPT).toBe("string");
    expect(PROMPT_REFINEMENT_SYSTEM_PROMPT.length).toBeGreaterThan(0);
  });
});
