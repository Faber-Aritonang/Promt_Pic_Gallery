// /api/user-versions — CRUD for custom saved prompt versions
// Implemented in Phase 2/3 once Firestore is wired up.
import { type ApiResponse } from "@/lib/types";

export async function GET(): Promise<Response> {
  const body: ApiResponse = {
    success: false,
    error: "Not implemented yet",
    message: "User versions arrive with Phase 2/3.",
  };
  return Response.json(body, { status: 501 });
}

export async function POST(): Promise<Response> {
  const body: ApiResponse = {
    success: false,
    error: "Not implemented yet",
    message: "User versions arrive with Phase 2/3.",
  };
  return Response.json(body, { status: 501 });
}
