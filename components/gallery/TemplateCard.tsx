"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, Zap, ImageIcon, ArrowUpRight } from "lucide-react";
import type { Template } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
  /** Load image eagerly (above the fold) */
  priority?: boolean;
}

/**
 * Generate a tiny blur placeholder data URL (8x6 solid color).
 * Uses the Unsplash source with blur effect for a lightweight LQIP.
 */
function getBlurDataURL(imageUrl: string): string {
  // Append blur params to Unsplash URL for tiny preview
  if (imageUrl.includes("unsplash.com")) {
    return imageUrl.replace("?w=800", "?w=16&h=12&fit=crop&blur=20&q=1");
  }
  // Fallback: transparent 1x1 pixel
  return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
}

export function TemplateCard({ template, priority = false }: TemplateCardProps) {
  const difficultyColors = {
    beginner: "bg-neon-green/10 text-neon-green border-neon-green/20",
    intermediate: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
    advanced: "bg-neon-pink/10 text-neon-pink border-neon-pink/20",
  };

  const [imgError, setImgError] = useState(false);

  // Optimized sizes: each breakpoint maps to the actual column width
  const imageSizes =
    "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw";

  return (
    <Link href={`/gallery/${template.id}`} className="block group perspective-1000">
      <div className="relative glass rounded-2xl overflow-hidden neon-border transition-all duration-500 hover:translate-y-[-4px] hover:shadow-neon hover:border-neon-cyan/30">
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
          {imgError ? (
            <div className="flex h-full w-full items-center justify-center bg-muted/30">
              <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
            </div>
          ) : (
            <Image
              src={template.original_image_url}
              alt={template.title}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              sizes={imageSizes}
              placeholder="blur"
              blurDataURL={getBlurDataURL(template.original_image_url)}
              quality={75}
              onError={() => setImgError(true)}
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Difficulty badge */}
          <Badge
            variant="secondary"
            className={`absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-wider border ${difficultyColors[template.difficulty_level]} backdrop-blur-sm`}
          >
            {template.difficulty_level}
          </Badge>

          {/* Arrow icon on hover */}
          <div className="absolute right-3 top-3 h-8 w-8 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 backdrop-blur-sm">
            <ArrowUpRight className="h-4 w-4 text-neon-cyan" />
          </div>

          {/* Bottom glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold leading-snug text-foreground group-hover:text-neon-cyan transition-colors duration-300 line-clamp-1 text-sm">
            {template.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {template.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5">
            {template.category.slice(0, 3).map((cat) => (
              <Badge
                key={cat}
                variant="secondary"
                className="text-[10px] font-medium px-2 py-0.5 bg-neon-cyan/5 border border-neon-cyan/10 text-neon-cyan/80 hover:bg-neon-cyan/10 transition-colors"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border/50">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-neon-cyan/50" />
              {template.views_count.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-neon-purple/50" />
              {template.times_used}
            </span>
            <span className="flex items-center gap-1 ml-auto">
              <Star className="h-3 w-3 fill-neon-cyan/60 text-neon-cyan/60" />
              <span className="font-medium text-foreground/70">{template.rating.toFixed(1)}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
