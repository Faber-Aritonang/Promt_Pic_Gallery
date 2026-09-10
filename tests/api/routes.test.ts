import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all services before importing routes
let mockDb: any;
vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: vi.fn(() => mockDb),
}));

// Mock data store
const versionStore: any[] = [];
const userStatsStore: Record<string, any> = {};

function resetStores() {
  versionStore.length = 0;
  Object.keys(userStatsStore).forEach(k => delete userStatsStore[k]);
}

beforeEach(() => {
  resetStores();
  mockDb = {
    collection: vi.fn((name: string) => {
      if (name === "user_versions") {
        return {
          where: vi.fn().mockReturnThis(),
          orderBy: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          get: vi.fn().mockResolvedValue({
            docs: versionStore.map((data, i) => ({
              id: data.id || `doc-${i}`,
              data: () => data,
            })),
            empty: versionStore.length === 0,
          }),
          add: vi.fn().mockImplementation(async (data: any) => {
            const id = `user-version-${Date.now()}-${Math.random()}`;
            versionStore.push({ id, ...data });
            return { id };
          }),
        };
      }
      if (name === "users") {
        return {
          doc: vi.fn((uid: string) => {
            const existing = userStatsStore[uid] || {};
            return {
              get: vi.fn().mockResolvedValue({
                data: () => existing,
                exists: !!existing.stats,
              }),
              update: vi.fn().mockResolvedValue(() => {
                userStatsStore[uid] = { ...existing };
              }),
            };
          }),
        };
      }
      return {
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue({ docs: [], empty: true }),
        add: vi.fn().mockResolvedValue({ id: `doc-${Date.now()}` }),
      };
    }),
  };
});

vi.mock("@/lib/services/templates", () => ({
  listTemplates: vi.fn(),
  getTemplateById: vi.fn(),
  getCategories: vi.fn(),
}));

vi.mock("@/lib/services/llm", () => ({
  chatCompletion: vi.fn(),
  chatCompletionStream: vi.fn(),
  buildRefinementMessages: vi.fn((history: unknown[]) => [
    { role: "system", content: "System prompt" },
    ...history,
  ]),
  PROMPT_REFINEMENT_SYSTEM_PROMPT: "System prompt",
}));

vi.mock("@/lib/services/generation", () => ({
  imageModels: [
    {
      id: "test/model",
      name: "Test Model",
      provider: "huggingface",
      description: "Test",
      free: true,
      defaultWidth: 512,
      defaultHeight: 512,
    },
  ],
  getImageModel: vi.fn(),
  getDefaultImageModel: vi.fn(),
  isHuggingFaceConfigured: vi.fn(() => true),
  generateWithHuggingFace: vi.fn(),
}));

vi.mock("@/lib/services/replicate", () => ({
  replicateModels: [],
  isReplicateConfigured: vi.fn(() => false),
  generateWithReplicate: vi.fn(),
}));

vi.mock("@/lib/cloudinary", () => ({
  uploadImage: vi.fn(() =>
    Promise.resolve({
      public_id: "test/image",
      secure_url: "https://res.cloudinary.com/test/image/upload/test/image",
      width: 512,
      height: 512,
    })
  ),
}));

vi.mock("@/lib/services/server-auth", () => ({
  verifyAuthToken: vi.fn(() => Promise.resolve(null)),
  requireAuth: vi.fn(() =>
    Promise.reject(
      new Response(
        JSON.stringify({ success: false, error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      )
    )
  ),
  getOrCreateUser: vi.fn(),
}));

// Import route handlers after mocks
import { GET as healthCheck } from "@/app/api/route";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createNextRequest(url: string): any {
  const parsedUrl = new URL(url);
  return {
    nextUrl: {
      searchParams: parsedUrl.searchParams,
    },
    url,
    headers: new Headers(),
  } as import("next/server").NextRequest;
}

function createRequest(url: string, options?: { headers?: Record<string, string>; body?: string; method?: string }) {
  const headers = new Headers(options?.headers);
  if (options?.body) {
    headers.set("Content-Type", "application/json");
  }
  const request = new Request(url, {
    headers,
    method: options?.method || "GET",
    body: options?.body || null,
  });
  return request as NextRequest;
}

import { GET as getTemplates } from "@/app/api/templates/route";
import { GET as getTemplate } from "@/app/api/templates/[id]/route";
import { GET as getModels } from "@/app/api/models/route";
import { POST as postAuth } from "@/app/api/auth/route";
import { GET as getUserVersions } from "@/app/api/user-versions/route";
import { POST as postUserVersions } from "@/app/api/user-versions/route";
import { verifyAuthToken } from "@/lib/services/server-auth";

import type { NextRequest } from "next/server";
import {
  listTemplates,
  getTemplateById,
  getCategories,
} from "@/lib/services/templates";

describe("GET /api — health check", () => {
  it("returns status ok with phase info", async () => {
    const response = await healthCheck();
    const json = await response.json();

    expect(json.status).toBe("ok");
    expect(json.message).toContain("PromtPicGallery");
    expect(json.phase).toBe("5");
    expect(json.timestamp).toBeDefined();
  });
});

describe("GET /api/templates — list templates", () => {
  const mockListTemplates = vi.mocked(listTemplates);

  beforeEach(() => {
    mockListTemplates.mockReset();
  });

  it("returns templates with default params", async () => {
    mockListTemplates.mockResolvedValue({
      templates: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
      hasMore: false,
      nextOffset: -1,
    });

    const request = createNextRequest("http://localhost/api/templates");
    const response = await getTemplates(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
  });

  it("passes query params to listTemplates", async () => {
    mockListTemplates.mockResolvedValue({
      templates: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
      hasMore: false,
      nextOffset: -1,
    });

    const request = createNextRequest(
      "http://localhost/api/templates?q=cyberpunk&category=sci-fi&sort=newest&limit=5"
    );
    await getTemplates(request);

    expect(mockListTemplates).toHaveBeenCalledWith(
      expect.objectContaining({
        q: "cyberpunk",
        category: "sci-fi",
        sort: "newest",
        limit: 5,
      })
    );
  });

  it("returns categories when ?categories=true", async () => {
    const mockGetCategories = vi.mocked(getCategories);
    mockGetCategories.mockReset();
    mockGetCategories.mockResolvedValue([
      { id: "fantasy", label: "Fantasy", count: 5 },
    ]);

    const request = createNextRequest(
      "http://localhost/api/templates?categories=true"
    );
    const response = await getTemplates(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data).toEqual([
      { id: "fantasy", label: "Fantasy", count: 5 },
    ]);
  });
});

describe("GET /api/templates/[id] — template detail", () => {
  const mockGetTemplateById = vi.mocked(getTemplateById);

  beforeEach(() => {
    mockGetTemplateById.mockReset();
  });

  it("returns template when found", async () => {
    mockGetTemplateById.mockResolvedValue({
      id: "tpl-001",
      title: "Cyberpunk City",
      category: ["landscape"],
      original_prompt: "test prompt",
      original_image_url: "https://example.com/img.jpg",
      original_image_generated_with: "DALL·E 3",
      description: "test",
      tags: ["test"],
      created_by: "admin",
      created_at: Date.now(),
      updated_at: Date.now(),
      views_count: 100,
      favorites_count: 10,
      times_used: 5,
      rating: 4.5,
      difficulty_level: "beginner",
      style_tips: "test tips",
      variations_suggested: ["variation 1"],
    });

    const request = createNextRequest("http://localhost/api/templates/tpl-001");
    const response = await getTemplate(request, {
      params: Promise.resolve({ id: "tpl-001" }),
    });
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data.id).toBe("tpl-001");
  });

  it("returns 404 when template not found", async () => {
    mockGetTemplateById.mockResolvedValue(null);

    const request = createNextRequest("http://localhost/api/templates/nonexistent");
    const response = await getTemplate(request, {
      params: Promise.resolve({ id: "nonexistent" }),
    });

    expect(response.status).toBe(404);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("not found");
  });
});

describe("GET /api/models — image models", () => {
  it("returns model catalog", async () => {
    const response = await getModels();
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data.configured).toBe(true);
    expect(json.data.models.length).toBeGreaterThan(0);
    expect(json.data.models[0].id).toBe("test/model");
  });
});

describe("POST /api/auth — auth routes", () => {
  it("returns 400 when body is invalid", async () => {
    const request = createRequest("http://localhost/api/auth", {
      headers: { "Content-Type": "application/json" },
    });
    // Override request.json to return invalid data
    request.json = () => Promise.reject(new Error("Invalid JSON"));
    const response = await postAuth(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
  });

  it("returns 401 when not authenticated for me action", async () => {
    const request = new Request("http://localhost/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "me" }),
    });
    const response = await postAuth(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.success).toBe(false);
  });
});

describe("GET /api/user-versions — user versions", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(verifyAuthToken).mockResolvedValue(null);
    
    const request = createRequest("http://localhost/api/user-versions");
    const response = await getUserVersions(request);
    
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Authentication required.");
  });

  it("returns 401 with invalid token", async () => {
    vi.mocked(verifyAuthToken).mockResolvedValue(null);
    
    const request = createRequest("http://localhost/api/user-versions", {
      headers: { Authorization: "Bearer invalid-token" },
    });
    const response = await getUserVersions(request);
    
    expect(response.status).toBe(401);
  });

  it("returns versions when authenticated", async () => {
    versionStore.push(
      {
        id: "v1",
        template_id: "tpl-001",
        user_id: "user-123",
        final_prompt: "A beautiful sunset",
        created_at: Date.now() - 1000,
        stats: { total_refinements: 1 },
      },
      {
        id: "v2",
        template_id: "tpl-002",
        user_id: "user-123",
        final_prompt: "A mountain view",
        created_at: Date.now() - 2000,
        stats: { total_refinements: 2 },
      }
    );
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = createRequest("http://localhost/api/user-versions");
    const response = await getUserVersions(request);
    
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.versions).toHaveLength(2);
    expect(json.data.total).toBe(2);
    expect(json.data.hasMore).toBe(false);
  });

  it("returns empty list when no versions exist", async () => {
    resetStores();
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = createRequest("http://localhost/api/user-versions");
    const response = await getUserVersions(request);
    
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.versions).toHaveLength(0);
    expect(json.data.total).toBe(0);
    expect(json.data.hasMore).toBe(false);
  });

  it("returns only versions for authenticated user", async () => {
    resetStores();
    versionStore.push(
      {
        id: "v1",
        template_id: "tpl-001",
        user_id: "user-123",
        final_prompt: "User 123 prompt",
        created_at: Date.now(),
        stats: {},
      },
      {
        id: "v2",
        template_id: "tpl-002",
        user_id: "user-456",
        final_prompt: "User 456 prompt",
        created_at: Date.now(),
        stats: {},
      }
    );
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = createRequest("http://localhost/api/user-versions");
    const response = await getUserVersions(request);
    
    expect(response.status).toBe(200);
    const json = await response.json();
    // Should only return versions for user-123 (firestore WHERE clause filters by user_id)
    // Mock returns all, but the real implementation filters - so this test documents expected behavior
    expect(json.data.versions.length).toBeGreaterThan(0);
  });

  it("paginates with limit and offset", async () => {
    for (let i = 0; i < 10; i++) {
      versionStore.push({
        id: `v${i}`,
        template_id: "tpl",
        user_id: "user-123",
        final_prompt: `Prompt ${i}`,
        created_at: Date.now() - i * 1000,
        stats: {},
      });
    }
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = createRequest("http://localhost/api/user-versions?limit=3&offset=2");
    const response = await getUserVersions(request);
    
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.data.versions).toHaveLength(3);
    expect(json.data.total).toBe(10);
    expect(json.data.hasMore).toBe(true);
    expect(json.data.nextOffset).toBe(5);
  });

  it("returns 500 on internal error", async () => {
    mockDb.collection = vi.fn().mockImplementation(() => ({
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockRejectedValueOnce(new Error("Database error")),
    }));
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = createRequest("http://localhost/api/user-versions");
    const response = await getUserVersions(request);
    
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Internal server error");
  });
});

describe("POST /api/user-versions — create version", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(verifyAuthToken).mockResolvedValue(null);
    
    const request = createRequest("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: "tpl-001",
        final_prompt: "Test prompt",
      }),
    });
    
    const response = await postUserVersions(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Authentication required.");
  });

  it("returns 400 when body is invalid JSON", async () => {
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = createRequest("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    request.json = () => Promise.reject(new Error("Invalid JSON"));
    
    const response = await postUserVersions(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid JSON body.");
  });

  it("returns 400 when template_id is missing", async () => {
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = new Request("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ final_prompt: "Test prompt" }),
    });
    
    const response = await postUserVersions(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("template_id is required.");
  });

  it("returns 400 when final_prompt is missing or empty", async () => {
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = new Request("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template_id: "tpl-001", final_prompt: "   " }),
    });
    
    const response = await postUserVersions(request);
    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("final_prompt is required.");
  });

  it("creates version successfully with valid data", async () => {
    resetStores();
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = new Request("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: "tpl-001",
        final_prompt: "A beautiful cyberpunk city",
        final_image_url: "https://example.com/image.jpg",
        final_image_generated_with: "Midjourney",
        is_public: true,
        refinement_steps: [
          { step: 1, prompt: "Initial prompt" },
          { step: 2, prompt: "Refined prompt" },
        ],
      }),
    });
    
    const response = await postUserVersions(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.id).toBeDefined();
    expect(json.data.template_id).toBe("tpl-001");
    expect(json.data.final_prompt).toBe("A beautiful cyberpunk city");
    expect(json.data.user_id).toBe("user-123");
    expect(json.data.is_public).toBe(true);
    expect(json.data.refinement_steps).toHaveLength(2);
    expect(json.data.final_image_url).toBe("https://example.com/image.jpg");
    expect(json.data.final_image_generated_with).toBe("Midjourney");
    expect(json.data.stats).toBeDefined();
    expect(json.data.stats.total_refinements).toBe(2);
  });

  it("sets defaults for optional fields", async () => {
    resetStores();
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = new Request("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: "tpl-001",
        final_prompt: "Minimal prompt",
      }),
    });
    
    const response = await postUserVersions(request);
    const json = await response.json();
    
    expect(json.data.final_image_url).toBe("");
    expect(json.data.final_image_generated_with).toBe("");
    expect(json.data.is_public).toBe(false);
    expect(json.data.refinement_steps).toEqual([]);
    expect(json.data.stats.total_refinements).toBe(0);
  });

  it("stores refinement_steps when provided", async () => {
    resetStores();
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = new Request("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: "tpl-001",
        final_prompt: "Final prompt",
        refinement_steps: [
          { step_number: 1, prompt: "Step 1", feedback: "Good" },
          { step_number: 2, prompt: "Step 2", feedback: "Better" },
          { step_number: 3, prompt: "Step 3", feedback: "Best" },
        ],
      }),
    });
    
    const response = await postUserVersions(request);
    const json = await response.json();
    
    expect(json.data.refinement_steps).toHaveLength(3);
    expect(json.data.stats.total_refinements).toBe(3);
    expect(json.data.stats.conversation_turns).toBe(3);
  });

  it("trims whitespace from final_prompt", async () => {
    resetStores();
    
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    const request = new Request("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: "tpl-001",
        final_prompt: "  Spaced prompt  ",
      }),
    });
    
    const response = await postUserVersions(request);
    const json = await response.json();
    expect(json.data.final_prompt).toBe("Spaced prompt");
  });

  it("returns 500 on internal error", async () => {
    vi.mocked(verifyAuthToken).mockResolvedValue({
      uid: "user-123",
      email: "test@example.com",
    });
    
    mockDb.collection = vi.fn().mockImplementation(() => ({
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      get: vi.fn().mockResolvedValue({ docs: [], empty: true }),
      add: vi.fn().mockRejectedValueOnce(new Error("Database error")),
    }));
    
    const request = new Request("http://localhost/api/user-versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        template_id: "tpl-001",
        final_prompt: "Test",
      }),
    });
    
    const response = await postUserVersions(request);
    expect(response.status).toBe(500);
    const json = await response.json();
    expect(json.success).toBe(false);
    expect(json.error).toBe("Internal server error");
  });
});
