"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/layouts/AuthButton";
import { LanguageSwitcher } from "@/components/layouts/LanguageSwitcher";

const navLinks = [
  { href: "/", labelKey: "home" },
  { href: "/gallery", labelKey: "gallery" },
  { href: "/chat", labelKey: "chat" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl">🏙️</span>
          <span>PromtPicGallery</span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                  "text-sm",
                  pathname === link.href &&
                    "bg-accent text-accent-foreground"
                )}
              >
                <Link href={link.href}>
                  {t(link.labelKey as "gallery" | "chat")}
                </Link>
              </Button>
            ))}
          </nav>
          <div className="ml-2 border-l pl-2 flex items-center gap-2">
            <LanguageSwitcher />
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
