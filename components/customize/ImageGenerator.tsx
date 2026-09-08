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
}

interface GenerateResult {
  image_url: string;
  model_used: string;
  model_name: string;
  width: number;
  height: number;
  generation_time_ms: number;
  created_at: number;
}

interface ModelsResponse {
  configured: boolean;
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
          const defaultModel = data.default_model;
          setSelectedModel((prev) => prev || defaultModel);
        } else if (data.models.length > 0) {
          const firstModel = data.models[0].id;
          setSelectedModel((prev) => prev || firstModel);
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
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel, templateId }),
      });
      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || "Image generation failed.");
      }
      setResult(json.data as GenerateResult);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Image generation failed."
      );
    } finally {
      setIsGenerating(false);
    }
  }, [configured, prompt, selectedModel, templateId, isGenerating]);

  const hasPrompt = prompt.trim().length > 0;

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
        </div>

        {configured ? (
          <div className="flex items-center gap-2">
            <Select
              value={selectedModel}
              onValueChange={setSelectedModel}
              disabled={isGenerating}
            >
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name}
                  </SelectItem>
                ))}
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
            to .env.local to enable
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
              {result.model_name} ·{" "}
              {(result.generation_time_ms / 1000).toFixed(1)}s ·{" "}
              {result.width}×{result.height}
            </span>
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
      )}
    </div>
  );
}