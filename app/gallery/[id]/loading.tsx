import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateDetailLoading() {
  return (
    <ShellLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back button */}
        <Skeleton className="mb-6 h-8 w-24" />

        {/* Title + meta */}
        <div className="mb-6">
          <div className="mb-2 flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
        </div>

        {/* Stats */}
        <div className="mb-6 flex gap-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>

        <Skeleton className="mb-6 h-px w-full" />

        {/* Image + Prompt */}
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-40 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>

        {/* Style tips */}
        <Skeleton className="mt-6 h-28 w-full rounded-lg" />

        {/* Variations */}
        <Skeleton className="mt-4 h-32 w-full rounded-lg" />

        {/* Tags */}
        <div className="mt-6 flex gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}
