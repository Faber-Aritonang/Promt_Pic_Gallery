import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn (classname utility)", () => {
  it("merges class names", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible");
    expect(result).toContain("base");
    expect(result).toContain("visible");
    expect(result).not.toContain("hidden");
  });

  it("handles undefined and null", () => {
    const result = cn("base", undefined, null, "extra");
    expect(result).toContain("base");
    expect(result).toContain("extra");
  });

  it("deduplicates Tailwind classes", () => {
    // tailwind-merge deduplicates Tailwind utility classes
    const result = cn("p-4", "p-4");
    expect(result).toBe("p-4");
  });

  it("handles empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("handles Tailwind class conflicts", () => {
    const result = cn("p-4", "p-8");
    // tailwind-merge keeps the last one
    expect(result).toBe("p-8");
  });
});
