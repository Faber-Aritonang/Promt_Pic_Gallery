"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ShellLayout } from "@/components/layouts/ShellLayout";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Skeleton } from "@/components/ui/skeleton";
import type { Template } from "@/lib/types";

interface TemplateListResult {
  templates: Template[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  nextOffset: number;
}

interface Category {
  id: string;
  label: string;
  count: number;
}

const ITEMS_PER_PAGE = 8;

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
  const t = useTranslations("gallery");
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextOffset, setNextOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "popular";

  const buildFetchUrl = useCallback(
    (offset: number) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);
      params.set("limit", String(ITEMS_PER_PAGE));
      params.set("offset", String(offset));
      return `/api/templates?${params.toString()}`;
    },
    [q, category, sort]
  );

  const prevFiltersRef = useRef(`${q}|${category}|${sort}`);
  useEffect(() => {
    const currentFilters = `${q}|${category}|${sort}`;
    if (prevFiltersRef.current === currentFilters && fetchedRef.current) {
      return;
    }
    prevFiltersRef.current = currentFilters;
    fetchedRef.current = true;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const [templatesRes, categoriesRes] = await Promise.all([
          fetch(buildFetchUrl(0)),
          fetch("/api/templates?categories=true"),
        ]);

        if (cancelled) return;

        const templatesJson = await templatesRes.json();
        const categoriesJson = await categoriesRes.json();

        if (cancelled) return;

        if (templatesJson.success) {
          const data: TemplateListResult = templatesJson.data;
          setTemplates(data.templates);
          setTotal(data.total);
          setHasMore(data.hasMore);
          setNextOffset(data.nextOffset);
        }
        if (categoriesJson.success) {
          setCategories(categoriesJson.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch templates:", err);
          setError("Failed to load templates. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [q, category, sort, buildFetchUrl]);

  const fetchNextPage = useCallback(async () => {
    if (loadingMore || !hasMore || nextOffset < 0) return;

    setLoadingMore(true);

    try {
      const res = await fetch(buildFetchUrl(nextOffset));
      const json = await res.json();

      if (json.success) {
        const data: TemplateListResult = json.data;
        setTemplates((prev) => [...prev, ...data.templates]);
        setHasMore(data.hasMore);
        setNextOffset(data.nextOffset);
      }
    } catch (err) {
      console.error("Failed to load more templates:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, nextOffset, buildFetchUrl]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, loading, loadingMore, fetchNextPage]);

  return (
    <ShellLayout>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mb-6">
          <GalleryFilters
            categories={categories}
            currentSearch={q}
            currentCategory={category}
            currentSort={sort}
          />
        </div>

        {!loading && (
          <p className="mb-4 text-sm text-muted-foreground">
            {total} template{total !== 1 ? "s" : ""} found
          </p>
        )}

        {loading ? (
          <GallerySkeleton />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-destructive">{error}</p>
            <button
              onClick={() => {
                fetchedRef.current = false;
                prevFiltersRef.current = "";
                setLoading(true);
              }}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            <GalleryGrid
              templates={templates}
              isLoading={loadingMore}
              skeletonCount={4}
            />

            <div ref={loadMoreRef} className="h-4" aria-hidden="true" />

            {!hasMore && templates.length > 0 && (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                You&apos;ve reached the end of the gallery
              </p>
            )}
          </>
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
