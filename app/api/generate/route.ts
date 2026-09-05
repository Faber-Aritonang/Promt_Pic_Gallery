// /api/generate — generate an image with the selected model
// Implemented in Phase 4 (Image Generation Backend).
import { type ApiResponse } from "@/lib/types";

export async function POST(): Promise<Response> {
  const body: ApiResponse = {
    success: false,
    error: "Not implemented yet",
    message: "Image generation arrives with Phase 4.",
  };
  return Response.json(body, { status: 501 });
}
