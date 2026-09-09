"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { AlertTriangle, Home, Search } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("errors");

  return (
    <ShellLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-yellow-500/10 p-4 mb-6">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
        </div>
        <h1 className="mb-2 text-4xl font-bold">{t("notFound")}</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
          {t("notFoundDesc")}
        </p>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/gallery">
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              {t("goToGallery")}
            </Button>
          </Link>
        </div>
      </div>
    </ShellLayout>
  );
}
