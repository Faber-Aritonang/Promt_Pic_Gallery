"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  MessageSquare,
  Palette,
  ArrowRight,
  Zap,
  Globe,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";

const features = [
  {
    icon: Palette,
    titleKey: "nav.gallery",
    descKey: "gallery.subtitle",
    href: "/gallery",
    color: "cyan" as const,
    gradient: "from-neon-cyan/20 to-neon-cyan/5",
    border: "border-neon-cyan/20 hover:border-neon-cyan/40",
    iconColor: "text-neon-cyan",
    shadow: "hover:shadow-neon-sm",
  },
  {
    icon: MessageSquare,
    titleKey: "nav.chat",
    descKey: "chat.subtitle",
    href: "/chat",
    color: "purple" as const,
    gradient: "from-neon-purple/20 to-neon-purple/5",
    border: "border-neon-purple/20 hover:border-neon-purple/40",
    iconColor: "text-neon-purple",
    shadow: "hover:shadow-neon-purple-sm",
  },
  {
    icon: Zap,
    titleKey: "imageGen.title",
    descKey: "imageGen.subtitle",
    href: "/generate",
    color: "pink" as const,
    gradient: "from-neon-pink/20 to-neon-pink/5",
    border: "border-neon-pink/20 hover:border-neon-pink/40",
    iconColor: "text-neon-pink",
    shadow: "hover:shadow-neon-purple-sm",
  },
];

const stats = [
  { icon: Layers, value: "50+", label: "Templates" },
  { icon: Cpu, value: "10+", label: "AI Models" },
  { icon: Shield, value: "100%", label: "Free" },
  { icon: Globe, value: "∞", label: "Generations" },
];

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-neon-cyan/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-3xl" />
          {/* Floating orbs */}
          <div className="absolute top-32 left-[15%] h-2 w-2 rounded-full bg-neon-cyan/40 animate-float" />
          <div className="absolute top-48 right-[20%] h-1.5 w-1.5 rounded-full bg-neon-purple/40 animate-float-slow" />
          <div className="absolute bottom-32 left-[30%] h-1 w-1 rounded-full bg-neon-pink/40 animate-float-delay" />
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="mb-6 glass neon-border px-4 py-1.5 text-neon-cyan text-xs font-medium tracking-wider uppercase"
          >
            <Sparkles className="mr-2 h-3 w-3" />
            AI-Powered Prompt Engineering
          </Badge>

          {/* Title */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="text-foreground">Master </span>
            <span className="text-gradient">Prompt</span>
            <br />
            <span className="text-foreground">Engineering</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {t("home.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/gallery">
              <Button
                size="lg"
                className="group relative gap-2 bg-gradient-to-r from-neon-cyan to-cyan-400 text-background font-semibold px-8 py-6 text-base rounded-xl border-0 shadow-neon hover:shadow-neon-lg transition-all duration-300 hover:scale-[1.02]"
              >
                <Globe className="h-4 w-4" />
                {t("home.browseGallery")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="gap-2 glass neon-border px-8 py-6 text-base rounded-xl hover:bg-neon-cyan/5 hover:border-neon-cyan/30 transition-all duration-300"
              >
                <MessageSquare className="h-4 w-4 text-neon-cyan" />
                {t("home.startChat")}
              </Button>
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-4 neon-border hover:shadow-neon-sm transition-all duration-300"
              >
                <stat.icon className="h-5 w-5 text-neon-cyan/60 mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              <span className="text-gradient">Powerful</span> Features
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Everything you need to master prompt engineering for text-to-image generation.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 md:grid-cols-3 perspective-1000">
            {features.map((feature, index) => (
              <Link key={feature.href} href={feature.href}>
                <div
                  className={`group relative glass rounded-2xl p-6 ${feature.border} transition-all duration-500 hover:translate-y-[-4px] hover:rotate-x-2 ${feature.shadow} cursor-pointer`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} border ${feature.border} mb-4 transition-all duration-300 group-hover:scale-110`}>
                      <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-foreground">
                      {t(feature.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {t(feature.descKey)}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-sm font-medium text-neon-cyan group-hover:gap-3 transition-all duration-300">
                      Get Started
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 relative">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-3">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Three simple steps to create perfect prompts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Browse Templates",
                desc: "Explore our curated collection of 50+ prompt templates across categories.",
              },
              {
                step: "02",
                title: "Refine with AI",
                desc: "Chat with Claude to perfect your prompt with real-time AI assistance.",
              },
              {
                step: "03",
                title: "Generate Image",
                desc: "Send your refined prompt to your preferred model and create stunning images.",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative glass rounded-2xl p-6 neon-border group hover:shadow-neon-sm transition-all duration-300">
                <div className="text-6xl font-black text-neon-cyan/10 absolute top-4 right-4 select-none">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 text-xs font-bold text-neon-cyan mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────────── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="relative glass rounded-3xl p-8 sm:p-12 neon-border overflow-hidden text-center">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to Create <span className="text-gradient">Amazing</span> Images?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Join thousands of creators mastering prompt engineering.
                Start for free — no credit card required.
              </p>
              <Link href="/gallery">
                <Button
                  size="lg"
                  className="group gap-2 bg-gradient-to-r from-neon-cyan to-cyan-400 text-background font-semibold px-8 py-6 text-base rounded-xl shadow-neon hover:shadow-neon-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <Sparkles className="h-4 w-4" />
                  Start Exploring
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
