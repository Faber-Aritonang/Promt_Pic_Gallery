import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary (PRD Section 5.3 — image storage)
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Unsplash (seed data preview images)
      { protocol: "https", hostname: "images.unsplash.com" },
      // Hugging Face inference + Spaces
      { protocol: "https", hostname: "huggingface.co" },
      { protocol: "https", hostname: "*.hf.space" },
      // Replicate prediction outputs
      { protocol: "https", hostname: "*.replicate.delivery" },
      { protocol: "https", hostname: "replicate.delivery" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
