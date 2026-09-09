import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <ShellLayout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-6 py-16">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="mt-4 grid w-full max-w-xl gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}
