import { describe, it, expect, vi } from "vitest";
import {
  buildRefinementMessages,
  PROMPT_REFINEMENT_SYSTEM_PROMPT,
} from "@/lib/services/glm";

// Mock fetch globally for API call tests
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

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
