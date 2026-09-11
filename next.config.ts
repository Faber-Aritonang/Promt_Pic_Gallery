import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Exposed to the client so the running bundle can be identified from the
  // console (`[app] build <sha>`). A tab that was left open keeps executing the
  // JavaScript it loaded, which makes a fix look absent until a full reload.
  env: {
    NEXT_PUBLIC_BUILD_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local",
  },
  // firebase-admin (and its gRPC/google-gax dependency tree) must stay outside
  // the server bundle: bundling it produces a build that loads fine locally but
  // throws at module load in the Vercel function, which surfaces as an empty
  // 500 from every API route that touches Firestore.
  serverExternalPackages: ["firebase-admin"],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Content-Security-Policy",
          value: [
            // Default
            "default-src 'self'",
            // Scripts
            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://www.gstatic.com",
            // Styles
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            // Images
            "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://huggingface.co https://*.hf.space https://*.replicate.delivery https://replicate.delivery https://lh3.googleusercontent.com",
            // Fonts
            "font-src 'self' https://fonts.gstatic.com",
            // Connect (API calls)
            "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://api.anthropic.com https://api-inference.huggingface.co https://api.replicate.com https://res.cloudinary.com",
            // Frame (for Google OAuth popup)
            "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com",
            // Media
            "media-src 'self' blob:",
            // Object
            "object-src 'none'",
            // Base
            "base-uri 'self'",
            // Form
            "form-action 'self'",
            // Frame ancestors
            "frame-ancestors 'none'",
          ].join('; '),
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
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
      // Google user content (profile images)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
