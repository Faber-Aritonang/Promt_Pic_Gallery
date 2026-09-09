// /api/auth — authentication routes
// POST { action: "me" } — get current user profile (requires auth)
// POST { action: "register" } — create/update user profile (requires auth)
// POST { action: "logout" } — client-side sign-out (no-op on server)

import { verifyAuthToken, getOrCreateUser } from "@/lib/services/server-auth";
import type { ApiResponse } from "@/lib/types";

interface AuthRequestBody {
  action: "me" | "register" | "logout";
}

export async function POST(request: Request): Promise<Response> {
  try {
    let body: AuthRequestBody;
    try {
      body = (await request.json()) as AuthRequestBody;
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (!body.action) {
      return Response.json(
        { success: false, error: "action field is required." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    switch (body.action) {
      case "me": {
        const serverUser = await verifyAuthToken(request);
        if (!serverUser) {
          return Response.json(
            { success: false, error: "Not authenticated." } satisfies ApiResponse,
            { status: 401 }
          );
        }

        const user = await getOrCreateUser(serverUser);
        return Response.json({ success: true, data: user } satisfies ApiResponse);
      }

      case "register": {
        const serverUser = await verifyAuthToken(request);
        if (!serverUser) {
          return Response.json(
            { success: false, error: "Not authenticated." } satisfies ApiResponse,
            { status: 401 }
          );
        }

        const user = await getOrCreateUser(serverUser);
        return Response.json({ success: true, data: user } satisfies ApiResponse);
      }

      case "logout": {
        // Server-side logout is a no-op; client handles Firebase sign-out.
        return Response.json(
          { success: true, message: "Signed out successfully." } satisfies ApiResponse
        );
      }

      default:
        return Response.json(
          { success: false, error: `Unknown action: ${body.action}` } satisfies ApiResponse,
          { status: 400 }
        );
    }
  } catch (error) {
    // If requireAuth threw a Response, return it
    if (error instanceof Response) return error;

    console.error("[/api/auth] Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return Response.json(
      { success: false, error: message } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
