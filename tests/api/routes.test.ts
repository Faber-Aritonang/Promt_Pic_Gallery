import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock all services before importing routes
vi.mock("@/lib/firebase-admin", () => ({
  getAdminDb: vi.fn(() => {
    throw new Error("Firestore not configured");
  }),
}));

vi.mock("@/lib/services/templates", () => ({
  listTemplates: vi.fn(),
  getTemplateById: vi.fn(),
  getCategories: vi.fn(),
}));

vi.mock("@/lib/services/glm", () => ({
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

function createNextRequest(url: string) {
  const parsedUrl = new URL(url);
  return {
    nextUrl: {
      searchParams: parsedUrl.searchParams,
    },
    url,
    headers: new Headers(),
  } as unknown as import("next/server").NextRequest;
}

function createRequest(url: string, options?: { headers?: Record<string, string> }) {
  const headers = new Headers(options?.headers);
  return new Request(url, { headers }) as unknown as import("next/server").NextRequest;
}

import { GET as getTemplates } from "@/app/api/templates/route";
import { GET as getTemplate } from "@/app/api/templates/[id]/route";
import { GET as getModels } from "@/app/api/models/route";
import { POST as postAuth } from "@/app/api/auth/route";
import { GET as getUserVersions } from "@/app/api/user-versions/route";

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
    const request = createRequest("http://localhost/api/user-versions");
    const response = await getUserVersions(request);
    expect(response.status).toBe(401);
    const json = await response.json();
    expect(json.success).toBe(false);
  });
});
