import { describe, it, expect, vi } from "vitest";

// A stored template as the upload route writes it (Firestore document data,
// the id comes from `doc.id`).
function storedDoc(overrides: Record<string, unknown> = {}) {
  return {
    title: "Uploaded Template",
    category: ["test"],
    original_prompt: "a prompt",
    original_image_url: "https://res.cloudinary.com/demo/image/upload/templates/x.png",
    original_image_generated_with: "Playground v2.5",
    description: "an uploaded template",
    tags: ["test"],
    created_by: "anonymous",
    created_at: 1789110383554,
    updated_at: 1789110383554,
    views_count: 0,
    favorites_count: 0,
    times_used: 0,
    rating: 0,
    difficulty_level: "beginner",
    style_tips: "",
    variations_suggested: [],
    ...overrides,
  };
}

// Firestore contains exactly the documents listed in `storedDocs`.
const storedDocs: { id: string; data: () => Record<string, unknown> }[] = [
  { id: "uploaded-1", data: () => storedDoc() },
];

vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: () => ({
    collection: () => ({
      orderBy: () => ({
        limit: () => ({
          get: async () => ({ empty: storedDocs.length === 0, docs: storedDocs }),
        }),
      }),
      get: async () => ({ empty: storedDocs.length === 0, docs: storedDocs }),
      doc: (id: string) => ({
        get: async () => {
          const found = storedDocs.find((d) => d.id === id);
          return {
            exists: Boolean(found),
            id,
            data: () => found?.data() ?? {},
          };
        },
      }),
    }),
  }),
}));

import { listTemplates } from "@/lib/services/templates";
import { seedTemplates } from "@/lib/data/templates";

describe("listTemplates with Firestore configured", () => {
  it("lists stored templates next to the seed templates", async () => {
    const result = await listTemplates({ limit: 100 });
    const ids = result.templates.map((t) => t.id);

    // The uploaded template is listed...
    expect(ids).toContain("uploaded-1");
    // ...and the seed gallery is still there, instead of being replaced by it.
    expect(ids).toContain("tpl-001");
    expect(result.total).toBe(seedTemplates.length + 1);
  });

  it("does not list a seed template twice when it has been stored", async () => {
    storedDocs.push({
      id: "tpl-001",
      data: () => storedDoc({ title: "Stored Cyberpunk" }),
    });

    const result = await listTemplates({ limit: 100 });
    const matches = result.templates.filter((t) => t.id === "tpl-001");

    expect(matches).toHaveLength(1);
    // The stored document wins over the seed copy.
    expect(matches[0].title).toBe("Stored Cyberpunk");
    expect(result.total).toBe(seedTemplates.length + 1);

    storedDocs.pop();
  });
});
