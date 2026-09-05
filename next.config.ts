import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Firebase Storage (PRD Section 5.3)
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      // Hugging Face inference + Spaces
      { protocol: "https", hostname: "huggingface.co" },
      { protocol: "https", hostname: "*.hf.space" },
      // Replicate prediction outputs
      { protocol: "https", hostname: "*.replicate.delivery" },
      { protocol: "https", hostname: "replicate.delivery" },
    ],
  },
};

export default nextConfig;
