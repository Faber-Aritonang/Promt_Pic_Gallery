"use client";

import { useEffect } from "react";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <ShellLayout>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>

            <div>
              <h1 className="text-xl font-bold">Something went wrong</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                An unexpected error occurred. Please try again.
              </p>
            </div>

            {error.digest && (
              <p className="rounded bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
                Error ID: {error.digest}
              </p>
            )}

            <div className="flex gap-3">
              <Button onClick={reset} variant="default" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShellLayout>
  );
}
