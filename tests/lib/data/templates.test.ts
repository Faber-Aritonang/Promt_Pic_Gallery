import { describe, it, expect } from "vitest";
import { seedTemplates, categories } from "@/lib/data/templates";

describe("seedTemplates", () => {
  it("contains exactly 20 templates", () => {
    expect(seedTemplates.length).toBe(20);
  });

  it("has unique IDs for all templates", () => {
    const ids = seedTemplates.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(seedTemplates.length);
  });

  it("all templates have required fields", () => {
    seedTemplates.forEach((template) => {
      expect(template.id).toBeTruthy();
      expect(template.title).toBeTruthy();
      expect(template.category.length).toBeGreaterThan(0);
      expect(template.original_prompt).toBeTruthy();
      expect(template.original_image_url).toBeTruthy();
      expect(template.original_image_generated_with).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(template.tags.length).toBeGreaterThan(0);
      expect(template.created_by).toBeTruthy();
      expect(template.created_at).toBeGreaterThan(0);
      expect(template.updated_at).toBeGreaterThan(0);
      expect(template.views_count).toBeGreaterThanOrEqual(0);
      expect(template.favorites_count).toBeGreaterThanOrEqual(0);
      expect(template.times_used).toBeGreaterThanOrEqual(0);
      expect(template.rating).toBeGreaterThanOrEqual(0);
      expect(template.rating).toBeLessThanOrEqual(5);
      expect(template.style_tips).toBeTruthy();
      expect(template.variations_suggested.length).toBeGreaterThan(0);
    });
  });

  it("all difficulty levels are valid", () => {
    const validLevels = ["beginner", "intermediate", "advanced"];
    seedTemplates.forEach((template) => {
      expect(validLevels).toContain(template.difficulty_level);
    });
  });

  it("all image URLs are valid HTTPS URLs", () => {
    seedTemplates.forEach((template) => {
      expect(template.original_image_url).toMatch(/^https:\/\//);
    });
  });

  it("all categories are lowercase strings", () => {
    seedTemplates.forEach((template) => {
      template.category.forEach((cat) => {
        expect(cat).toBe(cat.toLowerCase());
        expect(cat).not.toContain(" ");
      });
    });
  });

  it("all tags are lowercase strings", () => {
    seedTemplates.forEach((template) => {
      template.tags.forEach((tag) => {
        expect(tag).toBe(tag.toLowerCase());
      });
    });
  });

  it("has templates across multiple categories", () => {
    const allCategories = new Set<string>();
    seedTemplates.forEach((t) => t.category.forEach((c) => allCategories.add(c)));
    expect(allCategories.size).toBeGreaterThanOrEqual(8);
  });

  it("has templates with different difficulty levels", () => {
    const levels = new Set(seedTemplates.map((t) => t.difficulty_level));
    expect(levels.size).toBe(3); // beginner, intermediate, advanced
  });

  it("has templates with different image generators", () => {
    const generators = new Set(
      seedTemplates.map((t) => t.original_image_generated_with)
    );
    expect(generators.size).toBeGreaterThanOrEqual(2);
  });

  it("first template is tpl-001", () => {
    expect(seedTemplates[0].id).toBe("tpl-001");
  });

  it("last template is tpl-020", () => {
    expect(seedTemplates[19].id).toBe("tpl-020");
  });
});

describe("categories (computed)", () => {
  it("returns sorted categories", () => {
    for (let i = 1; i < categories.length; i++) {
      expect(categories[i - 1].count).toBeGreaterThanOrEqual(
        categories[i].count
      );
    }
  });

  it("each category has id, label, and count", () => {
    categories.forEach((cat) => {
      expect(cat.id).toBeTruthy();
      expect(cat.label).toBeTruthy();
      expect(cat.count).toBeGreaterThan(0);
    });
  });

  it("label is capitalized version of id", () => {
    categories.forEach((cat) => {
      expect(cat.label).toBe(
        cat.id.charAt(0).toUpperCase() + cat.id.slice(1)
      );
    });
  });

  it("total category counts add up correctly", () => {
    const total = categories.reduce((sum, c) => sum + c.count, 0);
    // Each template has at least one category, so total >= 20
    expect(total).toBeGreaterThanOrEqual(20);
  });
});
