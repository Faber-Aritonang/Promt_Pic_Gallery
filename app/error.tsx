"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-6">
        <AlertTriangle className="h-12 w-12 text-red-500" />
      </div>
      <h1 className="mb-2 text-4xl font-bold">{t("serverError")}</h1>
      <p className="mb-2 max-w-md text-muted-foreground">
        {t("notFoundDesc")}
      </p>
      {error.digest && (
        <p className="mb-6 font-mono text-sm text-muted-foreground">
          Error ID: {error.digest}
        </p>
      )}
      <div className="flex gap-4">
        <Button variant="outline" onClick={reset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
        <Link href="/">
          <Button className="gap-2">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
