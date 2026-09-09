// /api/user-versions — CRUD for custom saved prompt versions
// GET — list user's saved versions (requires auth)
// POST — save a new version (requires auth)

import { verifyAuthToken } from "@/lib/services/server-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import type { ApiResponse, UserVersion } from "@/lib/types";

// ── GET /api/user-versions ─────────────────────────────────────────────────

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
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get("templateId");
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
    const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

    let query = db
      .collection("user_versions")
      .where("user_id", "==", user.uid)
      .orderBy("created_at", "desc")
      .limit(limit + offset);

    if (templateId) {
      query = db
        .collection("user_versions")
        .where("user_id", "==", user.uid)
        .where("template_id", "==", templateId)
        .orderBy("created_at", "desc")
        .limit(limit + offset);
    }

    const snapshot = await query.get();
    const allDocs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as UserVersion[];

    // Apply offset after fetch (Firestore doesn't support offset natively)
    const versions = allDocs.slice(offset, offset + limit);

    return Response.json({
      success: true,
      data: {
        versions,
        total: allDocs.length,
        hasMore: allDocs.length > offset + limit,
        nextOffset: allDocs.length > offset + limit ? offset + limit : -1,
      },
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/user-versions GET] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ── POST /api/user-versions ────────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  try {
    const user = await verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." } satisfies ApiResponse,
        { status: 401 }
      );
    }

    let body: Partial<UserVersion>;
    try {
      body = (await request.json()) as Partial<UserVersion>;
    } catch {
      return Response.json(
        { success: false, error: "Invalid JSON body." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.template_id) {
      return Response.json(
        { success: false, error: "template_id is required." } satisfies ApiResponse,
        { status: 400 }
      );
    }
    if (!body.final_prompt?.trim()) {
      return Response.json(
        { success: false, error: "final_prompt is required." } satisfies ApiResponse,
        { status: 400 }
      );
    }

    const db = getAdminDb();
    const now = Date.now();

    const versionData: Omit<UserVersion, "id"> = {
      template_id: body.template_id,
      user_id: user.uid,
      refinement_steps: body.refinement_steps ?? [],
      final_prompt: body.final_prompt.trim(),
      final_image_url: body.final_image_url ?? "",
      final_image_generated_with: body.final_image_generated_with ?? "",
      is_public: body.is_public ?? false,
      shared_at: body.is_public ? now : undefined,
      created_at: now,
      stats: body.stats ?? {
        total_refinements: body.refinement_steps?.length ?? 0,
        conversation_turns: body.refinement_steps?.length ?? 0,
        generation_time: 0,
      },
    };

    const docRef = await db.collection("user_versions").add(versionData);

    // Update user stats (best effort)
    try {
      const userRef = db.collection("users").doc(user.uid);
      await userRef.update({
        "stats.total_versions_created":
          ((await userRef.get()).data()?.stats?.total_versions_created ?? 0) + 1,
        updated_at: now,
      });
    } catch {
      // Non-critical — continue
    }

    return Response.json({
      success: true,
      data: { id: docRef.id, ...versionData },
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/user-versions POST] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
