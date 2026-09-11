// Template data service.
// Fetches from Firestore when credentials are present, otherwise falls back
// to the local seed data so the app works end-to-end without a Firebase project.

import { getAdminDb } from "@/lib/firebase-admin";
import { seedTemplates } from "@/lib/data/templates";
import type { Template } from "@/lib/types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface TemplateListParams {
  /** Full-text search across title, description, tags */
  q?: string;
  /** Filter by one or more categories (comma-separated) */
  category?: string;
  /** Sort field */
  sort?: "newest" | "popular" | "rating" | "most_used";
  /** Page number (1-based) */
  page?: number;
  /** Items per page */
  limit?: number;
  /** Offset for infinite scroll (alternative to page) */
  offset?: number;
}

export interface TemplateListResult {
  templates: Template[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Next offset for infinite scroll (-1 if no more) */
  nextOffset: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function filterAndSort(
  templates: Template[],
  params: TemplateListParams
): TemplateListResult {
  let result = [...templates];

  // Full-text search
  if (params.q) {
    const query = params.q.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        t.original_prompt.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (params.category) {
    const cats = params.category.split(",").map((c) => c.trim().toLowerCase());
    result = result.filter((t) =>
      t.category.some((c) => cats.includes(c.toLowerCase()))
    );
  }

  // Sort
  switch (params.sort) {
    case "newest":
      result.sort((a, b) => b.created_at - a.created_at);
      break;
    case "popular":
      result.sort((a, b) => b.views_count - a.views_count);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "most_used":
      result.sort((a, b) => b.times_used - a.times_used);
      break;
    default:
      // Default: popular first
      result.sort((a, b) => b.views_count - a.views_count);
  }

  const total = result.length;
  const limit = Math.min(200, Math.max(1, params.limit ?? 12));

  // Support both page-based and offset-based pagination
  let start: number;
  let page: number;

  if (params.offset !== undefined && params.offset >= 0) {
    // Infinite scroll mode: use offset directly
    start = Math.min(params.offset, total);
    page = Math.floor(start / limit) + 1;
  } else {
    // Traditional page-based mode
    page = Math.max(1, params.page ?? 1);
    start = (page - 1) * limit;
  }

  const paginated = result.slice(start, start + limit);
  const hasMore = start + limit < total;
  const nextOffset = hasMore ? start + limit : -1;
  const totalPages = Math.ceil(total / limit);

  return {
    templates: paginated,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    nextOffset,
  };
}

// ── Firestore fetcher ──────────────────────────────────────────────────────

async function fetchFromFirestore(
  params: TemplateListParams
): Promise<TemplateListResult | null> {
  try {
    const db = getAdminDb();
    const col = db.collection("templates");

    // Build Firestore query
    // Note: Firestore doesn't support full-text search natively,
    // so we fetch all and filter in-memory for now.
    // For production, consider Algolia or Typesense for search.
    const snapshot = await col.orderBy("created_at", "desc").limit(100).get();

    const stored: Template[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Template[];

    // Keep the seed templates listed alongside the stored ones. They are what
    // the gallery shows before the first upload, so returning *only* Firestore
    // documents would make the gallery appear to lose its content the moment a
    // single template is saved. Stored documents win on id collisions.
    const storedIds = new Set(stored.map((t) => t.id));
    const templates = [
      ...stored,
      ...seedTemplates.filter((t) => !storedIds.has(t.id)),
    ];

    if (templates.length === 0) return null;

    return filterAndSort(templates, params);
  } catch (error) {
    // Firestore not configured or unreachable — fall back to seed data
    console.warn("[templates] Firestore unavailable, using seed data:", error);
    return null;
  }
}

// ── Seed data fetcher ──────────────────────────────────────────────────────

function fetchFromSeedData(params: TemplateListParams): TemplateListResult {
  return filterAndSort(seedTemplates, params);
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * List templates with search, filter, sort, and pagination.
 * Tries Firestore first, falls back to seed data.
 */
export async function listTemplates(
  params: TemplateListParams = {}
): Promise<TemplateListResult> {
  const firestoreResult = await fetchFromFirestore(params);
  if (firestoreResult) return firestoreResult;
  return fetchFromSeedData(params);
}

/**
 * Get a single template by ID.
 * Tries Firestore first, falls back to seed data.
 */
export async function getTemplateById(
  id: string
): Promise<Template | null> {
  // Try Firestore first
  try {
    const db = getAdminDb();
    const doc = await db.collection("templates").doc(id).get();
    if (doc.exists) {
      return { id: doc.id, ...doc.data() } as Template;
    }
  } catch {
    // Fall through to seed data
  }

  // Fall back to seed data
  return seedTemplates.find((t) => t.id === id) ?? null;
}

/**
 * Get available categories with template counts.
 * Tries Firestore first, falls back to seed data.
 */
export async function getCategories(): Promise<
  { id: string; label: string; count: number }[]
> {
  // Try Firestore first
  try {
    const db = getAdminDb();
    const snapshot = await db.collection("templates").get();
    if (!snapshot.empty) {
      const templates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Template[];
      
      const categoryMap = new Map<string, { label: string; count: number }>();

      for (const t of templates) {
        for (const cat of t.category) {
          const existing = categoryMap.get(cat);
          if (existing) {
            existing.count++;
          } else {
            categoryMap.set(cat, {
              label: cat.charAt(0).toUpperCase() + cat.slice(1),
              count: 1,
            });
          }
        }
      }

      return Array.from(categoryMap.entries())
        .map(([id, { label, count }]) => ({ id, label, count }))
        .sort((a, b) => b.count - a.count);
    }
  } catch (error) {
    console.warn("[templates] Firestore unavailable for categories, using seed data:", error);
  }

  // Fall back to seed data
  const templates = seedTemplates;
  const categoryMap = new Map<string, { label: string; count: number }>();

  for (const t of templates) {
    for (const cat of t.category) {
      const existing = categoryMap.get(cat);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(cat, {
          label: cat.charAt(0).toUpperCase() + cat.slice(1),
          count: 1,
        });
      }
    }
  }

  return Array.from(categoryMap.entries())
    .map(([id, { label, count }]) => ({ id, label, count }))
    .sort((a, b) => b.count - a.count);
}
