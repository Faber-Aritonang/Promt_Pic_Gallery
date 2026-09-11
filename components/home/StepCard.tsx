"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  delay?: number;
}

export function StepCard({ step, title, description, delay = 0 }: StepCardProps) {
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
      <div className="relative glass rounded-2xl p-6 sm:p-8 neon-border group hover:shadow-neon-sm transition-all duration-300 overflow-hidden h-full">
        {/* Big number watermark */}
        <div className="text-5xl sm:text-7xl font-black text-neon-cyan/5 absolute top-2 right-4 select-none group-hover:text-neon-cyan/10 transition-colors duration-300">
          {step}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-sm font-bold text-neon-cyan mb-4 group-hover:shadow-neon-sm transition-all duration-300">
            {step}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/30 to-neon-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  );
}
