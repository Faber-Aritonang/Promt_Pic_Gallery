// /api/user-versions/[id] — individual version CRUD
// GET — get a version (owner or public)
// PUT — update a version (owner only)
// DELETE — delete a version (owner only)

import { verifyAuthToken } from "@/lib/services/server-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import type { ApiResponse, UserVersion } from "@/lib/types";

// ── GET ────────────────────────────────────────────────────────────────────

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection("user_versions").doc(id).get();

    if (!doc.exists) {
      return Response.json(
        { success: false, error: "Version not found." } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const version = { id: doc.id, ...doc.data() } as UserVersion;

    // Check access: owner or public
    const user = await verifyAuthToken(_request);
    if (!version.is_public && (!user || user.uid !== version.user_id)) {
      return Response.json(
        { success: false, error: "Access denied." } satisfies ApiResponse,
        { status: 403 }
      );
    }

    return Response.json({ success: true, data: version } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/user-versions/[id] GET] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ── PUT ────────────────────────────────────────────────────────────────────

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const user = await verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection("user_versions").doc(id).get();

    if (!doc.exists) {
      return Response.json(
        { success: false, error: "Version not found." } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const existing = doc.data() as UserVersion;
    if (existing.user_id !== user.uid) {
      return Response.json(
        { success: false, error: "Access denied." } satisfies ApiResponse,
        { status: 403 }
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

    // Only allow updating certain fields
    const updates: Record<string, unknown> = {};
    if (body.final_prompt !== undefined) updates.final_prompt = body.final_prompt.trim();
    if (body.final_image_url !== undefined) updates.final_image_url = body.final_image_url;
    if (body.final_image_generated_with !== undefined) updates.final_image_generated_with = body.final_image_generated_with;
    if (body.is_public !== undefined) {
      updates.is_public = body.is_public;
      if (body.is_public) updates.shared_at = Date.now();
    }
    if (body.refinement_steps !== undefined) updates.refinement_steps = body.refinement_steps;

    updates.updated_at = Date.now();

    await db.collection("user_versions").doc(id).update(updates);

    const updated = await db.collection("user_versions").doc(id).get();
    return Response.json({
      success: true,
      data: { id: updated.id, ...updated.data() },
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/user-versions/[id] PUT] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}

// ── DELETE ─────────────────────────────────────────────────────────────────

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const user = await verifyAuthToken(request);
    if (!user) {
      return Response.json(
        { success: false, error: "Authentication required." } satisfies ApiResponse,
        { status: 401 }
      );
    }

    const { id } = await params;
    const db = getAdminDb();
    const doc = await db.collection("user_versions").doc(id).get();

    if (!doc.exists) {
      return Response.json(
        { success: false, error: "Version not found." } satisfies ApiResponse,
        { status: 404 }
      );
    }

    const existing = doc.data() as UserVersion;
    if (existing.user_id !== user.uid) {
      return Response.json(
        { success: false, error: "Access denied." } satisfies ApiResponse,
        { status: 403 }
      );
    }

    await db.collection("user_versions").doc(id).delete();

    return Response.json({
      success: true,
      message: "Version deleted.",
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/user-versions/[id] DELETE] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
