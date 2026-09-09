import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <ShellLayout>
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Back button */}
        <Skeleton className="mb-6 h-8 w-20" />

        {/* Profile header */}
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>

        <Skeleton className="mb-8 h-px w-full" />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-4 text-center">
              <Skeleton className="mx-auto mb-2 h-4 w-28" />
              <Skeleton className="mx-auto h-3 w-40" />
            </div>
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}
