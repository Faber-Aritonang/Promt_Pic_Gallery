"use client";

import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { PromptSuggestions } from "./PromptSuggestions";
import { ImageGenerator } from "./ImageGenerator";
import { TemplateUpload } from "@/components/gallery/TemplateUpload";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Upload,
  Zap,
} from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import type { Template } from "@/lib/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  currentPrompt?: string;
}

interface ChatInterfaceProps {
  template?: Template | null;
}

interface ApiMessage {
  role: "user" | "assistant";
  content: string;
}

/** HTTP failure from /api/chat, carrying the status code when there was one. */
class ChatRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ChatRequestError";
    this.status = status;
  }
}

/**
 * Ask the server's own diagnostics endpoint what it can see (env vars,
 * region, Anthropic reachability). Used when a request fails with an empty
 * body, which happens when the platform kills the function before it can
 * answer — the diagnostics are the only way to tell "bad key" apart from
 * "function never ran".
 */
async function fetchServerDiagnostics(): Promise<string> {
  try {
    const response = await fetch("/api/chat", { cache: "no-store" });
    if (!response.ok) {
      return `\n\nServer diagnostics also failed (HTTP ${response.status}).`;
    }
    const info = (await response.json()) as Record<string, unknown>;
    return `\n\nServer diagnostics: ${JSON.stringify(info)}`;
  } catch {
    return "\n\nServer diagnostics could not be loaded.";
  }
}

/**
 * Turn a non-OK /api/chat response into an error.
 * The body is not guaranteed to be JSON: platform-level failures (function
 * timeout, crash) come back with an empty body, so read it as text.
 */
async function chatRequestError(response: Response): Promise<ChatRequestError> {
  const status = response.status;
  const rawBody = await response.text();

  if (!rawBody) {
    const platformError = response.headers.get("x-vercel-error");
    const vercelId = response.headers.get("x-vercel-id");
    const hints = [
      platformError ? `x-vercel-error: ${platformError}` : null,
      vercelId ? `x-vercel-id: ${vercelId}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    const diagnostics = await fetchServerDiagnostics();

    return new ChatRequestError(
      `Request failed with HTTP ${status}${
        response.statusText ? ` ${response.statusText}` : ""
      }${hints ? ` [${hints}]` : ""} (empty response body)${diagnostics}`,
      status
    );
  }

  try {
    const parsed = JSON.parse(rawBody) as { error?: unknown };
    return new ChatRequestError(
      typeof parsed.error === "string" ? parsed.error : rawBody,
      status
    );
  } catch {
    return new ChatRequestError(rawBody, status);
  }
}

/**
 * Stream a refinement answer (SSE) and return the assembled text.
 * `onChunk` receives the text accumulated so far so the bubble updates live.
 */
async function requestChatStream(
  messages: ApiMessage[],
  templateId: string | undefined,
  signal: AbortSignal,
  onChunk: (fullText: string) => void
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, templateId, stream: true }),
    signal,
  });

  if (!response.ok) throw await chatRequestError(response);

  const reader = response.body?.getReader();
  if (!reader) {
    throw new ChatRequestError(
      "The chat response did not include a readable stream."
    );
  }

  const decoder = new TextDecoder();
  let fullContent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;

      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") return fullContent;

      try {
        const parsed = JSON.parse(data) as {
          content?: string;
          error?: string;
        };
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.content) {
          fullContent += parsed.content;
          onChunk(fullContent);
        }
      } catch (e) {
        // Skip malformed SSE frames, but propagate real API errors.
        if (
          e instanceof Error &&
          e.message !== "Unexpected end of JSON input"
        ) {
          throw e;
        }
      }
    }
  }

  return fullContent;
}

/**
 * Non-streaming fallback — a single JSON response instead of an SSE stream.
 * Used when the streamed request fails before delivering any content.
 */
async function requestChatOnce(
  messages: ApiMessage[],
  templateId: string | undefined,
  signal: AbortSignal
): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, templateId, stream: false }),
    signal,
  });

  if (!response.ok) throw await chatRequestError(response);

  const payload = (await response.json()) as {
    data?: { content?: string };
    error?: string;
  };

  const content = payload.data?.content;
  if (!content) {
    throw new ChatRequestError(
      payload.error || "The chat API returned an empty response."
    );
  }

  return content;
}

export function ChatInterface({ template }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(
    template?.original_prompt || ""
  );
  const [finalPromptCopied, setFinalPromptCopied] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const handleSend = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
        currentPrompt,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      // Create placeholder for AI response
      const aiMessageId = `msg-${Date.now()}-ai`;
      const aiMessage: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);

      try {
        // Build messages for API (exclude the empty AI placeholder)
        const apiMessages = [...messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const abortController = new AbortController();
        abortControllerRef.current = abortController;

        const updateAiMessage = (text: string) =>
          setMessages((prev) =>
            prev.map((m) => (m.id === aiMessageId ? { ...m, content: text } : m))
          );

        let fullContent = "";

        try {
          fullContent = await requestChatStream(
            apiMessages,
            template?.id,
            abortController.signal,
            updateAiMessage
          );

          if (!fullContent) {
            throw new ChatRequestError(
              "The chat response ended before any content was received."
            );
          }
        } catch (streamError) {
          // Streaming (SSE) can be cut off by serverless platforms while the
          // plain JSON response still works, so retry once without streaming
          // when nothing was received yet and the user did not cancel.
          const canFallback =
            !fullContent &&
            !abortController.signal.aborted &&
            (streamError instanceof ChatRequestError
              ? streamError.status === undefined || streamError.status >= 500
              : true);

          if (!canFallback) throw streamError;

          fullContent = await requestChatOnce(
            apiMessages,
            template?.id,
            abortController.signal
          );
          updateAiMessage(fullContent);
        }

        // Extract the refined prompt from the response if present
        const promptMatch = fullContent.match(/```\w*\n([\s\S]*?)```/);
        if (promptMatch) {
          const newPrompt = promptMatch[1].trim();
          setCurrentPrompt(newPrompt);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === aiMessageId
                ? { ...m, currentPrompt: newPrompt }
                : m
            )
          );
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Something went wrong";
        const configHint = /ANTHROPIC_API_KEY|not configured/i.test(errorMsg)
          ? "\n\nPlease check your Anthropic API key configuration and try again."
          : "";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: `⚠️ Error: ${errorMsg}${configHint}` }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [isStreaming, messages, currentPrompt, template]
  );

  const handleClearChat = () => {
    setMessages([]);
    setCurrentPrompt(template?.original_prompt || "");
  };

  const handleCopyFinalPrompt = async () => {
    await navigator.clipboard.writeText(currentPrompt);
    setFinalPromptCopied(true);
    setTimeout(() => setFinalPromptCopied(false), 2000);
  };

  const turnCount = messages.filter((m) => m.role === "user").length;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Header */}
      <div className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href={template ? `/gallery/${template.id}` : "/gallery"}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-sm font-semibold">
                {template ? template.title : "Prompt Refinement Chat"}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {template
                  ? "Refine this prompt with AI assistance"
                  : "Describe your prompt and get AI-powered improvements"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {turnCount > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                <Zap className="mr-1 h-3 w-3" />
                {turnCount} turns
              </Badge>
            )}
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="text-xs"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            )}
            {currentPrompt && currentPrompt !== template?.original_prompt && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowUploadDialog(true);
                  setUploadDialogOpen(true);
                }}
                className="gap-1.5 text-xs"
              >
                <Upload className="h-3 w-3" />
                Save to Gallery
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat area */}
        <div className="flex flex-1 flex-col">
          {messages.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <PromptSuggestions
                onSelect={handleSend}
                templateTitle={template?.title}
              />
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-y-auto">
              <div className="mx-auto max-w-4xl space-y-4 p-4">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    role={msg.role}
                    content={msg.content}
                    timestamp={msg.timestamp}
                    isStreaming={isStreaming && msg.id === messages[messages.length - 1]?.id && msg.role === "assistant"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="shrink-0 border-t bg-background p-4">
            <div className="mx-auto max-w-4xl space-y-3">
              <ImageGenerator
                prompt={currentPrompt}
                templateId={template?.id}
                disabled={isStreaming}
              />
              <ChatInput
                onSend={handleSend}
                disabled={isStreaming}
                placeholder={
                  template
                    ? `Ask me to improve the "${template.title}" prompt...`
                    : "Describe your image prompt and what you'd like to improve..."
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar — Prompt progression (desktop only) */}
        <div className="hidden w-80 shrink-0 border-l lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Prompt Progression</h2>
              <p className="text-[11px] text-muted-foreground">
                Track how your prompt evolves
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* Original prompt */}
              {template && (
                <Card className="mb-3">
                  <CardContent className="p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">
                        Original
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground line-clamp-4">
                      {template.original_prompt}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Current prompt */}
              {currentPrompt && currentPrompt !== template?.original_prompt && (
                <Card className="border-brand-purple/30 bg-brand-purple/5">
                  <CardContent className="p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <Badge className="bg-brand-purple text-[10px]">
                        Current
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={handleCopyFinalPrompt}
                      >
                        {finalPromptCopied ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs leading-relaxed">
                      {currentPrompt}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Turn history */}
              {messages
                .filter((m) => m.role === "user")
                .map((msg, i) => (
                  <div key={msg.id} className="mb-2">
                    <Badge variant="secondary" className="mb-1 text-[10px]">
                      Turn {i + 1}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {msg.content}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upload to Gallery Dialog */}
      {showUploadDialog && (
        <TemplateUpload
          isOpen={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onUploadSuccess={() => {
            setShowUploadDialog(false);
            setUploadDialogOpen(false);
          }}
          prefillPrompt={currentPrompt}
          prefillTitle={template?.title || ""}
          prefillDescription={template?.description || ""}
          prefillGeneratedWith={template?.original_image_generated_with || ""}
        />
      )}
    </div>
  );
}
