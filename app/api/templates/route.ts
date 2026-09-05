// /api/templates — list, search and filter templates
// Implemented with Firestore in Phase 2.
import { type ApiResponse } from "@/lib/types";

export async function GET(): Promise<Response> {
  const body: ApiResponse = {
    success: false,
    error: "Not implemented yet",
    message: "Template endpoints arrive with Phase 2 (Gallery & Database).",
  };
  return Response.json(body, { status: 501 });
}
