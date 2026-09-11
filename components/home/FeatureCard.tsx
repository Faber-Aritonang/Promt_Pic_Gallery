"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  border: string;
  iconColor: string;
  delay?: number;
}

export function FeatureCard({
  href,
  icon,
  title,
  description,
  gradient,
  border,
  iconColor,
  delay = 0,
}: FeatureCardProps) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Link href={href} className="block group">
        <div
          className={cn(
            "relative glass rounded-2xl p-6 sm:p-8",
            border,
            "transition-all duration-500",
            "hover:translate-y-[-6px] hover:rotate-x-2 hover:shadow-neon-lg",
            "cursor-pointer overflow-hidden"
          )}
          style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
        >
          {/* Glow effect on hover */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl bg-gradient-to-b",
              gradient,
              "opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            )}
          />

          {/* Shimmer line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon */}
            <div
              className={cn(
                "inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl",
                "bg-gradient-to-br",
                gradient,
                "border",
                border,
                "mb-4 sm:mb-5",
                "transition-all duration-300",
                "group-hover:scale-110 group-hover:shadow-neon-sm"
              )}
            >
              <div className={iconColor}>{icon}</div>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 sm:mb-5 leading-relaxed">
              {description}
            </p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sm font-semibold text-neon-cyan group-hover:gap-3 transition-all duration-300">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
