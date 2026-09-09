// API helper utilities for input validation and error handling.

import { checkRateLimit, getClientIp, RATE_LIMITS, type RateLimitConfig } from "./rate-limit";
import type { ApiResponse } from "@/lib/types";

/**
 * Check rate limit and return error Response if exceeded.
 * Returns null if allowed.
 */
export function enforceRateLimit(
  request: Request,
  config: RateLimitConfig = RATE_LIMITS.default
): Response | null {
  const ip = getClientIp(request);
  const result = checkRateLimit(ip, config);

  if (!result.allowed) {
    return Response.json(
      {
        success: false,
        error: "Rate limit exceeded. Please try again later.",
      } satisfies ApiResponse,
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(config.maxRequests),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  return null;
}

/**
 * Validate that a string is a non-empty, safe prompt.
 * Returns error Response if invalid, null if valid.
 */
export function validatePrompt(prompt: string | undefined): Response | null {
  if (!prompt?.trim()) {
    return Response.json(
      { success: false, error: "Prompt is required." } satisfies ApiResponse,
      { status: 400 }
    );
  }

  if (prompt.length > 4000) {
    return Response.json(
      { success: false, error: "Prompt is too long (max 4000 characters)." } satisfies ApiResponse,
      { status: 400 }
    );
  }

  // Basic sanitization check — reject prompts with potential injection
  const dangerous = ["<script", "javascript:", "onerror=", "onload="];
  const lower = prompt.toLowerCase();
  if (dangerous.some((d) => lower.includes(d))) {
    return Response.json(
      { success: false, error: "Prompt contains disallowed content." } satisfies ApiResponse,
      { status: 400 }
    );
  }

  return null;
}

/**
 * Validate that a string is a valid Firestore document ID format.
 */
export function validateId(id: string | undefined): Response | null {
  if (!id?.trim()) {
    return Response.json(
      { success: false, error: "ID is required." } satisfies ApiResponse,
      { status: 400 }
    );
  }

  // Firestore doc IDs can't contain certain characters
  if (id.includes("/") || id.includes("..") || id.includes("#") || id.includes("[") || id.includes("]")) {
    return Response.json(
      { success: false, error: "Invalid ID format." } satisfies ApiResponse,
      { status: 400 }
    );
  }

  return null;
}

/**
 * Safe JSON parse with error handling.
 */
export async function safeJsonParse<T>(request: Request): Promise<{ data: T; error: null } | { data: null; error: Response }> {
  try {
    const data = (await request.json()) as T;
    return { data, error: null };
  } catch {
    return {
      data: null,
      error: Response.json(
        { success: false, error: "Invalid JSON body." } satisfies ApiResponse,
        { status: 400 }
      ),
    };
  }
}
