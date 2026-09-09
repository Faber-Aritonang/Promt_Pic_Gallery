// /api/history — user's generation history
// GET — list user's generated images (requires auth)

import { verifyAuthToken } from "@/lib/services/server-auth";
import { getAdminDb } from "@/lib/firebase-admin";
import type { ApiResponse, GeneratedImage } from "@/lib/types";

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
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));
    const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

    const snapshot = await db
      .collection("generated_images")
      .where("user_id", "==", user.uid)
      .orderBy("created_at", "desc")
      .limit(limit + offset)
      .get();

    const allDocs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as GeneratedImage[];

    const images = allDocs.slice(offset, offset + limit);

    return Response.json({
      success: true,
      data: {
        images,
        total: allDocs.length,
        hasMore: allDocs.length > offset + limit,
        nextOffset: allDocs.length > offset + limit ? offset + limit : -1,
      },
    } satisfies ApiResponse);
  } catch (error) {
    if (error instanceof Response) return error;
    console.error("[/api/history GET] Error:", error);
    return Response.json(
      { success: false, error: "Internal server error" } satisfies ApiResponse,
      { status: 500 }
    );
  }
}
