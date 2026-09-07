"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface Category {
  id: string;
  label: string;
  count: number;
}

interface GalleryFiltersProps {
  categories: Category[];
  currentSearch?: string;
  currentCategory?: string;
  currentSort?: string;
}

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Highest Rated" },
  { value: "most_used", label: "Most Used" },
];

export function GalleryFilters({
  categories,
  currentSearch = "",
  currentCategory = "",
  currentSort = "popular",
}: GalleryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset pagination when filters change
      params.delete("page");
      params.delete("offset");
      startTransition(() => {
        router.push(`/gallery?${params.toString()}`);
      });
    },
    [router, searchParams, startTransition]
  );

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            defaultValue={currentSearch}
            onChange={(e) => {
              const value = e.target.value;
              // Debounce: update on change with short delay
              const timeout = setTimeout(() => updateParams("q", value), 300);
              return () => clearTimeout(timeout);
            }}
            className="pl-9"
          />
          {currentSearch && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
              onClick={() => updateParams("q", "")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Sort */}
        <select
          value={currentSort}
          onChange={(e) => updateParams("sort", e.target.value)}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentCategory ? "outline" : "default"}
            size="sm"
            onClick={() => updateParams("category", "")}
            disabled={isPending}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={currentCategory === cat.id ? "default" : "outline"}
              size="sm"
              onClick={() => updateParams("category", cat.id)}
              disabled={isPending}
            >
              {cat.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {cat.count}
              </Badge>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
