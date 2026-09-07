"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { GalleryPagination } from "@/components/gallery/GalleryPagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { Template } from "@/lib/types";

interface TemplateListResult {
  templates: Template[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Category {
  id: string;
  label: string;
  count: number;
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <div className="space-y-2 p-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function GalleryContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<TemplateListResult | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "popular";
  const page = searchParams.get("page") ?? "1";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);
        if (page) params.set("page", page);

        const [templatesRes, categoriesRes] = await Promise.all([
          fetch(`/api/templates?${params.toString()}`),
          fetch("/api/templates?categories=true"),
        ]);

        const templatesJson = await templatesRes.json();
        const categoriesJson = await categoriesRes.json();

        if (templatesJson.success) {
          setData(templatesJson.data);
        }
        if (categoriesJson.success) {
          setCategories(categoriesJson.data);
        }
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [q, category, sort, page]);

  return (
    <ShellLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Template Gallery</h1>
          <p className="mt-2 text-muted-foreground">
            Browse and discover prompt templates for text-to-image AI generation.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <GalleryFilters
            categories={categories}
            currentSearch={q}
            currentCategory={category}
            currentSort={sort}
          />
        </div>

        {/* Results count */}
        {data && (
          <p className="mb-4 text-sm text-muted-foreground">
            {data.total} template{data.total !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <GallerySkeleton />
        ) : data ? (
          <GalleryGrid templates={data.templates} />
        ) : (
          <p className="text-center text-muted-foreground">
            Failed to load templates. Please try again.
          </p>
        )}

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="mt-8">
            <GalleryPagination
              currentPage={data.page}
              totalPages={data.totalPages}
            />
          </div>
        )}
      </div>
    </ShellLayout>
  );
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <ShellLayout>
          <div className="mx-auto max-w-6xl px-4 py-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-72 mb-8" />
            <GallerySkeleton />
          </div>
        </ShellLayout>
      }
    >
      <GalleryContent />
    </Suspense>
  );
}
