// /api/chat — send a message to GLM-3 for prompt refinement
// Implemented in Phase 3 (AI Chat Integration).
import { type ApiResponse } from "@/lib/types";

export async function POST(): Promise<Response> {
  const body: ApiResponse = {
    success: false,
    error: "Not implemented yet",
    message: "Chat endpoints arrive with Phase 3 (AI Chat Integration).",
  };
  return Response.json(body, { status: 501 });
}
