"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Eye, Zap } from "lucide-react";
import type { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const difficultyColors = {
    beginner: "bg-success/10 text-success",
    intermediate: "bg-brand-orange/10 text-brand-orange",
    advanced: "bg-destructive/10 text-destructive",
  };

  return (
    <Link href={`/gallery/${template.id}`}>
      <Card className="group overflow-hidden transition-all hover:ring-1 hover:ring-primary/50 hover:shadow-lg">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={template.original_image_url}
            alt={template.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {/* Difficulty badge */}
          <Badge
            variant="secondary"
            className={`absolute left-2 top-2 text-xs ${difficultyColors[template.difficulty_level]}`}
          >
            {template.difficulty_level}
          </Badge>
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-1">
            {template.title}
          </h3>

          {/* Description */}
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>

          {/* Categories */}
          <div className="mt-2 flex flex-wrap gap-1">
            {template.category.slice(0, 3).map((cat) => (
              <Badge key={cat} variant="outline" className="text-xs">
                {cat}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {template.views_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {template.times_used}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              {template.rating.toFixed(1)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
