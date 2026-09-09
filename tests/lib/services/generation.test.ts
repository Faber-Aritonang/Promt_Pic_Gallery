import { describe, it, expect, vi, afterEach } from "vitest";
import {
  imageModels,
  getImageModel,
  getDefaultImageModel,
  isHuggingFaceConfigured,
  generateWithHuggingFace,
} from "@/lib/services/generation";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

describe("imageModels catalog", () => {
  it("contains at least 5 models", () => {
    expect(imageModels.length).toBeGreaterThanOrEqual(5);
  });

  it("each model has required fields", () => {
    imageModels.forEach((model) => {
      expect(model).toHaveProperty("id");
      expect(model).toHaveProperty("name");
      expect(model).toHaveProperty("provider", "huggingface");
      expect(model).toHaveProperty("description");
      expect(model).toHaveProperty("free", true);
      expect(model).toHaveProperty("defaultWidth");
      expect(model).toHaveProperty("defaultHeight");
      expect(model.defaultWidth).toBeGreaterThan(0);
      expect(model.defaultHeight).toBeGreaterThan(0);
    });
  });

  it("first model is SD3 Medium", () => {
    expect(imageModels[0].id).toBe(
      "stabilityai/stable-diffusion-3-medium-diffusers"
    );
  });
});

describe("getImageModel", () => {
  it("returns a model by ID", () => {
    const model = getImageModel(
      "stabilityai/stable-diffusion-xl-base-1.0"
    );
    expect(model).toBeDefined();
    expect(model!.name).toBe("Stable Diffusion XL");
  });

  it("returns undefined for non-existent model", () => {
    const model = getImageModel("nonexistent/model-id");
    expect(model).toBeUndefined();
  });
});

describe("getDefaultImageModel", () => {
  it("returns the first model", () => {
    const model = getDefaultImageModel();
    expect(model.id).toBe(imageModels[0].id);
  });
});

describe("isHuggingFaceConfigured", () => {
  const originalEnv = process.env.HUGGING_FACE_API_KEY;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.HUGGING_FACE_API_KEY = originalEnv;
    } else {
      delete process.env.HUGGING_FACE_API_KEY;
    }
  });

  it("returns false when env var is missing", () => {
    delete process.env.HUGGING_FACE_API_KEY;
    expect(isHuggingFaceConfigured()).toBe(false);
  });

  it("returns false when env var is placeholder", () => {
    process.env.HUGGING_FACE_API_KEY = "your_huggingface_api_key";
    expect(isHuggingFaceConfigured()).toBe(false);
  });

  it("returns false when env var is empty string", () => {
    process.env.HUGGING_FACE_API_KEY = "";
    expect(isHuggingFaceConfigured()).toBe(false);
  });

  it("returns true when env var is a real key", () => {
    process.env.HUGGING_FACE_API_KEY = "hf_abc123def456";
    expect(isHuggingFaceConfigured()).toBe(true);
  });
});

describe("generateWithHuggingFace", () => {
  const originalEnv = process.env.HUGGING_FACE_API_KEY;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.HUGGING_FACE_API_KEY = originalEnv;
    } else {
      delete process.env.HUGGING_FACE_API_KEY;
    }
    mockFetch.mockReset();
  });

  it("throws when API key is not configured", async () => {
    delete process.env.HUGGING_FACE_API_KEY;
    await expect(
      generateWithHuggingFace("a beautiful sunset")
    ).rejects.toThrow("HUGGING_FACE_API_KEY is not configured");
  });

  it("throws when API key is placeholder", async () => {
    process.env.HUGGING_FACE_API_KEY = "your_huggingface_api_key";
    await expect(
      generateWithHuggingFace("a beautiful sunset")
    ).rejects.toThrow("HUGGING_FACE_API_KEY is not configured");
  });

  it("makes correct API call with default model", async () => {
    process.env.HUGGING_FACE_API_KEY = "hf_test123";
    const fakeImage = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG header
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "image/png" }),
      arrayBuffer: () => Promise.resolve(fakeImage.buffer),
    });

    const result = await generateWithHuggingFace("a sunset");

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain(
      "stabilityai/stable-diffusion-3-medium-diffusers"
    );
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer hf_test123");
    expect(options.headers["x-wait-for-model"]).toBe("true");

    const body = JSON.parse(options.body);
    expect(body.inputs).toBe("a sunset");

    expect(result.imageBuffer).toBeDefined();
    expect(result.contentType).toBe("image/png");
    expect(result.model.id).toBe(
      "stabilityai/stable-diffusion-3-medium-diffusers"
    );
  });

  it("uses specified model when provided", async () => {
    process.env.HUGGING_FACE_API_KEY = "hf_test123";
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "image/png" }),
      arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
    });

    await generateWithHuggingFace(
      "a portrait",
      "runwayml/stable-diffusion-v1-5"
    );

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain("runwayml/stable-diffusion-v1-5");
  });

  it("sends width/height when provided", async () => {
    process.env.HUGGING_FACE_API_KEY = "hf_test123";
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "image/png" }),
      arrayBuffer: () => Promise.resolve(new Uint8Array([1, 2, 3]).buffer),
    });

    await generateWithHuggingFace("a landscape", undefined, {
      width: 768,
      height: 512,
    });

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.parameters).toEqual({ width: 768, height: 512 });
  });

  it("handles API error response", async () => {
    process.env.HUGGING_FACE_API_KEY = "hf_test123";
    mockFetch.mockResolvedValue({
      ok: false,
      status: 503,
      headers: new Headers({ "content-type": "application/json" }),
      text: () => Promise.resolve(JSON.stringify({ error: "Model is loading" })),
    });

    await expect(
      generateWithHuggingFace("a portrait")
    ).rejects.toThrow("Model is loading");
  });

  it("handles JSON error in response body", async () => {
    process.env.HUGGING_FACE_API_KEY = "hf_test123";
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers({ "content-type": "application/json" }),
      text: () => Promise.resolve("Internal Server Error"),
    });

    await expect(
      generateWithHuggingFace("a portrait")
    ).rejects.toThrow("Hugging Face error (500)");
  });
});
