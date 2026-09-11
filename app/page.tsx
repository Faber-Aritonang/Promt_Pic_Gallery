"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/home/Hero";
import { FeatureCard } from "@/components/home/FeatureCard";
import { StepCard } from "@/components/home/StepCard";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import {
  Sparkles,
  MessageSquare,
  Palette,
  ArrowRight,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  const { ref: featuresRef, isVisible: featuresVisible } = useScrollReveal();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal();

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <Hero />

      {/* ── Features Section ────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div
            ref={featuresRef}
            className={`text-center mb-10 sm:mb-14 transition-all duration-700 ${
              featuresVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 sm:mb-4">
              <span className="text-gradient">Powerful</span> Features
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              Everything you need to master prompt engineering for text-to-image generation.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              href="/gallery"
              icon={<Palette className="h-6 w-6" />}
              title={t("nav.gallery")}
              description={t("gallery.subtitle")}
              gradient="from-neon-cyan/20 to-neon-cyan/5"
              border="border-neon-cyan/20 hover:border-neon-cyan/40"
              iconColor="text-neon-cyan"
              delay={0}
            />
            <FeatureCard
              href="/chat"
              icon={<MessageSquare className="h-6 w-6" />}
              title={t("nav.chat")}
              description={t("chat.subtitle")}
              gradient="from-neon-purple/20 to-neon-purple/5"
              border="border-neon-purple/20 hover:border-neon-purple/40"
              iconColor="text-neon-purple"
              delay={100}
            />
            <FeatureCard
              href="/generate"
              icon={<Zap className="h-6 w-6" />}
              title={t("imageGen.title")}
              description={t("imageGen.subtitle")}
              gradient="from-neon-pink/20 to-neon-pink/5"
              border="border-neon-pink/20 hover:border-neon-pink/40"
              iconColor="text-neon-pink"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* ── How It Works Section ────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative">
        {/* Background accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-neon-purple/3 rounded-full blur-[120px]" />
        </div>

        <div className="mx-auto max-w-5xl relative z-10">
          {/* Section header */}
          <div
            ref={stepsRef}
            className={`text-center mb-10 sm:mb-14 transition-all duration-700 ${
              stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 sm:mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              Three simple steps to create perfect prompts.
            </p>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StepCard
              step="01"
              title="Browse Templates"
              description="Explore our curated collection of 50+ prompt templates across diverse categories."
              delay={0}
            />
            <StepCard
              step="02"
              title="Refine with AI"
              description="Chat with Claude to perfect your prompt with real-time AI assistance and suggestions."
              delay={150}
            />
            <StepCard
              step="03"
              title="Generate Image"
              description="Send your refined prompt to your preferred model and create stunning images."
              delay={300}
            />
          </div>

          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-[55%] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/20 to-neon-cyan/0 -z-10" />
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-4xl">
          <div
            ref={ctaRef}
            className={`relative glass rounded-3xl p-8 sm:p-12 lg:p-16 neon-border overflow-hidden text-center transition-all duration-700 ${
              ctaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 bg-neon-cyan/5 rounded-full blur-[100px]" />
            </div>

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-neon-cyan/20 rounded-tl-3xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-neon-cyan/20 rounded-br-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 sm:mb-6">
                Ready to Create{" "}
                <span className="text-gradient">Amazing</span>{" "}
                Images?
              </h2>
              <p className="text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Join thousands of creators mastering prompt engineering.
                Start for free — no credit card required.
              </p>
              <Link href="/gallery">
                <Button
                  size="lg"
                  className="group gap-2 bg-gradient-to-r from-neon-cyan to-cyan-400 text-background font-bold px-8 sm:px-10 py-6 sm:py-7 text-base rounded-2xl shadow-neon hover:shadow-neon-lg transition-all duration-300 hover:scale-[1.03]"
                >
                  <Sparkles className="h-5 w-5" />
                  Start Exploring
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
