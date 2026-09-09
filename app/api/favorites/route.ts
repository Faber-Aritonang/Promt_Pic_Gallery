// /api/favorites — manage user's favorite templates
// GET — list user's favorites (requires auth)
// POST — toggle favorite (requires auth)
// DELETE — remove favorite (requires auth)

import { verifyAuthToken } from "@/lib/services/server-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import type { ApiResponse } from "@/lib/types";

// ── GET /api/favorites ─────────────────────────────────────────────────────

export async function GET(request: Request): Promise<Response> {
  try {
    const user = await verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const db = getAdminDb();
    const snapshot = await db
      .collection("favorites")
      .where("user_id", "==", user.uid)
      .orderBy("created_at", "desc")
      .get();

    const favorites = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json({
      success: true,
      data: { favorites, total: favorites.length },
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/favorites GET] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ── POST /api/favorites (toggle) ───────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." } satisfies ApiResponse,
        { status: 401 }
      );
    }

    let body: { templateId: string };
    try {
      body = (await request.json()) as { templateId: string };
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    if (!body.templateId) {
      return Response.json(
        { success: false, error: "templateId is required." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const db = getAdminDb();

    // Check if already favorited
    const existing = await db
      .collection("favorites")
      .where("user_id", "==", user.uid)
      .where("template_id", "==", body.templateId)
      .limit(1)
      .get();

    if (!existing.empty) {
      // Remove favorite
      await db.collection("favorites").doc(existing.docs[0].id).delete();

      // Update template favorites_count (best effort)
      try {
        const templateRef = db.collection("templates").doc(body.templateId);
        const templateDoc = await templateRef.get();
        if (templateDoc.exists) {
          const currentCount = templateDoc.data()?.favorites_count ?? 0;
          await templateRef.update({
            favorites_count: Math.max(0, currentCount - 1),
          });
        }
      } catch {
        // Non-critical
      }

      return Response.json({
        success: true,
        data: { favorited: false },
      } satisfies ApiResponse);
    }

    // Add favorite
    const now = Date.now();
    await db.collection("favorites").add({
      user_id: user.uid,
      template_id: body.templateId,
      created_at: now,
    });

    // Update template favorites_count (best effort)
    try {
      const templateRef = db.collection("templates").doc(body.templateId);
      const templateDoc = await templateRef.get();
      if (templateDoc.exists) {
        const currentCount = templateDoc.data()?.favorites_count ?? 0;
        await templateRef.update({
          favorites_count: currentCount + 1,
        });
      }
    } catch {
      // Non-critical
    }

    return Response.json({
      success: true,
      data: { favorited: true },
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/favorites POST] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
