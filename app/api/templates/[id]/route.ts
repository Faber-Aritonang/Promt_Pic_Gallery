// GET /api/templates/[id] — single template detail
// Phase 2 (Gallery & Database)
import { type NextRequest } from "next/server";
import { getTemplateById } from "@/lib/services/templates";
import { type ApiResponse } from "@/lib/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;

  const template = await getTemplateById(id);

  if (!template) {
    const body: ApiResponse = {
      success: false,
      error: "Template not found",
    };
    return Response.json(body, { status: 404 });
  }

  const body: ApiResponse = {
    success: true,
    data: template,
  };

  return Response.json(body);
}
