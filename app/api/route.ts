// GET /api — health check (Phase 1.6)
export async function GET() {
  return Response.json({
    status: "ok",
    message: "PromtPicGallery API is running",
    phase: "4",
    timestamp: new Date().toISOString(),
  });
}
