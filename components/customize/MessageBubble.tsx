"use client";

import { Badge } from "@/components/ui/badge";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
  isStreaming?: boolean;
}

export function MessageBubble({
  role,
  content,
  timestamp,
  isStreaming,
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const isUser = role === "user";

  const handleCopy = async () => {
    // Extract prompt from code blocks if present
    const codeBlockMatch = content.match(/```\w*\n([\s\S]*?)```/);
    const textToCopy = codeBlockMatch ? codeBlockMatch[1].trim() : content;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if content contains a code block (refined prompt)
  const hasPromptBlock = content.includes("```");

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-brand-purple text-white"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message body */}
      <div
        className={`flex max-w-[80%] flex-col gap-1 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          {isUser ? "You" : "AI Prompt Coach"}
        </Badge>

        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          }`}
        >
          {/* Render content with code blocks highlighted */}
          <div className="whitespace-pre-wrap break-words">
            {content.split(/(```[\s\S]*?```)/g).map((part, i) => {
              if (part.startsWith("```")) {
                // Extract language and code
                const match = part.match(/```(\w*)\n([\s\S]*?)```/);
                const lang = match?.[1] || "";
                const code = match?.[2]?.trim() || "";
                return (
                  <div key={i} className="my-2 rounded-lg bg-background/50 p-3">
                    {lang && (
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {lang}
                      </div>
                    )}
                    <code className="text-xs leading-relaxed">{code}</code>
                  </div>
                );
              }
              return <span key={i}>{part}</span>;
            })}
          </div>

          {/* Streaming cursor */}
          {isStreaming && (
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
          )}

          {/* Copy button for AI messages with prompt blocks */}
          {!isUser && hasPromptBlock && !isStreaming && (
            <button
              onClick={handleCopy}
              className="absolute -right-2 -top-2 rounded-full bg-background p-1.5 shadow-md transition-colors hover:bg-muted"
              title="Copy refined prompt"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </button>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <span className="text-[10px] text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
      </div>
    </div>
  );
}
