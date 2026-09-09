// /api/chat-sessions — manage chat sessions
// GET — list user's chat sessions (requires auth)
// POST — create a new chat session (requires auth)

import { verifyAuthToken } from "@/lib/services/server-auth";
import {
  createChatSession,
  listChatSessions,
} from "@/lib/services/chat-sessions";
import type { ApiResponse } from "@/lib/types";

// ── GET /api/chat-sessions ─────────────────────────────────────────────────

export async function GET(request: Request): Promise<Response> {
  try {
    const user = await verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = Number(searchParams.get("offset")) || 0;

    const sessions = await listChatSessions(user.uid, { limit, offset });

    return Response.json({
      success: true,
      data: { sessions, total: sessions.length },
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/chat-sessions GET] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ── POST /api/chat-sessions ────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." } satisfies ApiResponse,
        { status: 401 }
      );
    }

    let body: { templateId?: string };
    try {
      body = (await request.json()) as { templateId?: string };
    } catch {
      body = {};
    }

    const session = await createChatSession({
      userId: user.uid,
      templateId: body.templateId,
    });

    return Response.json({
      success: true,
      data: session,
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/chat-sessions POST] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
