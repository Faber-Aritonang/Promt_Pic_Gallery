"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/layouts/AuthButton";
import { LanguageSwitcher } from "@/components/layouts/LanguageSwitcher";

const navLinks = [
  { href: "/", labelKey: "home" as const },
  { href: "/gallery", labelKey: "gallery" as const },
  { href: "/chat", labelKey: "chat" as const },
];

export function Navbar() {
  const t = useTranslations("nav");
  const tImageGen = useTranslations("imageGen");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-neon-cyan/10">
      {/* Top accent line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20 transition-all group-hover:shadow-neon-sm group-hover:border-neon-cyan/40">
              <span className="text-lg">🏙️</span>
            </div>
            {/* Glow dot */}
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-neon-cyan animate-pulse-glow" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-foreground">
              Promt<span className="text-gradient">Pic</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground -mt-1">
              Gallery
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <nav className="hidden sm:flex items-center gap-1 glass rounded-xl px-1 py-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button
                  key={link.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(
                    "relative text-sm rounded-lg transition-all duration-300",
                    isActive
                      ? "text-neon-cyan bg-neon-cyan/10 shadow-neon-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Link href={link.href}>
                    {isActive && (
                      <span className="absolute inset-0 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20" />
                    )}
                    <span className="relative z-10">{t(link.labelKey)}</span>
                  </Link>
                </Button>
              );
            })}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "relative text-sm rounded-lg transition-all duration-300",
                pathname === "/generate"
                  ? "text-neon-cyan bg-neon-cyan/10 shadow-neon-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <Link href="/generate">
                {pathname === "/generate" && (
                  <span className="absolute inset-0 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20" />
                )}
                <span className="relative z-10">{tImageGen("title")}</span>
              </Link>
            </Button>
          </nav>

          {/* Divider */}
          <div className="hidden sm:block mx-2 h-6 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
