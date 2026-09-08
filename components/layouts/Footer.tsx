import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>🏙️</span>
          <span className="font-medium text-foreground">PromtPicGallery</span>
        </div>
        <p>
          A free prompt template gallery for text-to-image AI. Browse, customize,
          and generate with your favorite models.
        </p>
        <div className="flex gap-4">
          <Link
            href="/gallery"
            className="hover:text-foreground transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/chat"
            className="hover:text-foreground transition-colors"
          >
            Chat
          </Link>
          <Link
            href="https://github.com/Faber-Aritonang/Promt_Pic_Gallery"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
        </div>
        <p className="text-xs">
          © {new Date().getFullYear()} PromtPicGallery. Built with Next.js,
          Firebase & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
