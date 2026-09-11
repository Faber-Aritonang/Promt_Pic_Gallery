import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative border-t border-neon-cyan/10 glass-strong">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/20">
                <span className="text-sm">🏙️</span>
              </div>
              <span className="font-bold text-lg">
                Promt<span className="text-gradient">Pic</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              A free prompt template gallery for text-to-image AI. Browse,
              customize, and generate with your favorite models.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Navigate
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                href="/gallery"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors duration-300"
              >
                Gallery
              </Link>
              <Link
                href="/chat"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors duration-300"
              >
                Chat
              </Link>
              <Link
                href="/generate"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors duration-300"
              >
                Generate
              </Link>
              <Link
                href="/profile"
                className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors duration-300"
              >
                Profile
              </Link>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {["Next.js", "React", "Tailwind", "Firebase", "AI"].map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center rounded-md border border-neon-cyan/10 bg-neon-cyan/5 px-2 py-1 text-xs text-neon-cyan/80"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-border/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} PromtPicGallery. Built with Next.js,
              Firebase & Tailwind CSS.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/Faber-Aritonang/Promt_Pic_Gallery"
                target="_blank"
                className="text-xs text-muted-foreground hover:text-neon-cyan transition-colors duration-300"
              >
                GitHub
              </Link>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-green animate-pulse" />
                <span className="text-xs text-muted-foreground">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
