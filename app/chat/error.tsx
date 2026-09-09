"use client";

import { useEffect } from "react";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ChatError]", error);
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
              <h1 className="text-xl font-bold">Chat Error</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                The AI chat encountered an error. This might be a temporary
                issue with the GLM API.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/gallery">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Gallery
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShellLayout>
  );
}
