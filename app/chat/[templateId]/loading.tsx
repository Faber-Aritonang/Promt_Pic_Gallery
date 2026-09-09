import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function TemplateChatLoading() {
  return (
    <ShellLayout>
      <div className="flex h-[calc(100vh-4rem)] flex-col">
        {/* Header */}
        <div className="shrink-0 border-b bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-6 w-px" />
            <div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="mt-1 h-3 w-64" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3 w-72" />
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-40 rounded-full" />
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t bg-background p-4">
              <div className="mx-auto max-w-4xl space-y-3">
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>

          <div className="hidden w-80 shrink-0 border-l lg:block">
            <div className="border-b px-4 py-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-1 h-3 w-48" />
            </div>
            <div className="space-y-3 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
