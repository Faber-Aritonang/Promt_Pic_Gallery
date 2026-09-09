import { describe, it, expect, vi } from "vitest";

// Mock firebase-admin so Firestore is unavailable (falls back to seed data)
vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: vi.fn(() => {
    throw new Error("Firestore not configured");
  }),
}));

// Import after mock so the module uses the mock
import { listTemplates, getTemplateById, getCategories } from "@/lib/services/templates";

describe("listTemplates", () => {
  it("returns templates from seed data when Firestore is unavailable", async () => {
    const result = await listTemplates({});
    expect(result.templates.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.limit).toBe(12); // default limit
    expect(result.page).toBe(1);
  });

  it("returns all 20 seed templates with no filters", async () => {
    const result = await listTemplates({});
    expect(result.total).toBe(20);
  });

  it("searches by title", async () => {
    const result = await listTemplates({ q: "Cyberpunk" });
    expect(result.templates.length).toBeGreaterThanOrEqual(2);
    expect(
      result.templates.every((t) =>
        t.title.toLowerCase().includes("cyberpunk")
      )
    ).toBe(true);
  });

  it("searches by tags", async () => {
    const result = await listTemplates({ q: "neon" });
    expect(result.templates.length).toBeGreaterThanOrEqual(1);
  });

  it("searches by description", async () => {
    const result = await listTemplates({ q: "moody" });
    expect(result.templates.length).toBeGreaterThanOrEqual(1);
  });

  it("searches by prompt text", async () => {
    const result = await listTemplates({ q: "volumetric fog" });
    expect(result.templates.length).toBeGreaterThanOrEqual(1);
  });

  it("filters by single category", async () => {
    const result = await listTemplates({ category: "fantasy" });
    expect(result.templates.length).toBeGreaterThanOrEqual(1);
    expect(
      result.templates.every((t) =>
        t.category.some((c) => c.toLowerCase() === "fantasy")
      )
    ).toBe(true);
  });

  it("filters by multiple comma-separated categories", async () => {
    const result = await listTemplates({ category: "fantasy,sci-fi" });
    expect(result.templates.length).toBeGreaterThanOrEqual(1);
    expect(
      result.templates.every((t) =>
        t.category.some(
          (c) => c.toLowerCase() === "fantasy" || c.toLowerCase() === "sci-fi"
        )
      )
    ).toBe(true);
  });

  it("sorts by newest", async () => {
    const result = await listTemplates({ sort: "newest" });
    const dates = result.templates.map((t) => t.created_at);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  it("sorts by popular (default)", async () => {
    const result = await listTemplates({});
    const views = result.templates.map((t) => t.views_count);
    for (let i = 1; i < views.length; i++) {
      expect(views[i - 1]).toBeGreaterThanOrEqual(views[i]);
    }
  });

  it("sorts by rating", async () => {
    const result = await listTemplates({ sort: "rating" });
    const ratings = result.templates.map((t) => t.rating);
    for (let i = 1; i < ratings.length; i++) {
      expect(ratings[i - 1]).toBeGreaterThanOrEqual(ratings[i]);
    }
  });

  it("sorts by most_used", async () => {
    const result = await listTemplates({ sort: "most_used" });
    const uses = result.templates.map((t) => t.times_used);
    for (let i = 1; i < uses.length; i++) {
      expect(uses[i - 1]).toBeGreaterThanOrEqual(uses[i]);
    }
  });

  it("paginates with page-based mode", async () => {
    const page1 = await listTemplates({ page: 1, limit: 5 });
    const page2 = await listTemplates({ page: 2, limit: 5 });

    expect(page1.templates.length).toBe(5);
    expect(page2.templates.length).toBe(5);
    expect(page1.page).toBe(1);
    expect(page2.page).toBe(2);

    // Ensure no duplicates between pages
    const ids1 = page1.templates.map((t) => t.id);
    const ids2 = page2.templates.map((t) => t.id);
    const intersection = ids1.filter((id) => ids2.includes(id));
    expect(intersection.length).toBe(0);
  });

  it("paginates with offset-based mode (infinite scroll)", async () => {
    const first = await listTemplates({ offset: 0, limit: 5 });
    const second = await listTemplates({ offset: 5, limit: 5 });

    expect(first.templates.length).toBe(5);
    expect(second.templates.length).toBe(5);
    expect(first.hasMore).toBe(true);
    expect(first.nextOffset).toBe(5);
  });

  it("returns hasMore=false when on last page", async () => {
    const result = await listTemplates({ page: 10, limit: 50 });
    expect(result.hasMore).toBe(false);
    expect(result.nextOffset).toBe(-1);
  });

  it("clamps limit between 1 and 50", async () => {
    const result1 = await listTemplates({ limit: 0 });
    expect(result1.limit).toBe(1);

    const result2 = await listTemplates({ limit: 100 });
    expect(result2.limit).toBe(50);
  });

  it("handles combined search + category + sort", async () => {
    const result = await listTemplates({
      q: "cyberpunk",
      category: "sci-fi",
      sort: "newest",
    });
    expect(result.templates.length).toBeGreaterThanOrEqual(1);
    result.templates.forEach((t) => {
      expect(t.category).toContain("sci-fi");
    });
  });

  it("returns empty when search matches nothing", async () => {
    const result = await listTemplates({
      q: "xyzzy_nonexistent_template_12345",
    });
    expect(result.templates.length).toBe(0);
    expect(result.total).toBe(0);
  });
});

describe("getTemplateById", () => {
  it("returns a template by ID", async () => {
    const template = await getTemplateById("tpl-001");
    expect(template).not.toBeNull();
    expect(template!.id).toBe("tpl-001");
    expect(template!.title).toBe("Cyberpunk City at Night");
  });

  it("returns null for non-existent ID", async () => {
    const template = await getTemplateById("non-existent-id");
    expect(template).toBeNull();
  });

  it("returns all expected fields", async () => {
    const template = await getTemplateById("tpl-001");
    expect(template).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      category: expect.any(Array),
      original_prompt: expect.any(String),
      original_image_url: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      views_count: expect.any(Number),
      favorites_count: expect.any(Number),
      rating: expect.any(Number),
      difficulty_level: expect.stringMatching(/^(beginner|intermediate|advanced)$/),
    });
  });
});

describe("getCategories", () => {
  it("returns categories with counts", async () => {
    const categories = await getCategories();
    expect(categories.length).toBeGreaterThan(0);

    categories.forEach((cat) => {
      expect(cat).toHaveProperty("id");
      expect(cat).toHaveProperty("label");
      expect(cat).toHaveProperty("count");
      expect(cat.count).toBeGreaterThan(0);
      expect(cat.label).toBe(
        cat.id.charAt(0).toUpperCase() + cat.id.slice(1)
      );
    });
  });

  it("sorts categories by count descending", async () => {
    const categories = await getCategories();
    for (let i = 1; i < categories.length; i++) {
      expect(categories[i - 1].count).toBeGreaterThanOrEqual(categories[i].count);
    }
  });

  it("includes expected categories", async () => {
    const categories = await getCategories();
    const ids = categories.map((c) => c.id);
    expect(ids).toContain("fantasy");
    expect(ids).toContain("sci-fi");
    expect(ids).toContain("landscape");
  });
});
