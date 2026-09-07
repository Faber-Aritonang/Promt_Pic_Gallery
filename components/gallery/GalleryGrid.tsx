import { TemplateCard } from "@/components/gallery/TemplateCard";
import { TemplateCardSkeleton } from "@/components/gallery/TemplateCardSkeleton";
import type { Template } from "@/lib/types";

interface GalleryGridProps {
  templates: Template[];
  /** Show skeleton loading placeholders */
  isLoading?: boolean;
  /** Number of skeleton cards to show while loading */
  skeletonCount?: number;
}

export function GalleryGrid({
  templates,
  isLoading = false,
  skeletonCount = 8,
}: GalleryGridProps) {
  // Empty state
  if (!isLoading && templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">
          No templates found
        </p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Existing templates */}
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}

      {/* Skeleton loading placeholders (for initial load or append) */}
      {isLoading &&
        Array.from({ length: skeletonCount }).map((_, i) => (
          <TemplateCardSkeleton key={`skeleton-${i}`} />
        ))}
    </div>
  );
}
