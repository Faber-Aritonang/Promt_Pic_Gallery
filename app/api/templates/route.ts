// GET /api/templates — list, search and filter templates
// Phase 2 (Gallery & Database)
import { NextRequest } from "next/server";
import { listTemplates, getCategories } from "@/lib/services/templates";
import { type ApiResponse } from "@/lib/types";

export async function GET(
  request: NextRequest
): Promise<Response> {
  const { searchParams } = request.nextUrl;

  // Parse query parameters
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;
  const sort = (searchParams.get("sort") as "newest" | "popular" | "rating" | "most_used") ?? undefined;
  const page = searchParams.has("page") ? Number(searchParams.get("page")) : undefined;
  const limit = searchParams.has("limit") ? Number(searchParams.get("limit")) : undefined;

  // Special case: ?categories=true returns category list
  if (searchParams.get("categories") === "true") {
    const categories = await getCategories();
    const body: ApiResponse = {
      success: true,
      data: categories,
    };
    return Response.json(body);
  }

  const result = await listTemplates({ q, category, sort, page, limit });

  console.log("[api/templates] List result:", {
    total: result.total,
    hasMore: result.hasMore,
    templateIds: result.templates.map((t) => t.id),
  });

  const body: ApiResponse = {
    success: true,
    data: result,
  };

  return Response.json(body);
}
