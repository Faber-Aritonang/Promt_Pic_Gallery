"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Download,
  ExternalLink,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";

interface ImageModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  free: boolean;
  defaultWidth: number;
  defaultHeight: number;
  available?: boolean;
}

interface GenerateResult {
  image_url: string;
  public_id?: string;
  model_used: string;
  model_name: string;
  provider: string;
  width: number;
  height: number;
  generation_time_ms: number;
  created_at: number;
}

interface ModelsResponse {
  configured: boolean;
  hf_configured: boolean;
  replicate_configured: boolean;
  default_model: string | null;
  models: ImageModel[];
}

interface ImageGeneratorProps {
  /** The prompt to generate from (usually the current refined prompt). */
  prompt: string;
  templateId?: string;
  disabled?: boolean;
}

export function ImageGenerator({
  prompt,
  templateId,
  disabled,
}: ImageGeneratorProps) {
  const [models, setModels] = useState<ImageModel[]>([]);
  const [configured, setConfigured] = useState(false);

  const [selectedModel, setSelectedModel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Load available models on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/models")
      .then((res) => res.json())
      .then((json) => {
        if (cancelled || !json.success) return;
        const data = json.data as ModelsResponse;
        setModels(data.models);
        setConfigured(data.configured);

        if (data.default_model) {
          setSelectedModel((prev) => prev || data.default_model!);
        } else if (data.models.length > 0) {
          setSelectedModel((prev) => prev || data.models[0].id);
        }
      })
      .catch(() => {
        // Leave the panel disabled if the models endpoint is unavailable
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!configured || !prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      // Use selected model if available, otherwise use first configured model
      let selectedModelId = selectedModel;
      if (!selectedModelId && models.length > 0) {
        selectedModelId = models[0].id;
        setSelectedModel(selectedModelId);
      }

      if (!selectedModelId) {
        throw new Error("No model available for generation");
      }

      // Determine provider from selected model
      const model = models.find((m) => m.id === selectedModelId);
      const provider = model?.provider ?? "huggingface";

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModelId,
          provider,
          templateId,
        }),
      });

      // The body is not guaranteed to be JSON: a platform-level failure
      // (function timeout, crash) answers with an empty body, and
      // `response.json()` would then throw an unhelpful parse error.
      const rawBody = await res.text();

      if (!rawBody) {
        throw new Error(
          `Image generation failed with HTTP ${res.status}${
            res.statusText ? ` ${res.statusText}` : ""
          } and an empty response body. A generation that runs longer than the ` +
            `serverless limit is cut off this way — press Generate again ` +
            `(the model is usually warm by then).`
        );
      }

      let json: { success?: boolean; error?: string; data?: unknown };
      try {
        json = JSON.parse(rawBody) as typeof json;
      } catch {
        throw new Error(
          `Image generation failed with HTTP ${res.status}: ${rawBody.slice(0, 200)}`
        );
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Image generation failed with HTTP ${res.status}.`);
      }
      setResult(json.data as GenerateResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image generation failed."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [configured, prompt, selectedModel, models, templateId, isGenerating]);

  const handleDownload = useCallback(async () => {
    if (!result) return;

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const response = await fetch(result.image_url);
      if (!response.ok) throw new Error("Failed to fetch image");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Build a friendly filename from the Cloudinary public_id
      const base =
        result.public_id?.split("/").pop() ||
        result.model_used.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
      const ext = (blob.type.split("/")[1] || "png").replace("jpeg", "jpg");

      const a = document.createElement("a");
      a.href = url;
      a.download = `${base}.${ext}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to download image";
      setDownloadError(message);
      // Fallback: open the image in a new tab so the user can save it manually
      window.open(result.image_url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  }, [result]);

  const hasPrompt = prompt.trim().length > 0;

  // Group models by provider, hiding models that are unavailable on their
  // provider (e.g. deprecated / unsupported by the free HF inference tier).
  const hfModels = models.filter(
    (m) => m.provider === "huggingface" && m.available !== false
  );
  const replicateModelsList = models.filter(
    (m) => m.provider === "replicate" && m.available !== false
  );

  return (
    <div className="rounded-xl border bg-card p-3">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Wand2 className="h-4 w-4 text-brand-purple" />
          Generate Image
          {result && (
            <Badge variant="secondary" className="text-[10px]">
              {result.model_name}
            </Badge>
          )}
          {result?.provider && (
            <Badge variant="outline" className="text-[10px]">
              {result.provider}
            </Badge>
          )}
        </div>

        {configured ? (
          <div className="flex items-center gap-2">
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={isGenerating}
            >
              <SelectTrigger className="h-8 w-52 text-xs">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {hfModels.length > 0 && (
                  <>
                    <SelectItem value="hf-header" disabled>
                      <span className="text-muted-foreground">
                        — Hugging Face (Free) —
                      </span>
                    </SelectItem>
                    {hfModels.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </>
                )}
                {replicateModelsList.length > 0 && (
                  <>
                    <SelectItem value="replicate-header" disabled>
                      <span className="text-muted-foreground">
                        — Replicate (Paid) —
                      </span>
                    </SelectItem>
                    {replicateModelsList.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={handleGenerate}
              disabled={!hasPrompt || isGenerating || disabled}
            >
              {isGenerating ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
        ) : (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Add{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              HUGGING_FACE_API_KEY
            </code>{" "}
            or{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              REPLICATE_API_TOKEN
            </code>{" "}
            to .env.local
          </p>
        )}
      </div>

      {/* Loading state */}
      {isGenerating && (
        <div className="mt-2 flex aspect-[4/3] items-center justify-center rounded-lg border bg-muted/40">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Generating — first run can take ~30s…
          </div>
        </div>
      )}

      {/* Error */}
      {error && !isGenerating && (
        <p className="mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      {/* Result */}
      {result && !isGenerating && (
        <div className="mt-2 overflow-hidden rounded-lg border">
          <div className="relative aspect-[4/3] w-full bg-muted">
            <Image
              src={result.image_url}
              alt="Generated image"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          <div className="flex items-center justify-between px-3 py-2 text-[11px] text-muted-foreground">
            <span>
              {result.model_name} · {result.provider} ·{" "}
              {(result.generation_time_ms / 1000).toFixed(1)}s ·{" "}
              {result.width}×{result.height}
            </span>              <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="flex items-center gap-1 text-primary hover:underline disabled:opacity-50"
                title="Download image"
              >
                {isDownloading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Download className="h-3 w-3" />
                )}
                {isDownloading ? "Downloading..." : "Download"}
              </button>
              {downloadError && (
                <span className="text-destructive text-[10px]">
                  {downloadError}
                </span>
              )}
              <a
                href={result.image_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                Open full size <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
