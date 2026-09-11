"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CopyPromptButtonProps {
  /** Text written to the clipboard. */
  prompt: string;
}

/**
 * Copy-to-clipboard button for the prompt cards.
 * This has to live in a Client Component: the gallery detail page is a Server
 * Component, and a function prop such as onClick cannot cross that boundary.
 */
export function CopyPromptButton({ prompt }: CopyPromptButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <Check className="mr-2 h-3 w-3" />
      ) : (
        <Copy className="mr-2 h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy Prompt"}
    </Button>
  );
}
