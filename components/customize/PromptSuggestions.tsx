"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
  templateTitle?: string;
}

const generalSuggestions = [
  "Make this prompt more detailed and vivid",
  "Add lighting and mood descriptors",
  "Suggest a better art style for this concept",
  "Make it work better for DALL·E",
  "Add camera angle and composition details",
  "Simplify this prompt while keeping the key elements",
];

const templateSuggestions = [
  "Improve the composition and framing",
  "Add more atmospheric details",
  "Suggest color palette improvements",
  "Make it more photorealistic",
  "Add cinematic quality descriptors",
  "Optimize for better AI interpretation",
];

export function PromptSuggestions({
  onSelect,
  templateTitle,
}: PromptSuggestionsProps) {
  const suggestions = templateTitle ? templateSuggestions : generalSuggestions;

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-purple/10">
        <Sparkles className="h-6 w-6 text-brand-purple" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold">Start refining your prompt</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {templateTitle
            ? `You're refining: ${templateTitle}`
            : "Tell me what you'd like to improve about your image prompt"}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="h-auto rounded-full px-3 py-1.5 text-xs"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
