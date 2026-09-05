// /api/auth — authentication routes (login, logout, register, me)
// Implemented with Firebase Auth in a later phase.
import { type ApiResponse } from "@/lib/types";

export async function POST(): Promise<Response> {
  const body: ApiResponse = {
    success: false,
    error: "Not implemented yet",
    message: "Auth endpoints arrive with Firebase Auth setup.",
  };
  return Response.json(body, { status: 501 });
}
